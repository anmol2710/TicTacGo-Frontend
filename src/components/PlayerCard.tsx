import React from 'react';
import { ImCross } from "react-icons/im";

interface PlayerCardProps {
  isYou?: boolean;
  playerSymbol: string;
  isAllowedToMove?: boolean;
}

const PlayerCard = ({ isYou = false, playerSymbol, isAllowedToMove }: PlayerCardProps) => (
  <div className={`bg-gray-800 shadow-lg rounded-lg p-4 w-40 ${isAllowedToMove && isYou ? 'ring-2 ring-blue-500' : ''}`}>
    <div className="text-center">
      <p className="text-gray-300 font-medium mb-2">{isYou ? 'You' : 'Opponent'}</p>
      <div className="w-12 h-12 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
        {playerSymbol === 'X' ? (
          <ImCross className="h-6 w-6 text-white" />
        ) : (
          <span className="text-3xl font-bold text-white">O</span>
        )}
      </div>
      {isAllowedToMove && isYou && (
        <div className="mt-2 text-sm text-blue-400 font-medium">
          Your turn!
        </div>
      )}
    </div>
  </div>
);

export default PlayerCard;