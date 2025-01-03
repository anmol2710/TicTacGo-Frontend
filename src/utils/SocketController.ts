import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

export const SocketController = ({ socket }:{socket:Socket}) => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on("matchFound", (boardId) => {
      console.log("Match Found");
      console.log(boardId);
      navigate(`/match/${boardId}`);
    });

    return () => {
      socket.off('connect');
      socket.off('matchFound');
    };
  }, [socket, navigate]);

  return null;
};
