import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from './components/LandingPage';
import RoomSetup from './components/RoomSetup';
import VideoRoom from './components/VideoRoom';

function App() {
  return (
    <>
      <Toaster richColors position="top-center" closeButton theme="system" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/setup" element={<RoomSetup />} />
        <Route path="/room/:roomId" element={<VideoRoom />} />
      </Routes>
    </>
  );
}

export default App;
