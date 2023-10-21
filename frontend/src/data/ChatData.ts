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
        id: 5,
        img: faker.image.avatar(),
        name: "Pascal",
        msg:  "Holy shit",
        time: "3:46",
        unread: 1,
        online: false
    },
    {
        id: 6,
        img: faker.image.avatar(),
        name: "Maxwell",
        msg:  "Go home",
        time: "3:46",
        unread: 1,
        online: false
    },
    {
        id: 7,
        img: faker.image.avatar(),
        name: "Thomas",
        msg:  "Go home",
        time: "3:46",
        unread: 0,
        online: false
    },
    {
        id: 8,
        img: faker.image.avatar(),
        name: "Heinz",
        msg:  "You have a package",
        time: "3:46",
        unread: 0,
        online: true
    },
    {
        id: 9,
        img: faker.image.avatar(),
        name: "Kirill",
        msg:  "I working late",
        time: "3:46",
        unread: 0,
        online: true
    },
    {
        id: 10,
        img: faker.image.avatar(),
        name: "Pavel",
        msg:  "see you tomorrow",
        time: "3:46",
        unread: 1,
        online: true
    },
    {
        id: 11,
        img: faker.image.avatar(),
        name: "Tobias",
        msg:  "crazy programming",
        time: "3:46",
        unread: 1,
        online: true
    },
    {
        id: 12,
        img: faker.image.avatar(),
        name: "Michael",
        msg:  "who does it best",
        time: "3:46",
        unread: 1,
        online: true
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