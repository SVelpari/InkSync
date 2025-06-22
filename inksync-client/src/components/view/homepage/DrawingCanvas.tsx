import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useYjsDrawing } from '../../hooks/websocket/useYjsDrawing';

const Toolbar = styled.div`
  border: 1px solid #ccc;
  top: 10px;
  left: 10px;
  z-index: 10;
  background: white;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StyledCanvas = styled.canvas`
  display: flex;
  cursor: crosshair;
  border: 1px solid red;
`;

const CanvasContainer = styled.div`
  height: 600px;
  width: 800px;
  border: 1px solid black;
`;

export const DrawingCanvas: React.FC<{
  roomId: string;
  user: { name: string; color: string; avatar?: string };
}> = ({ roomId, user }) => {
  // canvasRef: reference to the <canvas> DOM element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // ctxRef: reference to the 2D drawing context of the canvas
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [participants, setParticipants] = useState<
    { name: string; color: string; avatar?: string }[]
  >([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);

  // Draw a line to (x, y) using the current context
  const drawLine = useCallback((x: number, y: number, color: string, stroke: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = stroke;
    ctx.lineTo(x, y);
    ctx.stroke();
  }, []);

  // Clear the canvas using the current context
  const clearCanvasLocally = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Yjs drawing hook: provides addPoint (for local drawing), clearCanvas (broadcast), getUsers (awareness)
  const { addPoint, clearCanvas, getUsers } = useYjsDrawing(
    roomId,
    drawLine, // called by Yjs when remote points arrive
    clearCanvasLocally,
    user,
  );

  // Set up the canvas context and update when color/strokeWidth changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get and configure context
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctxRef.current = ctx;
    }
  }, [color, strokeWidth]);

  // Poll Yjs awareness state for participants
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants(getUsers());
    }, 5000);
    return () => clearInterval(interval);
  }, [getUsers]);

  // Clear canvas button click
  const handleClearClick = () => {
    clearCanvas(); // Broadcast to all users
    // clearCanvasLocally(); // Clear this user's canvas immediately
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    console.log('yy-handleMouseMove: ', isDrawing);
    if (!isDrawing) return;
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    // Instead of drawing directly, send point to Yjs (which will call drawLine for all clients)
    addPoint(x, y, color, strokeWidth);
  };

  const handleMouseUp = () => {
    ctxRef.current?.closePath();
    setIsDrawing(false);
  };

  return (
    <CanvasContainer>
      <div>
        👥 In Room:{' '}
        {participants.map((p, i) => (
          <div key={i} style={{ color: p.color, marginRight: 12 }}>
            {p.avatar ? `(${p.avatar})` : ''} {p.name}
          </div>
        ))}
      </div>

      <Toolbar>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
        />
        <button onClick={handleClearClick}>🧹 Clear</button>
      </Toolbar>
      <StyledCanvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </CanvasContainer>
  );
};
