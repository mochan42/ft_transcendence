import { faker } from "@faker-js/faker";
import {
  Chat,
  User,
  Friend,
} from "../types";
import axios from "axios";
import { ACCEPTED, PENDING } from "../APP_CONSTS";

const fetchAllUsers = async (): Promise<User[]> => {
  const resp = await axios.get<User[]>("http://localhost:5000/pong/users");
  let users: User[] = [];
  if (resp.status === 200) {
    users = resp.data;
  }
  return users;
};

const fetchAllFriends = async (): Promise<Friend[]> => {
  const urlFriend = "http://localhost:5000/pong/friends";
  const resp = await axios.get<Friend[]>(urlFriend);
  let friends: Friend[] = [];
  if (resp.status === 200) {
    friends = resp.data;
  }
  return friends;
};

const fetchAllMessages = async (): Promise<Chat[]> => {
  let messages: Chat[] = [];
  const resp = await axios.get<Chat[]>("http://localhost:5000/pong/chats");
  if (resp.status === 200) {
    messages = resp.data;
  }
  return messages;
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
    password: "42wolfs",
    title: "Trans_proj",
    privacy: "public",
    ownerId: 7,
  },
  {
    channelId: 2,
    password: "42wolfs",
    title: "Trans_proj",
    privacy: "public",
    ownerId: 5,
  },
];

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
];

export {
  ChatUserList,
  ChatUserFriendsList,
  ChatUserFriendRequestList,
  ChatGroupList,
  ChatGroupMemberList,
  ChatUserMessages,
  friendToUserType,
  fetchAllUsersFriends,
  fetchAllUsers,
  fetchAllFriends,
  fetchAllMessages,
};
