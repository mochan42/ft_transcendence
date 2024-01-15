import { faker } from "@faker-js/faker";
import {
  Chat,
  User,
  Friend,
  UserStats,
  GameType,
  Group,
  JoinGroup,
} from "../types";
import axios from "axios";
import { ACCEPTED, PENDING } from "../APP_CONSTS";
import { enChatGroupInviteStatus, enChatPrivacy, enGameDifficulty } from "../enums";
import { BACKEND_URL } from "./Global";

const backendUrl = BACKEND_URL

const fetchAllUsers = async (): Promise<User[]> => {
  const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
	};
  let users: User[] = [];
  try {
    const resp = await axios.get<User[]>(backendUrl + "/pong/users", { headers });
    if (resp.status === 200) {
      users = resp.data;
    }
  }
  catch (error) {
    console.log('Error fetching users :', error);
  }
  return users;
};

const fetchUser = async (userId: string): Promise<User|null> => {
  const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
  };
  try {
    const resp = await axios.get<User>(backendUrl + "/pong/users/" + userId, { headers });
    if (resp.status === 200) {
      return resp.data;
    }
  }
  catch (error) {
    console.log('Error fetching user info', error);
  }
  return null;
};


const fetchAllFriends = async (): Promise<Friend[]> => {
  let friends: Friend[] = [];
  const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
	};
  try {
    const urlFriend = backendUrl + "/pong/friends";
    const resp = await axios<Friend[]>(urlFriend, { headers });
    if (resp.status === 200) {
      friends = resp.data;
    }
  }
	catch (error) {
    console.log('Error fetching all friends: ', error);
	}
  return friends;
};

const fetchAllBlockedUsers = async (): Promise<any[]> => {
  const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
  let blockedUsers = [];
  const urlFriend = backendUrl + "/pong/blocks";
  try {
    const resp = await axios<any[]>(urlFriend, { headers });
    if (resp.status === 200) {
      blockedUsers = resp.data;
    }
  }
  catch (error) {
    console.log('Error fetching blocked users', error);
  }
  return blockedUsers;
};

const fetchAllMessages = async (): Promise<Chat[]> => {
  let messages: Chat[] = [];
  const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
	};
  const resp = await axios.get<Chat[]>(backendUrl + "/pong/chats", { headers });
  if (resp.status === 200) {
    messages = resp.data;
  }
  return messages;
}

const fetchAllStats = async (userId: any) => {
  let stats: UserStats = {
    id: '',
    userId: userId,
    wins: 0,
    losses: 0,
    draws: 0
  }
  const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
	};
  const userStatUrl = backendUrl + `/pong/users/${userId}/stats`;
  const resp = await axios.get<UserStats>(userStatUrl, { headers });
  if (resp.status === 200) {
    stats = {...resp.data, userId: resp.data.userId }
  } 
  return stats;
}

const friends: Friend[] = await fetchAllFriends();
const blockedUsersList = await fetchAllBlockedUsers();
const ChatUserList = await fetchAllUsers();
// will filters all pending|accepted users;
const fetchAllUsersFriends = (relation: string, friendList: Friend[]): Friend[]  => {
  return friendList.filter((el: Friend) => el.relation === relation);
};

const ChatUserFriendsList: Friend[] = fetchAllUsersFriends(ACCEPTED, friends);
const ChatUserFriendRequestList: Friend[] = fetchAllUsersFriends(PENDING, friends);
const ChatUserMessages: Chat[] = await fetchAllMessages();

const friendToUserType = (user: string | null, friend: Friend, userList: User[]) => {
  if (user !== friend.sender) {
    return userList.filter(el => friend.sender === el.id)[0];
  }
  return userList.filter((el) => friend.receiver === el.id)[0];
} 

const fetchAllGroups = async (): Promise<Group[]> => {
  const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
  let groups: Group[] = [];
  const resp = await axios.get<Group[]>(`${BACKEND_URL}/pong/channels`, { headers });
  if (resp.status === 200) {
    groups = resp.data;
  }
  return groups;
}
const ChatGroupList: Group[] = await fetchAllGroups();

