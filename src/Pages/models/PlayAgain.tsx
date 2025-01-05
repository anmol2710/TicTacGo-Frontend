import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface PropType {
  socket: Socket;
  boardId: string;
  setResult: (result: any) => void;
  setBoard: (board: any[][]) => void;
}

const PlayAgain: React.FC<PropType> = ({
  socket,
  boardId,
  setResult,
  setBoard,
}) => {
  const [timer, setTimer] = useState(20);
  const [wantToPlayAgain, setWantToPlayAgain] = useState(false);
  const [askToPlayAgain, setAskToPlayAgain] = useState(false);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, []);

  // Navigate home if timer reaches 0
  useEffect(() => {
    if (timer === 0) navigate("/");
  }, [timer, navigate]);

  // Socket event listeners
  useEffect(() => {
    socket.on("playAgain", () => {
      setAskToPlayAgain(false);
      setBoard(
        Array(3)
          .fill(null)
          .map(() => Array(3).fill(null))
      );
      setResult(undefined);
    });

    socket.on("wantToPlayAgain", () => {
      setWantToPlayAgain(true);
    });

    socket.on("noPlayAgain", () => {
      navigate("/");
    });
  }, [socket, boardId, navigate, setBoard, setResult]);

  const playAgain = () => {
    setAskToPlayAgain(true);
    socket.emit("askPlayAgain", boardId);
    setBoard(
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(null))
    );
    setResult(undefined);
  };

  if (wantToPlayAgain) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="mb-4 font-bold text-xl text-center text-white">
            Match
          </h1>
          <h1 className="mb-6 font-medium text-2xl text-center text-gray-300">
            Do you want to play again?
          </h1>
          <div className="text-center mb-4 text-white">
            Time Remaining: {timer}s
          </div>
          <div className="flex gap-4 justify-center">
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={() => {
                socket.emit("yesPlayAgain", boardId);
                setAskToPlayAgain(false);
                setWantToPlayAgain(false);
              }}
            >
              Yes
            </button>
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={() => {
                socket.emit("noPlayAgain", boardId);
                setAskToPlayAgain(false);
                setWantToPlayAgain(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  } else if (askToPlayAgain) {
    return (
      <div className="flex items-center justify-center flex-col">
        <h1 className="mb-10 font-bold">Match</h1>
        <h1 className="mb-10 font-medium text-4xl">
          Asking opponent to play again
        </h1>
        <button
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          onClick={() => {
            socket.emit("yesPlayAgain", boardId);
            setAskToPlayAgain(false);
            setWantToPlayAgain(false);
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-16">
      <div className="bg-gray-900 p-6 rounded-lg shadow-2xl text-center space-y-4">
        <div className="text-2xl font-bold text-white">
          Time Remaining: {timer}s
        </div>
        <button
          className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition duration-200"
          onClick={playAgain}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default PlayAgain;
