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
import { StatService } from './stat/stat.service';
import { UpdateGameDto } from './games/dto/update-game.dto';
import { UpdateStatDto } from './stat/dto/update-stat.dto';
import { CreateStatDto } from './stat/dto/create-stat.dto';
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 15; 

type update = {
  player: number;
  paddlePos: number;
};

class GameStateManager {
  private games = new Map<number, Game>();

  startGame(gameId: number, initialState: Game) {
    this.games.set(gameId, initialState);
  }

  setGame(game: Game) {
    this.games.set(game.id, game);
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

}

const gameStateManager = new GameStateManager();

const roomReadiness = {};

const conHeight = 600;
const conWidth = 1200;
const paddleLengths = [200, 150, 100, 80, 50];
const boostWidth = 80;
const victoryThreshold = 5;
const startX = (conWidth - 30) / 2;
const startY = (conHeight - 30) / 2;
const containerTop = 0;
const paddleThickness = 10;
const containerBottom = conHeight;
const rightPaddleLeft = conWidth - paddleThickness;
const leftPaddleRight = paddleThickness;

const checkCollision = (game: Game) => {
  let margin = (game.difficulty + 2) * 2;
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
      ? -((game.difficulty + 10) * 2) * Math.sin((mappedAngle * Math.PI) / 180)
      : (game.difficulty + 10) * 2 * Math.sin((mappedAngle * Math.PI) / 180);

  const randomnessFactor = game.difficulty / 4; // You can adjust this value to control the amount of randomness
  const randomSpeedY = newSpeedY * (1 + Math.random() * randomnessFactor);

  // Check collision with left paddle
  if (
    (ballLeft <= (leftPaddleRight)) &&
    // (ballLeft >= (leftPaddleRight - margin)) &&
    (game.speedX < 0) &&
    (ballCenter >= (leftPaddleTop - 5)) &&
    (ballCenter <= (leftPaddleBottom + 5))
  ) {
    // if (game.isBoost) {
    //   const prevSpeedX = game.speedX;
    //   game.speedX = prevSpeedX * 0.66;
    //   game.isBoost = false;
    // }
    game.speedX = -game.speedX * 1.20;
    game.speedY = randomSpeedY * 1.20;
  } else if ((ballRight < leftPaddleRight) && !game.isReset) {
    game.score2 = game.score2 + 1;
    if (game.score2 >= victoryThreshold) {
      game.isGameOver = true;
      game.status = 'finished';
    } else {
      game.isReset = true;
      // if (game.isBoost) {
      //   game.speedX = game.speedX * 0.66;
      //   game.isBoost = false;
      // }
    }
    game.speedX = -game.speedX;
  }

  // Check collision with right paddle
  if (
    (ballRight >= (rightPaddleLeft - 25)) &&
    // (ballRight <= (rightPaddleLeft + margin)) &&
    (game.speedX > 0) &&
    (ballCenter >= (rightPaddleTop - 5)) &&
    (ballCenter <= (rightPaddleBottom + 5))
  ) {
    // if (game.isBoost) {
    //   game.speedX = game.speedX * 0.66;
    //   game.isBoost = false;
    // }
    game.speedX = -game.speedX * 1.2;
    game.speedY = newSpeedY * 1.2;
  } else if ((ballLeft > rightPaddleLeft) && !game.isReset) {
    game.score1 = game.score1 + 1;
    if (game.score1 >= victoryThreshold) {
      game.isGameOver = true;
      game.status = 'finished';
    }
    game.isReset = true;
    // if (game.isBoost) {
    //   game.speedX = game.speedX * 0.66;
    //   game.isBoost = false;
    // }
    game.speedX = -game.speedX;
  }

  // collision with container top
  if (game.ballY <= 0 && game.speedY < 0) {
    game.speedY = -game.speedY;
  }

  // collision with container bottom
  if ((game.ballY + 8) >= (containerBottom - 25)) { // game.ballY is the upper side of the ball. 8 is the diameter
    game.speedY = -game.speedY;
  }
};

const moveBall = (game: Game) => {
  // game.startX = rightPaddleLeft / 2;
  // game.startY = containerBottom / 2;

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

// const updateBoost = (game: Game) => {
//   if (game.isBoost && game.includeBoost) {
//     const minX = startX / 2;
//     const maxX = startX + minX;
//     const minY = startY / 2;
//     const maxY = startY + minY;

//     // Calculate the random coordinates for the Boost region
//     game.boostX= minX + Math.random() * (maxX - minX);
//     game.boostY = minY + Math.random() * (maxY - minY);
//   }
// }

const handleReset = (game: Game) => {
  const itsdifficult = (game.difficulty + 2) * 2;
  game.ballX = conWidth / 2;
  game.ballY = conHeight / 2;
  game.speedX = ((Math.sign(game.speedX) * itsdifficult)  + ((Math.random() * itsdifficult)));
  if (game.speedX < 5 + game.difficulty){
    game.speedX = 5 + game.difficulty * 5;
  }
  game.speedY = ((Math.sign(game.speedY) * itsdifficult)  + ((Math.random() * itsdifficult)));
  if (game.speedY < 5 + game.difficulty){
    game.speedY = 5 + game.difficulty * 5;
  }
  game.isReset = false;
}

@WebSocketGateway({
  cors: {
    origin: `${process.env.FRONTEND_URL}`,
    //origin: '*',
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
    private readonly userStats: StatService
  ) {}

  updatePlayersXp = async (game: Game) => {
    if (game.score1 > game.score2) {
      const updatePlayer1Xp = await this.userService.updateUserXp(game.player1, 120);
      const updatePlayer2Xp = await this.userService.updateUserXp(game.player2, 80);
      return await Promise.all([updatePlayer1Xp, updatePlayer2Xp]);
    }
    const updatePlayer1Xp = await this.userService.updateUserXp(game.player1, 80);
    const updatePlayer2Xp = await this.userService.updateUserXp(game.player2, 120);
    return await Promise.all([updatePlayer1Xp, updatePlayer2Xp]);
  }
  startGameLoop = async (game: Game) => {
    gameStateManager.startGame(game.id, game); // Initialize game state
    console.log("Game loop initiated for game id ", game.id, ". game information: ", gameStateManager.getGameState(game.id));
    this.userService.updateLoginState(game.player1, LOG_STATE.INGAME);
    this.userService.updateLoginState(game.player2, LOG_STATE.INGAME);
    // await Promise.all([state1, state2]);
    console.log("Updated the Status to In Game.") //, state1.currentState, ", ", state2.currentState);
    let isGamePaused = false;

    const handlePause = () => {
      console.log("Entering a 5-second pause.");
      isGamePaused = true;
    
      setTimeout(() => {
        console.log("Five seconds passed. Resuming the game.");
        isGamePaused = false;
      }, 5000);
    };

    const gameInterval = setInterval(() => {
      if (isGamePaused) {
        return;
      }
      const currentGame = gameStateManager.getGameState(game.id);
      if (!currentGame) {
        clearInterval(gameInterval);
        console.log("Couldn't retrieve game information from gameStateManager!");
        return;
      }
      moveBall(currentGame);
      checkCollision(currentGame);
      // updateBoost(currentGame);
      if (currentGame.isReset) {
        handleReset(currentGame);
      }
      this.server
        .to(currentGame.id.toString())
        .timeout(5000)
        .emit('gameUpdate', currentGame);
      
      //listening only once the custom event acknowledgement from the client
      const ackPlayer1 = `ackResponse-G${currentGame.id}P${currentGame.player1}`;
      const ackPlayer2 = `ackResponse-G${currentGame.id}P${currentGame.player2}`;

      roomReadiness[currentGame.id].player1Ready.once(ackPlayer1, (response: any) => {
        if (response === null) {
          console.log('Response empty!\n');
        } else {
          currentGame.paddle1Y = response.paddlePos;
          if (!response.playerActive) {
            currentGame.status == 'aborted';
            console.log("Game state was set to 'aborted'");
          }
          if (response.pause) {
            console.log("Player 1 paused game!");
            handlePause();
          }            
        }
      });
      
      roomReadiness[currentGame.id].player2Ready.once(ackPlayer2, (response: any) => {
        if (response === null) {
          console.log('Response empty!\n');
        } else {
          currentGame.paddle2Y = response.paddlePos;
          if (!response.playerActive) {
            currentGame.status == 'aborted';
            console.log("Game state was set to 'aborted'");
          }
          if (response.pause) {
            console.log("Player 2 paused game!");
            handlePause();
          }
        }
      });
            
      if (
        currentGame.status === 'finished' ||
        currentGame.status === 'aborted'
      ) {
        console.log("Clearing Interval . . .")
        clearInterval(gameInterval);
        console.log("Cleared interval. Updating user status . . .");
        this.userService.updateLoginState(game.player1, LOG_STATE.ONLINE);
        this.userService.updateLoginState(game.player2, LOG_STATE.ONLINE);
        console.log("Updated user states to online.");
      } else {
        gameStateManager.updateGame(currentGame.id, ((newGame) => {gameStateManager.setGame(newGame)}));
      }
    }, 1000 / 15); // 30 FPS
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
  async deleteFriend(@MessageBody() friendShip: number) {
    const isDelete = await this.friendsService.remove(friendShip);
    await Promise.all([isDelete]);
    const allFriends = await this.friendsService.findAll();
    this.server.emit('deniedFriend', { all: allFriends });
  }

  // @SubscribeMessage('createChannel')
  // async createChannel(
  //   @ConnectedSocket() socket: Socket,
  //   @MessageBody() payload: any,
  // ) {
  //   if (payload.privacy_state == CHANNEL_TYPE.PROTECTED && !payload.passwd) {
  //     // could return a specific infos.
  //     return;
  //   }
  //   const user = await this.chatsService.getUserFromSocket(socket);
    
  //   const channel: CreateChannelDto = {
  //     password: payload.passwd,
  //     title: payload.title,
  //     privacy: payload.privacy_state,
  //     ownerId: +user.id,
  //   };
  //   const newChannel = await this.channelsService.create(channel);
  //   let membersCreation;
  //   const members = [...payload.members];
  //   if (members.length && newChannel) {
  //     const owner = {
  //       userId: +user.id,
  //       channelId: newChannel.channelId,
  //       rank: MEMBER_RANK.OWNER,
  //       rights: MEMBER_RIGHTS.PRIVILEDGED,
  //       status: MEMBER_STATUS.ACCEPTED,
  //     };
  //     const memberOwner = await this.joinchannelService.create(owner);

  //     const joints = members.map(async (member) => {
  //       const joinchannelDTo: CreateJoinchannelDto = {
  //         userId: +member,
  //         channelId: newChannel.channelId,
  //         rank: MEMBER_RANK.MEMBER,
  //         rights: MEMBER_RIGHTS.PRIVILEDGED,
  //         status: MEMBER_STATUS.INVITE,
  //       };
  //       return await this.joinchannelService.create(joinchannelDTo);
  //     });
  //     membersCreation = await Promise.all([joints, memberOwner]);
  //   }
  //   const allMembers = await this.joinchannelService.findAfterInsert(membersCreation);
  //   const allChannels = await this.channelsService.findAll();
  //   await Promise.all([allMembers, allChannels]);
  //   this.server.emit('newChannel', {
  //     members: allMembers,
  //     groups: allChannels,
  //     owner: newChannel.ownerId,
  //   });
  // }
  @SubscribeMessage('createChannel')
async createChannel(
  @ConnectedSocket() socket: Socket,
  @MessageBody() payload: any,
) {
  if (payload.privacy_state == CHANNEL_TYPE.PROTECTED && !payload.passwd) {
    // could return a specific infos.
    return;
  }
  const user = await this.chatsService.getUserFromSocket(socket);

  const channel: CreateChannelDto = {
    password: payload.passwd,
    title: payload.title,
    privacy: payload.privacy_state,
    ownerId: +user.id,
  };
  const newChannel = await this.channelsService.create(channel);
  let membersCreation;
  const members = [...payload.members];
  if (members.length && newChannel) {
    const owner = {
      userId: +user.id,
      channelId: newChannel.channelId,
      rank: MEMBER_RANK.OWNER,
      rights: MEMBER_RIGHTS.PRIVILEDGED,
      status: MEMBER_STATUS.ACCEPTED,
    };
    const memberOwner = await this.joinchannelService.create(owner);

    const joints = members.map(async (member) => {
      const joinchannelDTo: CreateJoinchannelDto = {
        userId: +member,
        channelId: newChannel.channelId,
        rank: MEMBER_RANK.MEMBER,
        rights: MEMBER_RIGHTS.PRIVILEDGED,
        status: MEMBER_STATUS.INVITE,
      };
      return this.joinchannelService.create(joinchannelDTo);
    });
    membersCreation = await Promise.all([...joints, memberOwner]);
  }
  const allMembers = await this.joinchannelService.findAfterInsert(membersCreation);
  const allChannels = await this.channelsService.findAll();
  await Promise.all([allMembers, allChannels]);
  this.server.emit('newChannel', {
    members: allMembers,
    groups: allChannels,
    owner: newChannel.ownerId,
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

  // could check if no member, remove the group
  @SubscribeMessage('exitGroup')
  async handleExitGroup(
    @ConnectedSocket() socket: Socket,
    @MessageBody() group: string,
  ) {
    const user = await this.chatsService.getUserFromSocket(socket);
    if (user) {
      const join = await this.joinchannelService.deleteJoin(user.id, +group);
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
  
  @SubscribeMessage('verifyGroupPassword')
  async handleVerifyGroupPassword(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const verify = await this.channelsService.verifyPasswd(data.input, data.group);
    socket.emit('verifyGroupPasswdSuccess', verify);
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
    const acceptJoinGroup = await this.joinchannelService.update(newMember);
    await Promise.all([acceptJoinGroup]);
    const allMembers = await this.joinchannelService.findAll();
    await Promise.all([allMembers]);
    this.server.emit('acceptMemberSuccess', {
      new: acceptJoinGroup,
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
    await Promise.all([allBlocks]);
    this.server.emit('unblockSuccess', allBlocks);
  }

  async updateMemberShip(joinChannel: Joinchannel, socket: Socket) {
    const memberShip = await this.joinchannelService.update(joinChannel);
    const actor = await this.chatsService.getUserFromSocket(socket);
    await Promise.all([memberShip]);
    const allMembers = await this.joinchannelService.findAll();
    await Promise.all([allMembers]);
    this.server.emit('memberMuteToggleSuccess', { new: memberShip, all: allMembers, actor: actor.id });
  }
  
  @SubscribeMessage('memberPromoteToggle')
  async handlePromote(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: Joinchannel) {
    return await this.updateMemberShip(payload, socket);
  }
  
  @SubscribeMessage('memberMuteToggle')
  async handleMute(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: Joinchannel
  ) {
    return await this.updateMemberShip(payload, socket);
  }

  @SubscribeMessage('kickMember')
  async handleKickMember(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: Joinchannel
  ) {
    const kicked = await this.joinchannelService.delete(payload.id);
    const actor = await this.chatsService.getUserFromSocket(socket);
    await Promise.all([kicked, actor]);
    const allMembers = await this.joinchannelService.findAll();
    await Promise.all([allMembers]);
    this.server.emit('kickMemberSuccess', { new: payload, all: allMembers, actor: actor.id});
  }
  /***********************GAME*********************** */

  @SubscribeMessage('saveOverGameVsBot')
  async handleSaveOverGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: {
      player1: number,
      player2: number,
      difficulty: number,
      score1: number,
      score2: number,
      includeBoost: boolean
    }
  ) {
    const gameDto: CreateGameDto = {
      id: -1,
      player1: payload.player1,
      player2: payload.player2,
      difficulty: payload.difficulty,
      includeBoost: payload.includeBoost,
      isReset: false,
      status: 'finished',
      score1: payload.score1,
      score2: payload.score2,
      paddle1Y: 0,
      paddle2Y: 0,
      boostX: 0,
      boostY: 0,
      ballX: 0,
      ballY: 0,
      gameMaker: 0,
      paddle1Speed: 0,
      paddle2Speed: 0,
      paddle1Dir: 0,
      paddle2Dir: 0,
      speedX: 0,
      speedY: 0
    };
    const game = await this.gamesService.create(gameDto);
    await Promise.all([game]);
    socket.emit('gameBotSuccess', {});
  }

  @SubscribeMessage('saveGame')
  async handleSaveGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: {
      id: number,
      player1: number,
      player2: number,
      difficulty: number,
      score1: number,
      score2: number,
      includeBoost: boolean,
    }
  ) {
    const roomId = payload.id;
    const oldGame = await this.gamesService.findOne(payload.id);
    const newGame = { 
      ... oldGame,
      ...payload,
    }
    const newGameCheck = await this.gamesService.update(newGame);
    if (newGameCheck.id == payload.id) {
      console.log("Updated game" , payload.id , "successfully!");
    } else {
      console.log("Failed to update game ", payload.id);
    }
    // console.log(this.server.sockets.adapter.rooms);
    const room = this.server.sockets.adapter.rooms[roomId.toString()];
    if (room) {
      room.sockets.forEach((_, socketId) => {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          socket.leave(roomId);
          console.log(`User ${socketId} left room: ${roomId}`);
        }
      })
    }
    const oldStats1 = await this.userStats.findOne(payload.player1);
      const newStats1: UpdateStatDto = {
        wins: (payload.score1 > payload.score2) ? oldStats1.wins + 1 : oldStats1.wins,
        losses: (payload.score1 < payload.score2) ? oldStats1.losses + 1 : oldStats1.losses,
        draws: (payload.score1 == payload.score2) ? oldStats1.draws + 1 : oldStats1.draws,
        userId: +oldStats1.userId
      }
    const updatedStats = await this.userStats.update(oldStats1.userId, newStats1); 
    
    const oldStats2 = await this.userStats.findOne(payload.player2);
    const newStats2: UpdateStatDto = {
      wins: (payload.score1 > payload.score2) ? oldStats2.wins + 1 : oldStats2.wins,
      losses: (payload.score1 < payload.score2) ? oldStats2.losses + 1 : oldStats2.losses,
      draws: (payload.score1 == payload.score2) ? oldStats2.draws + 1 : oldStats2.draws,
      userId: +oldStats2.userId
    };
    const updatedStats2 = await this.userStats.update(oldStats2.userId, newStats2); 
    console.log("Successfully saved the gamestats to Database.")
  }
  
  @SubscribeMessage('leaveQueue')
  async handleLeaveQueue(@ConnectedSocket() socket: Socket) {
    const user = await this.chatsService.getUserFromSocket(socket);
    return this.gameQueueService.leaveQueue(+user.id);
  }

  @SubscribeMessage('requestMatch')
  async handleRequestMatch(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ) {
    console.log('requestMatch was received.\n');
    if (data.player2 > 0) {
      const makeGame = await this.gamesService.makeMatch(
        +data.player1,
        +data.player2,
        data.difficulty,
        data.isBoost,
      );
      if (makeGame) {
        const roomId = makeGame.id;
        socket.join(roomId.toString());
        console.log(
          `User ${makeGame.player1} created and joined room: ${roomId}`,
        );
        this.server.emit('challengedToMatch', makeGame);
        console.log('Broadcasting challengedToMatch\n');
      }
    } else {
        const opponent = this.gameQueueService.findOpponent({
          id: data.player1,
          difficulty: data.difficulty,
          isBoost: data.isBoost,
          socket
        });
        if (opponent) {
          const player1 = await this.chatsService.getUserFromSocket(opponent.socket);
          const player2 = await this.chatsService.getUserFromSocket(socket);
          const makeGame = await this.gamesService.makeMatch(
            +player1.id,
            +player2.id,
            data.difficulty,
            data.isBoost,
          );
  
          if (makeGame) {
            const roomId = makeGame.id;
            const user = await this.chatsService.getUserFromSocket(socket);
            socket.join(roomId.toString());
            console.log(
              `User ${user.id} joined room: ${roomId}`,
            );
            opponent.socket.join(roomId.toString());
            opponent.socket.emit('matchedToGame', makeGame);
            socket.emit('invitedToMatch', makeGame);
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
      if (room.size < 3) {
        socket.join(roomId.toString());
        console.log(`User ${user.id} joined room: ${roomId}`);
      } else {
        console.log("Room is already full: ", room.size);
      }
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
    console.log(data);
    const user = await this.chatsService.getUserFromSocket(socket);
    const victor = (user.id == data.player1) ? data.player2 : data.player1;
    const roomId = data.id;
    const room = this.server.sockets.adapter.rooms[roomId];
    console.log("Retrieving game state for id: ", data.id);
    const game = gameStateManager.getGameState(data.id);
    if (game) {
      game.status = 'aborted';
      gameStateManager.updateGame(data.id, ((newGame) => {gameStateManager.setGame(newGame)}));
      console.log("Game was retrieved: ", game.id);
      console.log("Game status == ", game.status);
      const saveGame = (game.score1 > 0 || game.score2 > 0) ? true : false;
      console.log("saveGame: ", saveGame)
      if (saveGame) {
        const oldGame = await this.gamesService.findOne(data.id);
        const newGame = { 
          ... oldGame,
          status: 'finished',
          score1: victor == data.player1 ? 1 : 0,
          score2: victor == data.player2 ? 1 : 0,
        }
        const newGameCheck = await this.gamesService.update(newGame);
        if (newGameCheck.id == data.id) {
          console.log("Updated game" , data.id , "successfully!");
        } else {
          console.log("Failed to update game ", data.id);
        }
      } else {
        console.log("Game was not saved!");
      }
    } else
      console.log("Game retrieval failed!");

    if (room) {
      // Optionally, emit an event to inform all clients in the room
      this.server.to(roomId.toString()).emit('matchDenied', {
        roomId,
        message: 'Match request denied, room closed.',
      });
      room.sockets.forEach((_, socketId) => {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          socket.leave(roomId);
          console.log(`User ${socketId} left room: ${roomId}`);
        }
      });
      console.log(`Room ${roomId} cleared and closed due to match denial.`);
    } else {
      // Handle the case where the room doesn't exist or is already empty
      console.log(`Room ${roomId} not found for denial of process.`);
    }
    console.log('Game was aborted\n');
  }

  @SubscribeMessage('gameLoop')
  async handleGameLoop(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ) {
    var roomId = 0;
    if (data && data.id) { roomId = data.id; }
    console.log('\nGameLoop event read!\n');
    if (!roomReadiness[roomId]) {
      roomReadiness[roomId] = { player1Ready: null, player2Ready: null };
    }
    const user = await this.chatsService.getUserFromSocket(socket);
    console.log('user id: ', user.id);
    console.log('player id: ', data.player1); // Update readiness based on which player sent the event
    if (user.id == data.player1) {
      roomReadiness[roomId].player1Ready = socket;
      console.log('Player 1 is ready for the match!\n');
      this.server.emit('comeJoin', data);
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
      // this.startGameLoop(data, socket);
      this.startGameLoop(data);
    }
  }
}
