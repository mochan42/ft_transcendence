import { enGameDifficulty } from "./enums";

type User = {
  id: string;
  userName: string;
  userNameLoc: string;
  firstName: string;
  lastName: string;
  is2Fa: boolean;
  authToken: string;
  email: string;
  secret2Fa?: string;
  avatar?: string;
  xp: number;
  currentState: 'ONLINE' | 'OFFLINE' | 'IN GAME';
  lastSeen?: string;
};

type TGroupRequestArgs = {
  group: Group,
  joinGroup: JoinGroup
};

type UserStats = {
  id: string | null;
  userId: string | null;
  wins: number;
  losses: number;
  draws: number;
};

type UserAchievements = {
  id: string | null;
  userId: string | null;
  goalId: string | null;
  createdAt: string;
};

interface ProfileProps {
  userId: string | null;
  isAuth: boolean;
}

type Goal = {
  id: string;
  label?: string;
  image?: string;
  description?: string;
};

type Friend = {
  id: number;
  receiver: string | null;
  sender: string | null;
  relation: string;
  createdAt: string;
};

type TUserAuth = {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  isAuth: boolean;
  setCode: React.Dispatch<React.SetStateAction<string | null>>;
  code: string | null;
};

type Group = {
  channelId: number;
  password: string;
  title: string;
  privacy: string;
  ownerId: number;
};

type JoinGroup = {
  id: number;
  userId: number;
  channelId: number;
  rank: string;
  rights: string;
  status: string
};

type Block = {
  id: number;
  blockerUserId: number;
  blockeeUserId: number;
};

type Message = {
  id: number;
  user: string;
  type: string;
  subtype: string;
  message: string;
  img: string;
  incoming: boolean;
  outgoing: boolean;
};

interface ChatMessageProps {
  incoming: boolean;
  message: string;
  user: string;
  chatID?: number;
  timeOfSend: Date;
  id: number;
}

interface ChatProps {
  userId: string | null;
}

type TUserFriendRequest = {
  userId: number | null;
  userImg: string | undefined;
  userName: string | undefined;
  reqType: string | undefined;
};

type Chat = {
  id: number;
  author: number;
  message: string;
  type: string;
  receiver: number;
};

type GameType = {
  id: number;
  player1: number;
  player2: number;
  difficulty: number;
  includeBoost: boolean;
  status: 'request' | 'found' | 'playing' | 'finished' | 'aborted';
  score1: number;
  score2: number;
  paddle1Y: number;
  paddle2Y: number;
  boostX: number;
  boostY: number;
  ballX: number;
  ballY: number;
  boostStartX?: number;
  boostStartY?: number;
  isBoost?: boolean;
  isReset?: boolean;
  isGameOver?: boolean;
  gameMaker?: number;
  paddle1Speed?: number,
  paddle2Speed?: number;
  paddle1Dir?: number;
  paddle2Dir?: number;
  speedX?: number;
  speedY?: number;
}

type paddle1Type = {
  gameId: number,
  paddlePos: number,
}

type paddle2Type = {
  gameId: number,
  paddlePos: number,
}

type ballXType = {
  gameId: number,
  ballPos: number,
}

type ballYType = {
  gameId: number,
  ballPos: number,
}

type boostXType = {
  gameId: number,
  boostX: number,
}

type boostYType = {
  gameId: number,
  boostY: number,
}

type update = {
  id: number;
  paddle1Pos: number;
  ballX: number;
  ballY: number;
  boostX: number;
  boostY: number;
}

type TFormMember =
{
    id : string;
    name : string;
}

export type {
  User,
  UserStats,
  UserAchievements,
  ProfileProps,
  Goal,
  TUserAuth,
  Friend,
  Group,
  JoinGroup,
  Message,
  ChatMessageProps,
  ChatProps,
  Chat,
  GameType,
  TFormMember,
  paddle1Type,
  paddle2Type,
  ballXType,
  ballYType,
  boostXType,
  boostYType,
  update,
  TGroupRequestArgs,
  Block
};
