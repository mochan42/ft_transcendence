import { io } from "socket.io-client";
import Cookies from "js-cookie";

let socket: any = null;
let int: number = 0;

export const getSocket = (id: any) => {
  // if (!Cookies.get('userId'))
  //   return;
  if (!socket && id) {
    int = 10;
    console.log("\n !!! \n !!! \nCreating new Socket.\n")
    socket = io("https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev", {
      extraHeaders: {
        "X-Custom-Data": id,
      },
      withCredentials: true,
    });
  }
  console.log("This is interesting: ",int);
  return socket;
};
