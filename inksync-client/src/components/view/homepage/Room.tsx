import { useLocation, useParams } from 'react-router-dom';
import { DrawingCanvas } from '../homepage/DrawingCanvas';

export const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const state = location.state as { name: string; avatar: string };

  const user = {
    name: state?.name || 'Anonymous',
    color: '#' + Math.floor(Math.random() * 0xffffff).toString(16), // or use avatar-based color
    avatar: state?.avatar,
  };

  return roomId ? <DrawingCanvas roomId={roomId} user={user} /> : <p>Invalid room</p>;
};
