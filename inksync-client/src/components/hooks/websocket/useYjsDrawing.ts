import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Awareness } from 'y-protocols/awareness';

export function useYjsDrawing(
  roomName: string,
  onRemoteDraw: (x: number, y: number, color: string, strokeWidth: number) => void,
  onClearCanvas: () => void,
  userInfo: { name: string; color: string },
) {
  const ydocRef = useRef<Y.Doc>();
  const awarenessRef = useRef<Awareness>();
  const drawingArrayRef = useRef<Y.Array<any>>();
  const clearSignalRef = useRef<Y.Map<any>>();

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('wss://demos.yjs.dev', roomName, ydoc);
    const awareness = provider.awareness;

    awareness.setLocalStateField('user', userInfo);

    awareness.on('change', () => {
      const states = Array.from(awareness.getStates().values());
      console.log(
        '👥 Users in room:',
        states.map((s) => s.user),
      );
    });

    const drawingArray = ydoc.getArray('drawing');
    drawingArray.observe((event) => {
      event.changes.added.forEach((item) => {
        item.content.getContent().forEach((point: any) => {
          onRemoteDraw(point.x, point.y, point.color, point.strokeWidth);
        });
      });
    });

    const clearSignal = ydoc.getMap('clear');
    clearSignal.observe(() => {
      onClearCanvas();
    });

    ydocRef.current = ydoc;
    awarenessRef.current = awareness;
    drawingArrayRef.current = drawingArray;
    clearSignalRef.current = clearSignal;

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomName, userInfo]);

  const addPoint = (x: number, y: number, color: string, strokeWidth: number) => {
    drawingArrayRef.current?.push([{ x, y, color, strokeWidth }]);
  };

  const clearCanvas = () => {
    drawingArrayRef.current?.delete(0, drawingArrayRef.current.length);
    clearSignalRef.current?.set('clear', Date.now());
  };

  return {
    addPoint,
    clearCanvas,
    getUsers: () => Array.from(awarenessRef.current?.getStates().values()).map((s: any) => s.user),
  };
}
