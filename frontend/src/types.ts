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
};

type Goal = {
  id: string;
  label?: string;
  image?: string;
  description?: string;
};

type Friend = {
	'receiver': string | null;
	'sender': string | null;
	'relation': string;
	'createdAt': string;
}

type TUserAuth= {
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>,
    isAuth: boolean,
    setCode: React.Dispatch<React.SetStateAction<string | null>>,
    code: (string | null),
}

type TChatUserData = {
   id: number,
   img: string,
   name: string,
   msg:  string,
   time: string,
   unread: number,
   online: boolean
}

type Message = {
  user: string;
  id: number;
  type: string,
  subtype: string,
  message: string,
  img: string,
  incoming: boolean,
  outgoing: boolean,
}
export  { User, UserStats, UserAchievements, ProfileProps, Goal, TUserAuth, Friend, TChatUserData, Message};
