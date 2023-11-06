import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { BACKEND_URL } from "../data/Global";

let socket: any = null;
let int: number = 0;

export const getSocket = (id: any) => {
  if (!socket && id) {
    socket = io(`${BACKEND_URL}`, {
      extraHeaders: {
        "X-Custom-Data": id,
      },
      withCredentials: true,
    });
  }
  return socket;
};
