import { useEffect, useState } from 'react'
import '../App.css'
import { io, Socket } from 'socket.io-client'

function Home() {
  const [socket , setSocket] = useState<Socket>()
  
  useEffect(() => {
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket);
    newSocket.on('connect', () => {
      console.log('connected')
    })
    
    newSocket.on("matchFound", (data) => {
      console.log("Match Found")
      console.log(data)
    })

    return () => {
      newSocket.disconnect();
    };
  }, [])
  
  function findMatch() {
    console.log("findMatch")
    if (socket) { 
      socket.emit('findMatch')
    }
  }
  return (
    <>
      <button onClick={findMatch}>Find Match</button>     </>
  )
} export default Home