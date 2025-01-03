import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';

const Match = ({ socket }: { socket: Socket }) => {
  
  const params = useParams();
  const [board, setBoard] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));
  const [isAllowedToMove, setIsAllowedToMove] = useState(false);
  const boardId = params.boardId;

  function makeMove(row:number , col:number) {
    socket.emit('makeMove', { boardId,row, col });
  }

  useEffect(() => {
    if (socket) {
      socket.emit('StartGame' , boardId);
      socket.on('yourTurn', (isAllowed: boolean) => {
        console.log(isAllowed)
        setIsAllowedToMove(isAllowed);
      });

      socket.on('moveMade', ({row, col, symbol}) => {
        const newBoard = board.map(row => row.slice());
        newBoard[row][col] = symbol;
        setBoard(newBoard);
      })
    }
  } , [socket , boardId])

  return (
    <div>
      <h1>Match</h1>
      <div>
        {board.map((row, i) => (
          <div key={i}>
            {row.map((cell, j) => (
              <button disabled={!isAllowedToMove} className={`w-20 h-20 m-1 ${!isAllowedToMove ? "cursor-not-allowed":"" } `} key={j} onClick={()=>{makeMove(i , j)}}>{cell}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Match