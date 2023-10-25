import { faker } from "@faker-js/faker";
import {
  TUserFriendRequest,
  Chat,
  TChatUserData,
  User,
  Friend,
} from "../types";
import axios from "axios";
import { ACCEPTED, PENDING } from "../APP_CONSTS";

const fetchAllUsers = async () => {
  const resp = await axios<User[]>("http://localhost:5000/pong/users");
  let users;
  if (resp.status === 200) {
    users = resp.data;
  }
  return users;
};

const fetchAllFriends = async () => {
  const urlFriend = "http://localhost:5000/pong/friends";
  const resp = await axios<Friend[]>(urlFriend);
  let friends;
  if (resp.status === 200) {
    friends = resp.data;
  }
  return friends;
};

const users = await fetchAllUsers();
const AllUsers = users ? users : [];
const friends = await fetchAllFriends();
const AllFriends = friends ? friends : [];

const getUserName = (id: number): string => {
  if (AllUsers) {
    const user = AllUsers.find((el) => +el.id === id);
    if (user) {
      return user.userNameLoc;
    }
  }
  return "";
};

const formatMessagesToChatData = (messages: Chat[]) => {
  const chatUserData = messages.map((el) => {
    const formatMsg: TChatUserData = {
      id: el.id,
      img: faker.image.avatar(),
      name: getUserName(el.receiver),
      msg: el.message,
      time: "1:26",
      unread: 0,
      online: false,
    };
    return formatMsg;
  });
  return chatUserData;
};

const fectchAllMessages = async (): Promise<any[]> => {
  const resp = await axios.get<Chat[]>("http://localhost:5000/pong/chats");
  let messages: Chat[] = [];
  if (resp.status === 200) {
    messages = resp.data;
  }
  return formatMessagesToChatData(messages);
};

// const ChatUserList = [
//     {
//         id: 0,
//         img: faker.image.avatar(),
//         name: "pmeising",
//         msg:  "Wo bist du?",
//         time: "1:26",
//         unread: 0,
//         online: false
//     },
//     {
//         id: 1,
//         img: faker.image.avatar(),
//         name: "monine",
//         msg:  "Ques que ces",
//         time: "5:16",
//         unread: 2,
//         online: true
//     },
//     {
//         id: 2,
//         img: faker.image.avatar(),
//         name: "facinet",
//         msg:  "Bonjour mes ami",
//         time: "3:46",
//         unread: 1,
//         online: true
//     },
//     {
//         id: 3,
//         img: faker.image.avatar(),
//         name: "cudoh",
//         msg:  "See you tomorrow",
//         time: "3:46",
//         unread: 0,
//         online: true
//     },
//     {
//         id: 4,
//         img: faker.image.avatar(),
//         name: "Martin",
//         msg:  "Holy shit",
//         time: "3:46",
//         unread: 1,
//         online: false
//     },
//     {
//         id: 5,
//         img: faker.image.avatar(),
//         name: "Pascal",
//         msg:  "Holy shit",
//         time: "3:46",
//         unread: 1,
//         online: false
//     },
//     {
//         id: 6,
//         img: faker.image.avatar(),
//         name: "Maxwell",
//         msg:  "Go home",
//         time: "3:46",
//         unread: 1,
//         online: false
//     },
//     {
//         id: 7,
//         img: faker.image.avatar(),
//         name: "Thomas",
//         msg:  "Go home",
//         time: "3:46",
//         unread: 0,
//         online: false
//     },
//     {
//         id: 8,
//         img: faker.image.avatar(),
//         name: "Heinz",
//         msg:  "You have a package",
//         time: "3:46",
//         unread: 0,
//         online: true
//     },
//     {
//         id: 9,
//         img: faker.image.avatar(),
//         name: "Kirill",
//         msg:  "I working late",
//         time: "3:46",
//         unread: 0,
//         online: true
//     },
//     {
//         id: 10,
//         img: faker.image.avatar(),
//         name: "Pavel",
//         msg:  "see you tomorrow",
//         time: "3:46",
//         unread: 1,
//         online: true
//     },
//     {
//         id: 11,
//         img: faker.image.avatar(),
//         name: "Tobias",
//         msg:  "crazy programming",
//         time: "3:46",
//         unread: 1,
//         online: true
//     },
//     {
//         id: 12,
//         img: faker.image.avatar(),
//         name: "Michael",
//         msg:  "who does it best",
//         time: "3:46",
//         unread: 1,
//         online: true
//     },
// ];

const ChatUserList = await fectchAllMessages();

const Chat_History = [
  {
    user: "",
    id: 0,
    type: "msg",
    subtype: "",
    message: "Hi, How are you?",
    img: "",
    incoming: true,
    outgoing: false,
  },
  {
    user: "",
    id: 0,
    type: "msg",
    subtype: "",
    message: "Hello, I am doing great. and u?",
    img: "",
    incoming: false,
    outgoing: true,
  },
  {
    user: "",
    id: 0,
    type: "msg",
    subtype: "img",
    message: "here you go",
    img: "image",
    incoming: true,
    outgoing: false,
  },
  {
    user: "",
    id: 0,
    type: "msg",
    subtype: "doc",
    message: "there is a party tomorrow",
    img: "image",
    incoming: true,
    outgoing: false,
  },
  {
    user: "",
    id: 0,
    type: "msg",
    subtype: "link",
    message: "see you tomorrow",
    img: "image",
    incoming: true,
    outgoing: false,
  },
  {
    user: "",
    id: 0,
    type: "msg",
    subtype: "reply",
    message: "i can do that",
    img: "image",
    incoming: true,
    outgoing: false,
  },
];

// will filters all pending users;
const fetchAllUsersFriends = (relation: string): User[] => {
  let userFriends: User[] = [];
  if (!AllFriends || !AllUsers) return userFriends;
  AllFriends.filter((el) => el.relation == relation).forEach((friend) => {
    AllUsers.find((user) => {
      if (user.id === friend.receiver || user.id === friend.sender) {
        userFriends.push(user);
      }
    });
  });
  return userFriends;
};
const ChatUserFriendsList: User[] = fetchAllUsersFriends(ACCEPTED);

const ChatUserFriendRequestList = fetchAllUsersFriends(PENDING);

const chatGroupList = [
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

const chatGroupMemberList = [
  {
    usrId: 0,
    channelId: 3,
    rank: "admin", // member
    state: "priviledge", // kicked, banned
  },
  {
    usrId: 7,
    channelId: 3,
    rank: "member", // member
    state: "priviledged", // kicked, banned, mute, priviledge
  },
  {
    usrId: 5,
    channelId: 3,
    rank: "member", // member
    state: "priviledged", // kicked, banned, mute, priviledge
  },
];

export {
  ChatUserList,
  Chat_History,
  ChatUserFriendsList,
  ChatUserFriendRequestList,
  AllUsers,
  AllFriends,
};
