import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { ImCross } from "react-icons/im";

enum result{
    winner = "winner",
    looser = "looser",
    draw = "draw"
}

const Match = ({ socket }: { socket: Socket }) => {
  
  const params = useParams();
  const [board, setBoard] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));
  const [isAllowedToMove, setIsAllowedToMove] = useState(false);
  const [result , setResult] = useState<result>();
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
        setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[row][col] = symbol;
        return newBoard; 
      });
      })

      socket.on("gameFinish", ({ result }: { result: string }) => {
        setResult(result as result);
        console.log(result)
      })
    }
  }, [socket, boardId])
  
  // if (result === 'winner') {
  //   return <h1>Winner</h1>
  // }

  // else if (result === 'looser') { 
  //   return <h1>Looser</h1>
  // }

  // else if (result === 'draw') {
  //   return <h1>Draw</h1>
  // }

  return (
    <div className='flex items-center justify-center flex-col'>
      <h1 className='mb-10 font-bold'>Match</h1>

      {
        result == 'winner' ? <h1 className='mb-10 font-medium text-4xl'>Yay! You won the Match🥳🍾</h1> : result === 'looser' ?  <h1 className='mb-10 font-medium text-4xl'>Oops! You lose the match😟</h1> : result === 'draw' ? <h1 className='mb-10 font-medium text-4xl'>Hey! Its a Draw😊</h1> : <></>
      }
      <div>
        {board.map((row, i) => (
          <div key={i}  className='grid grid-cols-3 gap-1 w-[350px]'>
            {row.map((cell, j) => (
              <button disabled={!isAllowedToMove || !(result == null)} className={`w-[100px] h-[100px] flex items-center justify-center m-1 ${!isAllowedToMove ? "cursor-not-allowed":"" } `} key={j} onClick={()=>{makeMove(i , j)}}>
                {
                  cell == 'X' ? <ImCross className='h-8 w-auto'/> : cell == 'O' ? <span className='flex h-[100%] w-[100%] relative top-[-1px] items-center justify-center text-5xl font-bold'>O</span> : cell
                }
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Match