import React, { useEffect, useState } from "react";

interface PropType {
  playAgain: () => void;
}

const PlayAgain:React.FC<PropType> = ({playAgain}) => {

  const [timer, setTimer] = useState(20);

   useEffect(() => {
        const countdown = setInterval(() => {
          setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
    
        return () => {
          clearInterval(countdown);
        };
      }, []);

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