export const fetchAllMembers = async (): Promise<JoinGroup[]> => {
  let members: JoinGroup[] = [];
  const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
	};
  const resp = await axios.get<JoinGroup[]>(`${BACKEND_URL}/pong/channels/members`, { headers });
  if (resp.status === 200) {
    members = resp.data;
  }
  return members;
}

export const getMembers = (members: JoinGroup[], groupId: number): JoinGroup[] => {
  let allMembers: JoinGroup[] = [];
  members.forEach((el: JoinGroup) => {
    if (el.channelId == groupId && el.status == enChatGroupInviteStatus.ACCEPTED) {
      allMembers.push(el);
    }
  })
  console.log(allMembers);
  return allMembers;
}

const ChatGroupMemberList: JoinGroup[] = await fetchAllMembers();
const ChatGroupListDummy : Group[] = [
  {
    channelId: 3,
    password: "",
    title: "Revolution crew",
    privacy: "public",
    ownerId: 7,
  },
  {
    channelId: 2,
    password: "",
    title: "Trans_project_team",
    privacy: enChatPrivacy.PRIVATE,
    ownerId: 5,
  },
  {
    channelId: 4,
    password: "password",
    title: "Movie Night",
    privacy: enChatPrivacy.PROTECTED,
    ownerId: 5,
  },
];

const dummyUsers :User[]= [
  {
    id: "0",
    userName: "Facinet",
    userNameLoc: "",
    firstName: "",
    lastName: "",
    is2Fa: true,
    authToken: "access",
    email: "gmial.com",
    secret2Fa: "",
    avatar: faker.image.avatar(),
    xp: 4,
    currentState: 'ONLINE',
    lastSeen: "today"
  },
  {
    id: "3",
    userName: "Monine",
    userNameLoc: "",
    firstName: "",
    lastName: "",
    is2Fa: true,
    authToken: "access",
    email: "gmial.com",
    secret2Fa: "",
    avatar: faker.image.avatar(),
    xp: 4,
    currentState: 'ONLINE',
    lastSeen: "today"
  },
  {
    id: "5",
    userName: "Pmeising",
    userNameLoc: "",
    firstName: "",
    lastName: "",
    is2Fa: true,
    authToken: "access",
    email: "gmial.com",
    secret2Fa: "",
    avatar: faker.image.avatar(),
    xp: 4,
    currentState: 'ONLINE',
    lastSeen: "today"
  },
  {
    id: "8",
    userName: "felix",
    userNameLoc: "",
    firstName: "",
    lastName: "",
    is2Fa: true,
    authToken: "access",
    email: "gmial.com",
    secret2Fa: "",
    avatar: faker.image.avatar(),
    xp: 4,
    currentState: 'ONLINE',
    lastSeen: "today"
  },
  {
    id: "7",
    userName: "cudoh",
    userNameLoc: "",
    firstName: "",
    lastName: "",
    is2Fa: true,
    authToken: "access",
    email: "gmial.com",
    secret2Fa: "",
    avatar: faker.image.avatar(),
    xp: 4,
    currentState: 'ONLINE',
    lastSeen: "today"
  }
]


const dummyBlockedUser = [
  {
    id: 1,
    blockerUserId: 1,
    blockeeUserId: 8,
  },
  {
    id: 2,
    blockerUserId: 1,
    blockeeUserId: 5,
  }
]
// const ChatGroupMemberList = [
//   {
//     id: 1,
//     userId: 1,
//     channelId: 3,
//     rank: enChatMemberRank.ADMIN, // member
//     rights: enChatMemberRights.PRIVILEDGED, // kicked, banned
//     status: enChatGroupInviteStatus.PENDING
//   },
//   {
//     id: 2,
//     userId: 1,
//     channelId: 2,
//     rank: enChatMemberRank.MEMBER, // member
//     rights: enChatMemberRights.PRIVILEDGED, // kicked, banned
//     status: enChatGroupInviteStatus.ACCEPTED
//   },
//   {
//     id: 4,
//     userId: 5,
//     channelId: 1,
//     rank: enChatMemberRank.MEMBER, // member
//     rights: enChatMemberRights.BANNED, // kicked, banned
//     status: enChatGroupInviteStatus.ACCEPTED
//   },
//   {
//     id: 5,
//     userId: 1,
//     channelId: 4,
//     rank: enChatMemberRank.MEMBER, // member
//     rights: enChatMemberRights.PRIVILEDGED, // kicked, banned
//     status: enChatGroupInviteStatus.INVITE
//   },
//   {
//     id: 6,
//     userId: 8,
//     channelId: 5,
//     rank: enChatMemberRank.OWNER, // member
//     rights: enChatMemberRights.PRIVILEDGED, // kicked, banned
//     status: enChatGroupInviteStatus.ACCEPTED
//   },
// ];
// const ChatGroupMemberList2 = [
//   {
//     id: 1,
//     userId: 0,
//     channelId: 3,
//     rank: enChatMemberRank.ADMIN, // member
//     rights: enChatMemberRights.PRIVILEDGED, // kicked, banned
//     status: enChatGroupInviteStatus.ACCEPTED
//   },
//   {
//     id: 2,
//     userId: 7,
//     channelId: 3,
//     rank: enChatMemberRank.MEMBER, // member
//     rights: enChatMemberRights.PRIVILEDGED, // kicked, banned
//     status: enChatGroupInviteStatus.ACCEPTED
//   },
// ];

