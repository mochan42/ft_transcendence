// import { SubscribeMessage, WebSocketGateway, ConnectedSocket, MessageBody } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// interface GameState {
//   ballX: number;
//   ballY: number;
//   paddle1Y: number;
//   paddle2Y: number;
//   id: string; // Unique identifier for the match
// }

// @WebSocketGateway({ namespace: '/game' })
// export class GameGateway {
//   @SubscribeMessage('startGame')
//   handleStartGame(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: any,
//   ) {
//     // Initialize game state here, maybe fetch from a service or database if necessary
//     const gameState: GameState = {
//       ballX: 0,
//       ballY: 0,
//       paddle1Y: 0,
//       paddle2Y: 0,
//       id: Math.random().toString(),
//     };

//     // Broadcast to both players in the game
//     this.Server.emit('gameState', gameState);
//   }

//   @SubscribeMessage('movePaddle')
//   handleMovePaddle(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: { deltaY: number, player: 'paddle1Y' | 'paddle2Y', id: string },
//   ) {
//     // This is a simplified version. You would probably have some validation
//     // and check that the socket.id is allowed to move the requested paddle
//     const gameState: GameState = this.getGameState(data.id);
//     gameState[data.player] += data.deltaY;

//     // Emit updated position to both clients
//     this.server.to(data.id).emit('gameState', gameState);
//   }

//   @SubscribeMessage('updateBallPosition')
//   handleUpdateBallPosition(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: { ballX: number, ballY: number, id: string },
//   ) {
//     // Update ball position based on client's data
//     const gameState: GameState = this.getGameState(data.id);
//     gameState.ballX = data.ballX;
//     gameState.ballY = data.ballY;

//     // Broadcast the new game state to both players
//     this.server.to(data.id).emit('gameState', gameState);
//   }

//   @SubscribeMessage('updateMatchClient')
//   handleUpdateMatch(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: any,
//   ){
//     // Here, you could update the game state or any other game logic as needed
//     const updatedState = this.updateGameState(data);
//     // Then emit the updated state to the specific game room
//     this.server.to(data.id).emit('updateMatch', updatedState);
//   }

//   // Utility function to get game state, for example, from a stored in-memory object or a database
//   private getGameState(gameId: string): GameState {
//     // Fetch the game state from your data storage
//     // Placeholder for fetching logic
//     return /* fetched game state */;
//   }

//   // Utility function to update the game state
//   private updateGameState(data: any): GameState {
//     // Update the game state based on the data received
//     // Placeholder for update logic
//     // Return the updated game state
//     return /* updated game state */;
//   }
// }
