import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Port from './pages/Port';

function App() {
  return (
    <Routes>
      <Route path="/port" element={<Port />} />
      <Route path="*" element={<Navigate to="/port" replace />} />
    </Routes>
  );
}

export default App;
