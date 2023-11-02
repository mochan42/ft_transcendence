import { faker } from "@faker-js/faker";
import {
  Chat,
  User,
  Friend,
  UserStats,
} from "../types";
import axios from "axios";
import { ACCEPTED, PENDING } from "../APP_CONSTS";
import { enChatMemberRank, enChatMemberRights, enGameDifficulty } from "../enums";

const fetchAllUsers = async (): Promise<User[]> => {
  let users: User[] = [];
  const resp = await axios.get<User[]>("https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev/pong/users");
  if (resp.status === 200) {
    users = resp.data;
  }
  return users;
};

const fetchAllFriends = async (): Promise<Friend[]> => {
  let friends: Friend[] = [];
  const urlFriend = "https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev/pong/friends";
  const resp = await axios<Friend[]>(urlFriend);
  if (resp.status === 200) {
    friends = resp.data;
  }
  return friends;
};

const fetchAllMessages = async (): Promise<Chat[]> => {
  let messages: Chat[] = [];
  const resp = await axios.get<Chat[]>("https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev/pong/chats");
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
  const userStatUrl = `https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev/pong/users/${userId}/stats`;
  const resp = await axios.get<UserStats>(userStatUrl);
  if (resp.status === 200) {
    stats = {...resp.data, userId: resp.data.userId }
  } 
  return stats;
}

const friends: Friend[] = await fetchAllFriends();
const ChatUserList = await fetchAllUsers();
// will filters all pending|accepted users;
const fetchAllUsersFriends = async (relation: string, friendList: Friend[]): Promise<Friend[]> => {
  return friendList.filter((el: any) => el.relation == relation);
};

const ChatUserFriendsList: Friend[] = await fetchAllUsersFriends(ACCEPTED, friends);
const ChatUserFriendRequestList: Friend[] = await fetchAllUsersFriends(PENDING, friends);
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

const ChatGameRequestList = [

  {
    id: 1,
    receiver: '1',
    sender: '7',
    difficulty: enGameDifficulty.EXTREME
  },
  {
    id: 1,
    receiver: '1',
    sender: '5',
    difficulty: enGameDifficulty.HARD
  },
  {
    id: 1,
    receiver: '3',
    sender: '7',
    difficulty: enGameDifficulty.EASY
  },
  {
    id: 1,
    receiver: '8',
    sender: '1',
    difficulty: enGameDifficulty.MEDIUM
  }
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
  friendToUserType,
  fetchAllUsersFriends,
  fetchAllUsers,
  fetchAllFriends,
  fetchAllMessages,
  fetchAllStats
};
