const ChatUserList = [
    {
        id: 0,
        img: "avatar_img",
        name: "pmeising",
        msg:  "Wo bist du?",
        time: "1:26",
        unread: 0,
        online: false
    },
    {
        id: 1,
        img: "avatar_img",
        name: "monine",
        msg:  "Ques que ces",
        time: "5:16",
        unread: 2,
        online: true
    },
    {
        id: 2,
        img: "avatar_img",
        name: "facinet",
        msg:  "Bonjour mes ami",
        time: "3:46",
        unread: 1,
        online: true
    },
    {
        id: 3,
        img: "avatar_img",
        name: "cudoh",
        msg:  "See you tomorrow",
        time: "3:46",
        unread: 0,
        online: true
    },
    {
        id: 4,
        img: "avatar_img",
        name: "Martin",
        msg:  "Holy shit",
        time: "3:46",
        unread: 1,
        online: false
    },
    {
        id: 4,
        img: "avatar_img",
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