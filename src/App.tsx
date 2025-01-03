import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Home from './Pages/Home'
import Match from './Pages/Match'
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketController } from './utils/SocketController';

const App = () => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [])

  if (!socket) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <SocketController socket={socket} />
      <Routes>
        <Route path="/" element={<Home socket={socket}/>} />
        <Route path="/match/:boardId" element={<Match socket={socket} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App