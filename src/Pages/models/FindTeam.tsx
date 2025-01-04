import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client';

interface FindTeamProps {
  setLoading: (loading: boolean) => void;
  socket: Socket;
}

const FindTeam: React.FC<FindTeamProps> = ({ setLoading, socket }) => {

  const [time, setTime] = useState(30);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    if (time === 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [time]);

  const cancel = () => {
    socket.emit("cancelFindMatch");
    setLoading(false);
  }

  return (
    <div className="h-[50vh] sm:w-[80vw] md:w-[60vw] lg:w-[40vw] flex flex-col items-center justify-center gap-8 rounded-lg shadow-2xl p-8" style={{ backgroundColor: '#1e1e1e', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}>
      <h2 className="font-bold text-2xl sm:text-xl md:text-2xl text-white">Finding Your Team...</h2>
      <h2 className="font-semibold text-xl sm:text-lg md:text-xl text-gray-300">This usually takes {time} seconds</h2>
      <button
        onClick={cancel}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      >
        Cancel
      </button>
    </div>
  )
}

export default FindTeam;
