import React, { useRef, useState, useEffect } from 'react';

type Point = { x: number; y: number };

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);

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

  // Update brush style on color or strokeWidth change
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = strokeWidth;
    }
  }, [color, strokeWidth]);

  const getOffset = (e: React.MouseEvent): Point => {
    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getOffset(e);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { x, y } = getOffset(e);
    ctxRef.current?.lineTo(x, y);
    ctxRef.current?.stroke();
  };

  const handleMouseUp = () => {
    ctxRef.current?.closePath();
    setIsDrawing(false);
  };

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: 10,
          left: 10,
          background: '#fff',
          padding: '10px',
          borderRadius: '8px',
          zIndex: 10,
        }}
      >
        <label>
          🎨 Color:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label style={{ marginLeft: 10 }}>
          ✏️ Stroke:
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
        </label>
      </div>

      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ccc', display: 'block', cursor: 'crosshair' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};
