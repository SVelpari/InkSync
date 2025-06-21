import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export function useYjsDrawing(
  roomName: string,
  onRemoteDraw: (x: number, y: number, color: string, strokeWidth: number) => void,
) {
  const ydocRef = useRef<Y.Doc>();
  const drawingArrayRef = useRef<Y.Array<any>>();

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('wss://demos.yjs.dev', roomName, ydoc);

    const drawingArray = ydoc.getArray('drawing');
    drawingArray.observe((event) => {
      event.changes.added.forEach((item) => {
        item.content.getContent().forEach((point: any) => {
          onRemoteDraw(point.x, point.y, point.color, point.strokeWidth);
        });
      });
    });

    ydocRef.current = ydoc;
    drawingArrayRef.current = drawingArray;

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomName]);

  const addPoint = (x: number, y: number, color: string, strokeWidth: number) => {
    drawingArrayRef.current?.push([{ x, y, color, strokeWidth }]);
  };

  return { addPoint };
}
