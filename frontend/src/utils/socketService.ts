import { io } from "socket.io-client";
import Cookies from "js-cookie";

let socket: any = null;
let int: number = 0;

export const getSocket = (id: any) => {
  if (!socket && id) {
    socket = io("https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev", {
      extraHeaders: {
        "X-Custom-Data": id,
      },
      withCredentials: true,
    });
  }
  return socket;
};
