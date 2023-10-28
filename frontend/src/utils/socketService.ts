import { io } from "socket.io-client";

let socket: any = null;

export const getSocket = (id: any) => {
  if (!socket && id) {
    socket = io("http://localhost:5000", {
      extraHeaders: {
        "X-Custom-Data": id,
      },
    });
  }
  return socket;
};
