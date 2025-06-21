import { useParams } from 'react-router-dom';
import { DrawingCanvas } from '../homepage/DrawingCanvas';

export const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      {roomId ? <DrawingCanvas roomId={roomId} /> : <p>Invalid room</p>}
    </div>
  );
};
