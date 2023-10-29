import { faker } from "@faker-js/faker";
import {
  Chat,
  User,
  Friend,
} from "../types";
import axios from "axios";
import { ACCEPTED, PENDING } from "../APP_CONSTS";

const fetchAllUsers = async (): Promise<User[]> => {
  const resp = await axios<User[]>("http://localhost:5000/pong/users");
  let users: User[] = [];
  if (resp.status === 200) {
    users = resp.data;
  }
  return users;
};

const fetchAllFriends = async (): Promise<Friend[]> => {
  const urlFriend = "http://localhost:5000/pong/friends";
  const resp = await axios<Friend[]>(urlFriend);
  let friends: Friend[] = [];
  if (resp.status === 200) {
    friends = resp.data;
  }
  return friends;
};

const ChatUserList = await fetchAllUsers();
const friends = await fetchAllFriends();

// will filters all pending|accepted users;
const fetchAllUsersFriends = (relation: string): Friend[] => {
  return friends.filter((el) => el.relation == relation);
};
const ChatUserFriendsList: Friend[] = fetchAllUsersFriends(ACCEPTED);
const ChatUserFriendRequestList: Friend[] = fetchAllUsersFriends(PENDING);

const friendToUserType = (user: string | null, friend: Friend) => {
  if (user != friend.sender) {
    return ChatUserList.filter(el => friend.sender == el.id)[0];
  }
  return ChatUserList.filter((el) => friend.receiver == el.id)[0];
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
    id: "7",
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
    id: "0",
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
    usrId: 0,
    channelId: 3,
    rank: "admin", // member
    state: "priviledge", // kicked, banned
  },
  {
    id: 2,
    usrId: 7,
    channelId: 3,
    rank: "member", // member
    state: "priviledged", // kicked, banned, mute, priviledge
  },
  {
    id: 4,
    usrId: 5,
    channelId: 3,
    rank: "member", // member
    state: "priviledged", // kicked, banned, mute, priviledge
  },
  {
    id: 5,
    usrId: 3,
    channelId: 3,
    rank: "Owner", // member
    state: "priviledged", // kicked, banned, mute, priviledge
  },
];
const ChatGroupMemberList2 = [
  {
    id: 1,
    usrId: 0,
    channelId: 3,
    rank: "admin", // member
    state: "priviledge", // kicked, banned
  },
  {
    id: 2,
    usrId: 7,
    channelId: 3,
    rank: "member", // member
    state: "priviledged", // kicked, banned, mute, priviledge
  },
];

export {
  ChatUserList,
  ChatUserFriendsList,
  ChatUserFriendRequestList,
  ChatGroupList,
  ChatGroupMemberList,
  ChatGroupMemberList2,
  dummyUsers,
  friendToUserType,
};
