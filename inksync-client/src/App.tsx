import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/view/homepage/Home';
import About from './components/view/homepage/About';
import { DrawingCanvas } from './components/view/homepage/DrawingCanvas';
import { Room } from './components/view/homepage/Room';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/draw" element={<DrawingCanvas />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