const ChatGameRequestList :GameType[] = [

  {
    id: 0,
    player1: 3,
    player2: 1,
    difficulty: enGameDifficulty.EXTREME,
    status: 'request',
		includeBoost: false,
		score1: 0,
		score2: 0,
		paddle1Y: 200,
		paddle2Y: 200,
		boostX: 200,
		boostY: 200,
		ballX: 300,
		ballY: 300,		
		gameMaker: -1,
		paddle1Speed: 1,
		paddle2Speed: 1,
		paddle1Dir: 1,
		paddle2Dir: 1,
		speedX: 1,
		speedY: 1,
  },
  {
    id: 1,
    player1: 41,
    player2: 40,
    difficulty: enGameDifficulty.HARD,
    isBoost: false,
    status: 'request',
    includeBoost: false,
		score1: 0,
		score2: 0,
		paddle1Y: 200,
		paddle2Y: 200,
		boostX: 200,
		boostY: 200,
		ballX: 300,
		ballY: 300,		
		gameMaker: -1,
		paddle1Speed: 1,
		paddle2Speed: 1,
		paddle1Dir: 1,
		paddle2Dir: 1,
		speedX: 1,
		speedY: 1,
  },
  {
    id: 2,
    player1: 5,
    player2: 1,
    difficulty: enGameDifficulty.EASY,
    isBoost: true,
    status: 'request',
    includeBoost: false,
		score1: 0,
		score2: 0,
		paddle1Y: 200,
		paddle2Y: 200,
		boostX: 200,
		boostY: 200,
		ballX: 300,
		ballY: 300,		
		gameMaker: -1,
		paddle1Speed: 1,
		paddle2Speed: 1,
		paddle1Dir: 1,
		paddle2Dir: 1,
		speedX: 1,
		speedY: 1,
  },
  {
    id: 3,
    player1: 1,
    player2: 8,
    difficulty: enGameDifficulty.MEDIUM,
    isBoost: true,
    status: 'request',
    includeBoost: false,
		score1: 0,
		score2: 0,
		paddle1Y: 200,
		paddle2Y: 200,
		boostX: 200,
		boostY: 200,
		ballX: 300,
		ballY: 300,		
		gameMaker: -1,
		paddle1Speed: 1,
		paddle2Speed: 1,
		paddle1Dir: 1,
		paddle2Dir: 1,
		speedX: 1,
		speedY: 1,
  }
]

const GameDifficultyTxt: string[] = [
  'easy',
  'medium',
  'hard',
  'very_hard',
  'extreme',
]

export {
  ChatUserList,
  ChatUserFriendsList,
  ChatUserFriendRequestList,
  ChatGroupList,
  ChatGroupListDummy,
  ChatGroupMemberList,
  ChatUserMessages,
  blockedUsersList,
  dummyUsers,
  dummyBlockedUser,
  ChatGameRequestList,
  GameDifficultyTxt,
  friendToUserType,
  fetchAllUsersFriends,
  fetchAllUsers,
  fetchUser,
  fetchAllFriends,
  fetchAllMessages,
  fetchAllStats
};
