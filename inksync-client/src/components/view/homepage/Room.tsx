import { useParams } from 'react-router-dom';
import { DrawingCanvas } from '../homepage/DrawingCanvas';
import { nanoid } from 'nanoid';

export const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const user = {
    name: 'User-' + nanoid(4), // random name
    color: '#' + Math.floor(Math.random() * 0xffffff).toString(16), // random color
  };

  return roomId ? <DrawingCanvas roomId={roomId} user={user} /> : <p>Invalid room</p>;
};
