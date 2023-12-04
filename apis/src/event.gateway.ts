import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats/chats.service';
import { FriendsService } from './friends/friends.service';
import { CreateFriendDto } from './friends/dto/create-friend.dto';
import { CreateChannelDto } from './channels/dto/create-channel.dto';
import { ChannelsService } from './channels/channels.service';
import { JoinchannelService } from './joinchannel/joinchannel/joinchannel.service';
import { UsersService } from './users/users.service';
import {
  ACCEPTED,
  CHANNEL_TYPE,
  LOG_STATE,
  MEMBER_RANK,
  MEMBER_RIGHTS,
  MEMBER_STATUS,
  PENDING,
} from './APIS_CONSTS';
import { GamequeueService } from './gamequeue/gamequeue.service';
import { GamesService } from './games/games.service';
import { CreateGameDto } from './games/dto/create-game.dto';
import { Friend } from './friends/entities/friend.entity';
import { MessageDto } from './chats/dto/message.dto';
import { Game } from './games/entities/game.entity';
import { timeout } from 'rxjs';
import { CreateJoinchannelDto } from './joinchannel/dto/create-joinchannel-dto';
import { Channel } from './channels/entities/channel.entity';
import { Joinchannel } from './joinchannel/entities/joinchannel.entity';
import { Block } from './chats/entities/block.entity';

type update = {
  player: number;
  paddlePos: number;
};

class GameStateManager {
  private games = new Map<number, Game>();

  startGame(gameId: number, initialState: Game) {
    this.games.set(gameId, initialState);
  }

  updateGame(gameId: number, updateFn: (game: Game) => void) {
    const game = this.games.get(gameId);
    if (game) {
      updateFn(game);
    }
  }

  getGameState(gameId: number): Game | undefined {
    return this.games.get(gameId);
  }

  // paddle1Pos: number = 100;
  // paddle2Pos: number =100;
  // // New properties to store latest paddle positions from clients
  // latestPaddle1Pos: number | null = null;
  // latestPaddle2Pos: number | null = null;

  // // Method to update paddle positions from client inputs
  // setPaddlePosition(paddle: number, posY: number) {
  //   if (paddle === 1) {
  //     this.latestPaddle1Pos = posY;
  //   } else if (paddle === 2) {
  //     this.latestPaddle2Pos = posY;
  //   }
  // }

  endGame(gameId: number) {
    this.games.delete(gameId);
  }
}

const gameStateManager = new GameStateManager();

const roomReadiness = {};

const paddleLengths = [200, 150, 100, 80, 50];
const boostWidth = 80;
const victoryThreshold = 10;
const containerTop = 0;
const containerBottom = 500;
const rightPaddleLeft = 800;
const leftPaddleRight = 10; // Paddle width is 10 pixels

