import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

const avatars = [
  { label: '🐱 Cat', value: 'cat' },
  { label: '🐶 Dog', value: 'dog' },
  { label: '🦊 Fox', value: 'fox' },
  { label: '🐼 Panda', value: 'panda' },
  { label: '🦁 Lion', value: 'lion' },
];

const Container = styled.div`
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const StyledForm = styled.form``;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  margin-left: 8px;
  padding: 4px;
  width: 70%;
`;

const Select = styled.select`
  margin-left: 8px;
  padding: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  font-weight: bold;
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(avatars[0].value);

  const handleCreateRoom = () => {
    if (!name.trim()) return alert('Please enter your name');

    const newRoomId = nanoid(8);

    navigate(`/room/${newRoomId}`, {
      state: {
        name,
        avatar,
      },
    });
  };

  return (
    <Container>
      <h2>Multiplayer Game</h2>
      <StyledForm onSubmit={(e) => e.preventDefault()}>
        <FormGroup>
          <Label>
            Name:
            <Input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </Label>
        </FormGroup>
        <FormGroup>
          <Label>
            Choose Avatar:
            <Select value={avatar} onChange={(e) => setAvatar(e.target.value)}>
              {avatars.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </Select>
          </Label>
        </FormGroup>
        <Button type="submit">Start Game</Button>
      </StyledForm>
      <button onClick={handleCreateRoom}>Create New Room</button>
    </Container>
  );
};

export default HomePage;
