import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { ImCross } from "react-icons/im";
import PlayAgain from './models/PlayAgain';

enum result {
  winner = "winner",
  looser = "looser",
  draw = "draw"
}

const Match = ({ socket }: { socket: Socket }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(20);
  const [opponentTimer, setOpponentTimer] = useState(20);
  const [board, setBoard] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));
  const [isAllowedToMove, setIsAllowedToMove] = useState(false);
  const [result, setResult] = useState<result>();
  const [symbol, setSymbol] = useState<string>('');
  const [wantToPlayAgain, setWantToPlayAgain] = useState(false);
  const [askToPlayAgain, setAskToPlayAgain] = useState(false);
  const [showPlayAgainModal, setShowPlayAgainModal] = useState(false);
  const [opponentTurn, setOpponentTurn] = useState(false);
  const boardId = params.boardId;

  function makeMove(row: number, col: number) {
    socket.emit('makeMove', { boardId, row, col });
  }

  function makeRandomMove() {
    const emptyCells: [number, number][] = [];
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell) emptyCells.push([i, j]);
      });
    });
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      makeMove(row, col);
    }
  }

  useEffect(() => {
    let turnTimer: NodeJS.Timeout;
    let opponentTurnTimer: NodeJS.Timeout;
    if (result === undefined) {
      if (isAllowedToMove) {
        setTimer(20);
        setOpponentTurn(false);
        turnTimer = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(turnTimer);
              makeRandomMove();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setOpponentTurn(true);
        setOpponentTimer(20);
        opponentTurnTimer = setInterval(() => {
          setOpponentTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
      }
    }
    return () => {
      clearInterval(turnTimer);
      clearInterval(opponentTurnTimer);
    };
  }, [isAllowedToMove, board, result]);

  useEffect(() => {
    if (socket) {
      socket.emit('StartGame', boardId);

      socket.on('symbol', (symbol: string) => {
        setSymbol(symbol);
      });

      socket.on('yourTurn', (isAllowed: boolean) => {
        setIsAllowedToMove(isAllowed);
      });

      socket.on('moveMade', ({ row, col, symbol }) => {
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          newBoard[row][col] = symbol;
          return newBoard;
        });
      });

      socket.on("gameFinish", ({ result }: { result: string }) => {
        setResult(result as result);
        setIsAllowedToMove(false);
      });

      socket.on("playAgain", () => {
        setAskToPlayAgain(false);
        setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
        setResult(undefined);
      });

      socket.on("wantToPlayAgain", () => {
        setWantToPlayAgain(true);
      });

      socket.on("noPlayAgain", () => {
        navigate('/');
      });
    }
  }, [socket, boardId]);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setShowPlayAgainModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const playAgain = () => {
    setAskToPlayAgain(true);
    socket.emit('askPlayAgain', boardId);
    setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
    setResult(undefined);
  };

  if (wantToPlayAgain) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="mb-4 font-bold text-xl text-center text-white">Match</h1>
          <h1 className="mb-6 font-medium text-2xl text-center text-gray-300">Do you want to play again?</h1>
          <div className="text-center mb-4 text-white">Time Remaining: {timer}s</div>
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="mb-4 font-bold text-xl text-center text-white">Match</h1>
          <h1 className="mb-6 font-medium text-2xl text-center text-gray-300">Asking opponent to play again</h1>
          <div className="text-center mb-4 text-white">Time Remaining: {timer}s</div>
          <div className="flex gap-4 justify-center">
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={() => {
                socket.emit("noPlayAgain", boardId);
                setAskToPlayAgain(false);
                setWantToPlayAgain(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center flex-col'>
      <h1 className='mb-10 font-bold'>Match</h1>

      {result === 'winner' && <h1 className='mb-10 font-medium text-4xl'>Yay! You won the Match🥳🍾</h1>}
      {result === 'looser' && <h1 className='mb-10 font-medium text-4xl'>Oops! You lose the match😟</h1>}
      {result === 'draw' && <h1 className='mb-10 font-medium text-4xl'>Hey! It’s a Draw😊</h1>}

      {result === undefined && isAllowedToMove && (
        <div className='mb-4 text-lg font-semibold text-red-500'>Your Turn: {timer}s</div>
      )}
      {result === undefined && opponentTurn && (
        <div className='mb-4 text-lg font-semibold text-blue-500'>Opponent's Turn: {opponentTimer}s</div>
      )}

      <div>
        {board.map((row, i) => (
          <div key={i} className='grid grid-cols-3 gap-1 w-[350px]'>
            {row.map((cell, j) => (
              <button
                disabled={!isAllowedToMove || result !== undefined}
                className={`w-[100px] h-[100px] flex items-center justify-center m-1 ${!isAllowedToMove ? "cursor-not-allowed" : ""}`}
                key={j}
                onClick={() => makeMove(i, j)}
              >
                {cell === 'X' ? <ImCross className='h-8 w-auto' /> : cell === 'O' ? <span className='text-5xl font-bold'>O</span> : cell}
              </button>
            ))}
          </div>
        ))}
      </div>
      {result && showPlayAgainModal && <PlayAgain playAgain={playAgain} />}
    </div>
  );
};

export default Match;
