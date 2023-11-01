import { io } from "socket.io-client";
import Cookies from "js-cookie";

let socket: any = null;

export const getSocket = (id: any) => {
  if (!Cookies.get('userId'))
    return;
  if (!socket && id) {
    socket = io("https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev", {
      extraHeaders: {
        "X-Custom-Data": id,
      },
    });
  }
  return socket;
};
