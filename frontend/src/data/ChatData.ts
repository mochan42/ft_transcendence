import { faker } from "@faker-js/faker"
const ChatUserList = [
    {
        id: 0,
        img: faker.image.avatar(),
        name: "pmeising",
        msg:  "Wo bist du?",
        time: "1:26",
        unread: 0,
        online: false
    },
    {
        id: 1,
        img: faker.image.avatar(),
        name: "monine",
        msg:  "Ques que ces",
        time: "5:16",
        unread: 2,
        online: true
    },
    {
        id: 2,
        img: faker.image.avatar(),
        name: "facinet",
        msg:  "Bonjour mes ami",
        time: "3:46",
        unread: 1,
        online: true
    },
    {
        id: 3,
        img: faker.image.avatar(),
        name: "cudoh",
        msg:  "See you tomorrow",
        time: "3:46",
        unread: 0,
        online: true
    },
    {
        id: 4,
        img: faker.image.avatar(),
        name: "Martin",
        msg:  "Holy shit",
        time: "3:46",
        unread: 1,
        online: false
    },
    {
        id: 4,
        img: faker.image.avatar(),
        name: "Martin",
        msg:  "Holy shit",
        time: "3:46",
        unread: 1,
        online: false
    },
];

const Chat_History = [
    {
        user: "",
        id: 0,
        type:"msg",
        subtype:"",
        message: "Hi, How are you?",
        img:"",
        incoming: true,
        outgoing: false,
    },
    {
        user: "",
        id: 0,
        type:"msg",
        subtype:"",
        message: "Hello, I am doing great. and u?",
        img:"",
        incoming: false,
        outgoing: true,
    },
    {
        user: "",
        id: 0,
        type:"msg",
        subtype:"img",
        message: "here you go",
        img: "image",
        incoming: true,
        outgoing: false,
    },
    {
        user: "",
        id: 0,
        type:"msg",
        subtype:"doc",
        message: "there is a party tomorrow",
        img: "image",
        incoming: true,
        outgoing: false,
    },
    {
        user: "",
        id: 0,
        type:"msg",
        subtype:"link",
        message: "see you tomorrow",
        img: "image",
        incoming: true,
        outgoing: false,
    },
    {
        user: "",
        id: 0,
        type:"msg",
        subtype:"reply",
        message: "i can do that",
        img: "image",
        incoming: true,
        outgoing: false,
    },
]

export  { ChatUserList, Chat_History };