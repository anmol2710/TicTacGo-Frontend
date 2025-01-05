import React from 'react';
import { ImCross } from "react-icons/im";

interface GameBoardProps {
  board: (string | null)[][];
  isAllowedToMove: boolean;
  result: string | null;
  onMove: (row: number, col: number) => void;
}

const GameBoard = ({ board, isAllowedToMove, result, onMove }: GameBoardProps) => (
  <div>
    {board.map((row, i) => (
      <div key={i} className="grid grid-cols-3 gap-1 w-[350px]">
        {row.map((cell, j) => (
          <button
            disabled={!isAllowedToMove || result !== null}
            className={`w-[100px] h-[100px] flex items-center justify-center m-1 ${
              !isAllowedToMove ? "cursor-not-allowed" : ""
            }`}
            key={j}
            onClick={() => onMove(i, j)}
          >
            {cell === "X" ? (
              <ImCross className="h-8 w-auto" />
            ) : cell === "O" ? (
              <span className="flex h-[100%] w-[100%] relative top-[-1px] items-center justify-center text-5xl font-bold">
                O
              </span>
            ) : null}
          </button>
        ))}
      </div>
    ))}
  </div>
);

export default GameBoard;