const checkCollision = (game) => {
  let margin = (game.difficulty + 2) * 2 * 3;
  if (game.isBoost && game.includeBoost) {
    margin = margin * 2.5;
  }
  // Ball boundaries
  const ballLeft = game.ballX;
  const ballRight = game.ballX + 8; // Ball width is 8 pixels
  const ballCenter = game.ballY + 4; // half the diameter = radius

  const leftPaddleTop = game.paddle1Y;
  const leftPaddleBottom = game.paddle1Y + paddleLengths[game.difficulty];
  const rightPaddleTop = game.paddle2Y;
  const rightPaddleBottom = game.paddle2Y + paddleLengths[game.difficulty];

  // Calculate relative position of ball within the left paddle
  const relativePosition =
    (ballCenter - leftPaddleTop) / paddleLengths[game.difficulty];

  // Map relative position to an angle between -45 and +45 degrees
  const mappedAngle = (relativePosition * 45) / 2;

  // Calculate the new Y-velocity component based on the mapped angle
  const newSpeedY =
    game.speedX < 0
      ? -((game.difficulty + 2) * 2) * Math.sin((mappedAngle * Math.PI) / 180)
      : (game.difficulty + 2) * 2 * Math.sin((mappedAngle * Math.PI) / 180);

  const randomnessFactor = game.difficulty / 4; // You can adjust this value to control the amount of randomness
  const randomSpeedY = newSpeedY * (1 + Math.random() * randomnessFactor);

  // Check collision with left paddle
  // Check whether Bot made a point
  if (
    ballLeft <= leftPaddleRight + margin &&
    ballLeft >= leftPaddleRight - margin &&
    game.speedX < 0 &&
    ballCenter >= leftPaddleTop - (game.difficulty + 2) * 2 &&
    ballCenter <= leftPaddleBottom + (game.difficulty + 2) * 2
  ) {
    if (game.isBoost) {
      const prevSpeedX = game.speedX;
      game.speedX = prevSpeedX * 0.66;
      game.isBoost(false);
    }
    game.speedX = -game.speedX * 1.2;
    game.speedY = randomSpeedY * 1.2;
  } else if (ballRight < leftPaddleRight && !game.isReset) {
    game.score2 = game.score2 + 1;
    if (game.score2 > victoryThreshold) {
      game.isGameOver = true;
      game.status = 'finished';
    } else {
      game.isReset = true;
      if (game.isBoost) {
        game.speedX = game.speedX * 0.66;
        game.isBoost(false);
      }
    }
    game.speedX = -game.speedX;
  }

  // Check collision with right paddle
  // Check whether Player made a point
  if (
    ballRight >= rightPaddleLeft - margin &&
    ballRight <= rightPaddleLeft + margin &&
    game.speedX > 0 &&
    ballCenter >= rightPaddleTop - (game.difficulty + 2) * 2 &&
    ballCenter <= rightPaddleBottom + (game.difficulty + 2) * 2
  ) {
    if (game.isBoost) {
      game.speedX = game.speedX * 0.66;
      game.isBoost = false;
    }
    game.speedX = -game.speedX * 0.82;
    game.speedY = newSpeedY * 0.82;
  } else if (ballLeft > rightPaddleLeft && !game.isReset) {
    game.score1 = game.score1 + 1;
    if (game.score1 > victoryThreshold) {
      game.isGameOver = true;
      game.status = 'finished';
    }
    game.isReset = true;
    if (game.isBoost) {
      game.speedX = game.speedX * 0.66;
      game.isBoost = false;
    }
    game.speedX = -game.speedX;
  }

  // collision with container top
  if (game.ballY < 0 && game.speedY < 0) {
    game.speedY = -game.speedY;
  }

  // collision with container bottom
  if (game.ballY > containerBottom && game.speedY > 0) {
    game.speedY = -game.speedY;
  }
};

const moveBall = (game) => {
  game.startX = rightPaddleLeft / 2;
  game.startY = containerBottom / 2;

  const boostEndX = game.boostStartX + boostWidth;
  const boostEndY = game.boostStartY + boostWidth;

  const ballCenterX = game.ballX + 4;
  const ballCenterY = game.ballY + 4;

  const isInBoostRegion =
    ballCenterX >= game.boostStartX &&
    ballCenterX <= boostEndX &&
    ballCenterY >= game.boostStartY &&
    ballCenterY <= boostEndY;

  // setIsBoost(isInBoostRegion)
  // Ball is inside the Boost region, increase speed by 50%
  if (isInBoostRegion && !game.isBoost && game.includeBoost) {
    game.speedX = game.speedX * 2.5;
    game.speedY = game.speedY * 2.5;
    game.isBoost = true;
  }
  game.ballX = game.ballX + game.speedX;
  game.ballY = game.ballY + game.speedY;
};

