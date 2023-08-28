import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors'; // Import the cors package

class SocketServer {
  private io: Server;

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000', // Allow requests from your frontend's URL
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('A user connected');

      socket.on('join', (room: string) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
      });

      socket.on('message', (data: { username: string; message: string }) => {
        this.io.to('default').emit('message', data);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }
}

export default SocketServer;
