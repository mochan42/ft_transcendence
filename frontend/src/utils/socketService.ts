import { io } from "socket.io-client";
import Cookies from "js-cookie";

let socket: any = null;
let int: number = 0;

export const getSocket = (id: any) => {
  if (!socket && id) {
    socket = io("http://localhost:5000", {
      extraHeaders: {
        "X-Custom-Data": id,
      },
      withCredentials: true,
    });
  }
  return socket;
};
