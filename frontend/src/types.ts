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
  isLogged: boolean;
  lastSeen?: string;
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
  usrId: number;
  channelId: number;
  rank: string;
  rights: string;
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


type Chat = {
  id: number;
  author: number;
  message: string;
  type: string;
  receiver: number;
};

type TGameReq = {
  id: number;
  receiver: string;
  sender: string;
  difficulty: string;
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
  TGameReq,
};
