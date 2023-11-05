import { faker } from "@faker-js/faker";
import {
  Chat,
  User,
  Friend,
  UserStats,
  GameType,
} from "../types";
import axios from "axios";
import { ACCEPTED, PENDING } from "../APP_CONSTS";
import { enChatMemberRank, enChatMemberRights, enGameDifficulty } from "../enums";
import { BACKEND_URL } from "./Global";

const backendUrl = BACKEND_URL

const fetchAllUsers = async (): Promise<User[]> => {
  let users: User[] = [];
  const resp = await axios.get<User[]>(backendUrl + "/pong/users");
  if (resp.status === 200) {
    users = resp.data;
  }
  return users;
};

const fetchUser = async (userId: string): Promise<User | undefined> => {
  const resp = await axios.get<User>(backendUrl + "/pong/users/" + userId);
  if (resp.status === 200) {
    return resp.data;
  }
  console.log("Fetching user ", userId, " failed with exit code ", resp.status);
};


const fetchAllFriends = async (): Promise<Friend[]> => {
  let friends: Friend[] = [];
  const urlFriend = backendUrl + "/pong/friends";
  const resp = await axios<Friend[]>(urlFriend);
  if (resp.status === 200) {
    friends = resp.data;
  }
  return friends;
};

const fetchAllMessages = async (): Promise<Chat[]> => {
  let messages: Chat[] = [];
  const resp = await axios.get<Chat[]>(backendUrl + "/pong/chats");
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
  const userStatUrl = backendUrl + `/pong/users/${userId}/stats`;
  const resp = await axios.get<UserStats>(userStatUrl);
  if (resp.status === 200) {
    stats = {...resp.data, userId: resp.data.userId }
  } 
  return stats;
}

const friends: Friend[] = await fetchAllFriends();
const ChatUserList = await fetchAllUsers();
// will filters all pending|accepted users;
const fetchAllUsersFriends = (relation: string, friendList: Friend[]): Friend[]  => {
  return friendList.filter((el: any) => el.relation == relation);
};

const ChatUserFriendsList: Friend[] = fetchAllUsersFriends(ACCEPTED, friends);
const ChatUserFriendRequestList: Friend[] = fetchAllUsersFriends(PENDING, friends);
const ChatUserMessages: Chat[] = await fetchAllMessages();

const friendToUserType = (user: string | null, friend: Friend, userList: User[]) => {
  if (user != friend.sender) {
    return userList.filter(el => friend.sender == el.id)[0];
  }
  return userList.filter((el) => friend.receiver == el.id)[0];
} 

const ChatGroupList = [
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
    privacy: "public",
    ownerId: 5,
  },
];

const dummyUsers = [
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
    isLogged: true,
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
    isLogged: true,
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
    isLogged: true,
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
    isLogged: true,
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
    isLogged: true,
  }
]

const ChatGroupMemberList = [
  {
    id: 1,
    usrId: 1,
    channelId: 3,
    rank: enChatMemberRank.ADMIN, // member
    rights: enChatMemberRights.PRIVILEDGED, // kicked, banned
  },
  {
    id: 2,
    usrId: 7,
    channelId: 3,
    rank: enChatMemberRank.MEMBER, // member
    rights: enChatMemberRights.PRIVILEDGED, // kicked, banned
  },
  {
    id: 4,
    usrId: 5,
    channelId: 3,
    rank: enChatMemberRank.MEMBER, // member
    rights: enChatMemberRights.BANNED, // kicked, banned
  },
  {
    id: 5,
    usrId: 3,
    channelId: 3,
    rank: enChatMemberRank.MEMBER, // member
    rights: enChatMemberRights.PRIVILEDGED, // kicked, banned
  },
  {
    id: 6,
    usrId: 8,
    channelId: 3,
    rank: enChatMemberRank.OWNER, // member
    rights: enChatMemberRights.PRIVILEDGED, // kicked, banned
  },
];
const ChatGroupMemberList2 = [
  {
    id: 1,
    usrId: 0,
    channelId: 3,
    rank: enChatMemberRank.ADMIN, // member
    rights: enChatMemberRights.PRIVILEDGED, // kicked, banned
  },
  {
    id: 2,
    usrId: 7,
    channelId: 3,
    rank: enChatMemberRank.MEMBER, // member
    rights: enChatMemberRights.PRIVILEDGED, // kicked, banned
  },
];

const ChatGameRequestList :GameType[] = [

  {
    id: 0,
    player1: 7,
    player2: 1,
    difficulty: enGameDifficulty.EXTREME,
    isBoost: false,
    status: 'request'
  },
  {
    id: 1,
    player1: 5,
    player2: 1,
    difficulty: enGameDifficulty.HARD,
    isBoost: false,
    status: 'request'
  },
  {
    id: 2,
    player1: 7,
    player2: 3,
    difficulty: enGameDifficulty.EASY,
    isBoost: true,
    status: 'request'
  },
  {
    id: 3,
    player1: 1,
    player2: 8,
    difficulty: enGameDifficulty.MEDIUM,
    isBoost: true,
    status: 'request'
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
  ChatGroupMemberList,
  ChatUserMessages,
  ChatGroupMemberList2,
  dummyUsers,
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
