import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useYjsDrawing } from '../../hooks/websocket/useYjsDrawing';

type Point = { x: number; y: number };

const Toolbar = styled.div`
  position: fixed;
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
  display: block;
  cursor: crosshair;
`;

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);

  // Draw line on canvas
  const drawLine = (x: number, y: number, color: string, stroke: number) => {
    if (!ctxRef.current) return;
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = stroke;
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  // Clear the canvas locally
  const clearCanvasLocally = () => {
    const canvas = canvasRef.current;
    if (canvas && ctxRef.current) {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Initialize Yjs drawing hook
  const { addPoint, clearCanvas } = useYjsDrawing(
    'shared-canvas-room',
    drawLine,
    clearCanvasLocally,
  );

  // Clear canvas button click
  const handleClearClick = () => {
    clearCanvas(); // Broadcast to all users
    clearCanvasLocally(); // Clear this user's canvas immediately
  };

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctxRef.current = ctx;
    }
  }, []);

  // Update brush color/stroke width
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = strokeWidth;
    }
  }, [color, strokeWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    drawLine(x, y, color, strokeWidth);
    addPoint(x, y, color, strokeWidth);
  };

  const handleMouseUp = () => {
    ctxRef.current?.closePath();
    setIsDrawing(false);
  };

  return (
    <div>
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
    </div>
  );
};