@WebSocketGateway({
  cors: {
    // origin: `${process.env.FRONTEND_URL}`,
    origin: '*',
    credentials: true,
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UsersService,
    private readonly chatsService: ChatsService,
    private readonly friendsService: FriendsService,
    private readonly channelsService: ChannelsService,
    private readonly joinchannelService: JoinchannelService,
    private readonly gameQueueService: GamequeueService,
    private readonly gamesService: GamesService,
  ) {}

  startGameLoop = (game: Game) => {
    gameStateManager.startGame(game.id, game); // Initialize game state

    const gameInterval = setInterval(() => {
      const currentGame = gameStateManager.getGameState(game.id);
      if (!currentGame) {
        clearInterval(gameInterval);
        return;
      }
      moveBall(currentGame);
      checkCollision(currentGame);
      // this.gamesService.update(currentGame); // You need to handle async/await properly
      this.server
        .to(currentGame.id.toString())
        .timeout(5000)
        .emit('gameUpdate', currentGame);
      
      //listening only once the custom event acknowledgement from the client
      const ackPlayer1 = `ackResponse-G${currentGame.id}P${currentGame.player1}`;
      const ackPlayer2 = `ackResponse-G${currentGame.id}P${currentGame.player2}`;

      roomReadiness[currentGame.id].player1Ready.once(ackPlayer1, (response: any) => {
        if (response === null) console.log('Response empty!\n');
        else {
            currentGame.paddle1Y = response.paddlePos;
          }
      });
      
      roomReadiness[currentGame.id].player2Ready.once(ackPlayer2, (response: any) => {
        if (response === null) console.log('Response empty!\n');
        else {
            currentGame.paddle2Y = response.paddlePos;
          }
      });
            
      if (
        currentGame.status === 'finished' ||
        currentGame.status === 'aborted'
      ) {
        clearInterval(gameInterval);
        gameStateManager.endGame(currentGame.id);
      }
    }, 1000 / 2); // 30 FPS
  };

  async handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]) {
    const user = await this.chatsService.getUserFromSocket(socket);
    const allUser = await this.userService.findAll();
    this.server.emit('connected', {
      new: user,
      all: allUser,
    });
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {}

  @SubscribeMessage('userLogout')
  async handleUserLogout(@ConnectedSocket() socket: Socket) {
    const user = await this.chatsService.getUserFromSocket(socket);
    const logoutUser = await this.userService.updateLoginState(
      +user.id,
      LOG_STATE.OFFLINE,
    );
    const allUsers = await this.userService.findAll();
    this.server.emit('logout', { new: logoutUser, all: allUsers });
  }

  @SubscribeMessage('inviteFriend')
  async createFriendship(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: string,
  ) {
    const user = await this.chatsService.getUserFromSocket(socket);
    const friendDto: CreateFriendDto = {
      receiver: +payload,
      sender: user.id,
      relation: PENDING,
      createdAt: new Date().toISOString(),
    };

    const friendShip = await this.friendsService.create(friendDto);
    const friends = await this.friendsService.findAll();

    this.server.emit('inviteFriendSucces', { new: friendShip, all: friends });
  }

  @SubscribeMessage('acceptFriend')
  async updateFriendship(
    @ConnectedSocket() socket: Socket,
    @MessageBody() friendship: number,
  ) {
    const reqToAccept = await this.friendsService.findBYId(friendship);
    const updatedFriend: Friend = { ...reqToAccept, relation: ACCEPTED };
    const friend = await this.friendsService.update(updatedFriend);
    const allFriends = await this.friendsService.findAll();
    this.server.emit('newFriend', { new: friend, all: allFriends });
  }

  @SubscribeMessage('denyFriend')
  async deleteFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() friendShip: number,
  ) {
    const isDelete = await this.friendsService.remove(friendShip);
    await Promise.all([isDelete]);
    const allFriends = await this.friendsService.findAll();
    this.server.emit('deniedFriend', { all: allFriends });
  }

  @SubscribeMessage('createChannel')
  async createChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: any,
  ) {
    const user = await this.chatsService.getUserFromSocket(socket);

    const channel: CreateChannelDto = {
      password: payload.passwd,
      title: payload.title,
      privacy: payload.privacy_state,
      ownerId: +user.id,
    };

    const newChannel = await this.channelsService.create(channel);
    const members = [...payload.members];
    if (members.length && newChannel) {
      const owner = {
        userId: +user.id,
        channelId: newChannel.channelId,
        rank: MEMBER_RANK.OWNER,
        rights: MEMBER_RIGHTS.PRIVILEDGED,
        status: MEMBER_STATUS.ACCEPTED,
      };
      await this.joinchannelService.create(owner);

      const joints = members.map(async (member) => {
        const joinchannelDTo = {
          userId: +member,
          channelId: newChannel.channelId,
          rank: MEMBER_RANK.MEMBER,
          rights: MEMBER_RIGHTS.PRIVILEDGED,
          status: MEMBER_STATUS.INVITE,
        };

        return await this.joinchannelService.create(joinchannelDTo);
      });
      await Promise.all(joints);
    }

    const allMembers = await this.joinchannelService.findAll();
    const allChannels = await this.channelsService.findAll();
    this.server.emit('newChannel', {
      members: allMembers,
      groups: allChannels,
    });
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    const newMessage: MessageDto = { ...message };
    const savedMessage = await this.chatsService.saveMessage(newMessage);
    const allMessages = await this.chatsService.findAllMessages();
    this.server.emit('receiveMessage', { new: savedMessage, all: allMessages });
  }

  @SubscribeMessage('blockFriend')
  async blockFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() block: any,
  ) {
    const blockedUser = await this.friendsService.blockUser(
      +block.blockerUserId,
      +block.blockeeUserId,
    );
    const allBlock = await this.friendsService.findAllBlock();
    this.server.emit('BlockedFriendSucces', {
      new: blockedUser,
      all: allBlock,
    });
  }

  @SubscribeMessage('exitGroup')
  async handleExitGroup(
    @ConnectedSocket() socket: Socket,
    @MessageBody() group: string,
  ) {
    const user = await this.chatsService.getUserFromSocket(socket);
    if (user) {
      const join = await this.joinchannelService.deleteJoin(user.id, +group);
//       const remainMembers = await this.joinchannelService.findAGroupMembers(+group);
//       if (!remainMembers) {
//          await this.chatsService.remove(+group);
//       }
      const allMembers = await this.joinchannelService.findAll();
      this.server.emit('exitGroupSuccess', { new: join, all: allMembers });
    }
  }

  @SubscribeMessage('addUsersToGroup')
  async handleAddUsersToGroup(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ) {
    if (data.group != null && data.users.length != 0) {
      const joins = data.users.members.map(async (el) => {
        const newMember: CreateJoinchannelDto = {
          channelId: +data.group,
          rank: MEMBER_RANK.MEMBER,
          rights: MEMBER_RIGHTS.PRIVILEDGED,
          userId: el.id,
          status: MEMBER_STATUS.INVITE,
        };
        return await this.joinchannelService.create(newMember);
      });
      await Promise.all(joins);
      const allMembers = await this.joinchannelService.findAll();
      console.log(allMembers);
      this.server.emit('newMembers', { new: joins, all: allMembers });
    }
  }

  @SubscribeMessage('setChannelTitle')
  async handleSetChannelTitle(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: Channel,
  ) {
    const updatedChannel = await this.channelsService.updateByEntity(data);
    const allChannels = await this.channelsService.findAll();
    this.server.emit('channelTitleChanged', {
      new: updatedChannel,
      all: allChannels,
    });
  }

  @SubscribeMessage('allBlock')
  async handleAllBlock() {
    const allBlock = await this.friendsService.findAllBlock();
    this.server.emit('allBlockSuccess', allBlock);
  }

  @SubscribeMessage('setGroupPassword')
  async handleSetGroupPassword(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: Channel,
  ) {
    const cryptePasswd = await this.channelsService.cryptPasswd(
      payload.password,
    );
    const update = { ...payload, password: cryptePasswd };
    const updatedChannel = await this.channelsService.updateByEntity(update);
    await Promise.all([updatedChannel]);
    const allChannels = await this.channelsService.findAll();
    this.server.emit('groupPasswordChanged', {
      new: updatedChannel,
      all: allChannels,
    });
  }

  @SubscribeMessage('deleteGroup')
  async handleDeleteGroup(
    @ConnectedSocket() socket: Socket,
    @MessageBody() channelId: number,
  ) {
    const deletedGroup = await this.channelsService.remove(channelId);
    await Promise.all([deletedGroup]);
    const allChannels = await this.channelsService.findAll();

    //!!!!!! DELETE ALL MEMBERS !!!!!!

    this.server.emit('deleteGroupSucces', {
      new: deletedGroup,
      all: allChannels,
    });
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: CreateJoinchannelDto,
  ) {
    const newJoin = await this.joinchannelService.create(payload);
    Promise.all([newJoin]);
    const allMembers = await this.joinchannelService.findAll();

    this.server.emit('joinChannelSucces', { new: newJoin, all: allMembers });
  }

  @SubscribeMessage('declineJoinGroup')
  async handleDeclineJoinGroup(
    @ConnectedSocket() socket: Socket,
    @MessageBody() joinGroup: Joinchannel,
  ) {
    const declinedJoinGroup = await this.joinchannelService.delete(
      joinGroup.id,
    );
    await Promise.all([declinedJoinGroup]);
    const allMembers: Joinchannel[] = await this.joinchannelService.findAll();

    this.server.emit('declinedMemberSuccess', { all: allMembers });
  }

  @SubscribeMessage('acceptJoinGroup')
  async handleAcceptJoinGroup(
    @ConnectedSocket() socket: Socket,
    @MessageBody() joinGroup: Joinchannel,
  ) {
    const newMember = { ...joinGroup, status: MEMBER_STATUS.ACCEPTED };
    const declinedJoinGroup = await this.joinchannelService.update(newMember);
    await Promise.all([declinedJoinGroup]);
    const allMembers = await this.joinchannelService.findAll();

    this.server.emit('acceptMemberSuccess', {
      new: declinedJoinGroup,
      all: allMembers,
    });
  }

  @SubscribeMessage('unblockUser')
  async handleUnblockUser(@MessageBody() payload: any) {
    const unblock = await this.friendsService.unblock(
      +payload.blocker,
      +payload.blockee,
    );
    await Promise.all([unblock]);
    const allBlocks: Block[] = await this.friendsService.findAllBlock();
    this.server.emit('unblockSuccess', allBlocks);
  }

  async updateMemberShip(joinChannel: Joinchannel) {
    const mutedUser = await this.joinchannelService.update(joinChannel);
    await Promise.all([mutedUser]);
    const allMembers = await this.joinchannelService.findAll();
    this.server.emit('memberMuteToggleSuccess', { new: mutedUser, all: allMembers });
  }
  
  @SubscribeMessage('memberPromoteToggle')
  async handlePromote(@MessageBody() payload: Joinchannel) {
    return await this.updateMemberShip(payload);
  }
  
  @SubscribeMessage('memberMuteToggle')
  async handleMute(@MessageBody() payload: Joinchannel) {
    return await this.updateMemberShip(payload);
  }

  @SubscribeMessage('kickMember')
  async handleKickMember(@MessageBody() payload: Joinchannel) {
    const kicked = await this.joinchannelService.delete(payload.id);
    await Promise.all([kicked]);
    const allMembers = await this.joinchannelService.findAll();
    this.server.emit('memberMuteToggleSuccess', { new: payload, all: allMembers });
  }
  /***********************GAME*********************** */

  @SubscribeMessage('requestMatch')
  async handleRequestMatch(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ) {
    console.log('requestMatch was received.\n');
    const player1 = data.player1;
    if (data.player2 > 0) {
      const player2 = data.player2;
      const makeGame = await this.gamesService.makeMatch(
        +player1,
        +player2,
        data.difficulty,
        data.isBoost,
      );
      if (makeGame) {
        const roomId = makeGame.id;
        socket.join(roomId.toString());
        console.log(
          `User ${makeGame.player1} created and joined room: ${roomId}`,
        );
        this.server.emit('invitedToMatch', makeGame);
        console.log('Broadcasting invitedToMatch\n');
      }
    } else {
      const opponent = this.gameQueueService.findOpponent(socket);
      if (opponent) {
        const player2 = await this.chatsService.getUserFromSocket(socket);
        const makeGame = await this.gamesService.makeMatch(
          +player1,
          +player2,
          data.difficulty,
          data.isBoost,
        );

        if (makeGame) {
          socket.emit('matchFound', makeGame);
          opponent.emit('matchFound', makeGame);
        }
      }
    }
  }

  @SubscribeMessage('acceptMatch')
  async handleAcceptMatch(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: Game,
  ) {
    const roomId = data.id;
    const room = this.server.sockets.adapter.rooms.get(roomId.toString());
    console.log('RoomId = ', roomId, '\n', 'data.id = ', data.id, '\n');

    if (room) {
      const user = await this.chatsService.getUserFromSocket(socket);
      const game = await this.gamesService.acceptMatch(data);
      socket.join(roomId.toString());
      console.log(`User ${user.id} joined room: ${roomId}`);
      console.log(
        'Now sending matchFound event to users in room ',
        roomId,
        '\n',
      );
      setTimeout(() => {
        this.server.to(roomId.toString()).emit('matchFound', game); // Notify all clients in the room
      }, 1500); // 1000 milliseconds = 1 second
    } else {
      console.log(`Room ${roomId} not found for user`);
      // Handle the case where the room doesn't exist
    }
    console.log('Game was accepted\n');
  }

  @SubscribeMessage('abortMatch')
  async handleAbortMatch(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: Game,
  ) {
    const roomId = data.id;
    const room = io.sockets.adapter.rooms[roomId];

    if (room) {
      room.sockets.forEach((_, socketId) => {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          socket.leave(roomId);
          console.log(`User ${socketId} left room: ${roomId}`);
        }
      });
      // Optionally, emit an event to inform all clients in the room
      this.server.to(roomId.toString()).emit('matchDenied', {
        roomId,
        message: 'Match request denied, room closed.',
      });
      console.log(`Room ${roomId} cleared and closed due to match denial.`);
    } else {
      // Handle the case where the room doesn't exist or is already empty
      console.log(`Room ${roomId} not found for denial process.`);
    }
    console.log('Game was aborted\n');
  }

  @SubscribeMessage('gameLoop')
  async handleGameLoop(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ) {
    const roomId = data.id;
    console.log('\nGameLoop event read!\n');
    if (!roomReadiness[roomId]) {
      roomReadiness[roomId] = { player1Ready: null, player2Ready: null };
    }
    const user = await this.chatsService.getUserFromSocket(socket);
    console.log('user id: ', user.id);
    console.log('player id: ', data.player1);
    // Update readiness based on which player sent the event
    if (user.id == data.player1) {
      roomReadiness[roomId].player1Ready = socket;
      console.log('Player 1 is ready for the match!\n');
    } else if (user.id == data.player2) {
      roomReadiness[roomId].player2Ready = socket;
      console.log('Player 2 is ready for the match!\n');
    }

    // Check if both players are ready
    if (
      roomReadiness[roomId].player1Ready != null &&
      roomReadiness[roomId].player2Ready != null
    ) {
      console.log('\x1b[32m', 'Starting Game Loop! \n', '\x1b[0m');
      this.startGameLoop(data);
    }
    //   @SubscribeMessage('updatePaddle1')
    //   async handleUpdatePaddle1(
    //   @ConnectedSocket() socket: Socket,
    //   @MessageBody() data: { gameId: number, newY: number },
    // ) {
    //   gameStateManager.setPaddlePosition(1, data.newY);
    //   // The updateGame method expects a function that updates the game state
    //   // gameStateManager.updateGame(data.gameId, (game) => {
    //   //   if (game) {
    //   //     game.paddle1Y = data.newY;
    //   //     // Emit the updated game state to all clients in the room
    //   //     this.server.to(data.gameId.toString()).emit('gameUpdate', game);
    //   //   }
    //   // });

    //   // If you need to save the game state to the database, do it here
    //   // after the in-memory state has been updated
    //   // const game = gameStateManager.getGameState(data.gameId);
    //   // if (game) {
    //   //   await this.gamesService.update(game);
    //   // }
    // }

    // @SubscribeMessage('updatePaddle2')
    // async handleUpdatePaddle2(
    //   @ConnectedSocket() socket: Socket,
    //   @MessageBody() data: { roomId: number, newY: number },
    // ) {
    //   gameStateManager.setPaddlePosition(2, data.newY);
    //   // gameStateManager.updateGame(data.roomId, (game) => {
    //   //   game.paddle2Y = data.newY;
    //   //   // Emit update immediately
    //   //   this.server.to(data.roomId.toString()).emit('gameUpdate', game);
    //   // });

    //   // // Assuming gamesService.update is properly handling async operations
    //   // const game = gameStateManager.getGameState(data.roomId);
    //   // if (game) {
    //   //   await this.gamesService.update(game);
    //   // }
    // }
  }
}
