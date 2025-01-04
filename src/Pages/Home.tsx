import { Socket } from "socket.io-client";
import "../App.css";
import { useState } from "react";
import FindTeam from "./models/FindTeam";

function Home({socket}:{socket:Socket}) {
  const [loading , setLoading] = useState(false);

  function findMatch() {
    setLoading(true);
    console.log("findMatch");
    if (socket) {
      socket.emit("findMatch");
    }
  }

  if (loading) {
    return <FindTeam setLoading={setLoading} socket={socket} />;
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
