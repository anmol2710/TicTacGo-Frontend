import { useEffect, useState } from "react";
import "../App.css";
import { io, Socket } from "socket.io-client";

function Home() {
  const [socket, setSocket] = useState<Socket>();

  // useEffect(() => {
  //   const newSocket = io('http://localhost:3000')
  //   setSocket(newSocket);
  //   newSocket.on('connect', () => {
  //     console.log('connected')
  //   })

  //   newSocket.on("matchFound", (data) => {
  //     console.log("Match Found")
  //     console.log(data)
  //   })

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, [])

  function findMatch() {
    console.log("findMatch");
    if (socket) {
      socket.emit("findMatch");
    }
  }
  return (
    <>
    <div className="container flex flex-col gap-6">
      <h1 className="font-extrabold">Play Tic Tac Go!</h1>

      <button onClick={findMatch} className="mt-4 p-4 text-xl">Play With a Friend</button>
      <button onClick={findMatch} className="p-4 text-xl" >Play with Bot</button>
      <button onClick={findMatch} className="p-4 text-xl" >Play Online with Random Player</button>
      </div>
    </>
  );
}
export default Home;
