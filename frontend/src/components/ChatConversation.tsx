import { useRef, useState, useEffect } from "react";
import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge } from "@mui/material";
import { CaretDown } from "phosphor-react";
import { Socket } from "socket.io-client";
import { ChatMessageProps, User, Chat, Block } from "../types";
import ChatMessage from "./ChatMessage";
import { friendToUserType, fetchAllMessages } from "../data/ChatData";
import { toggleSidebar, updateChatUserMessages, updateSidebarType } from "../redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectChatStore } from "../redux/store";
import { ChatProps } from "../types";
import { enChatGroupInviteStatus, enChatMemberRights, enChatType } from "../enums";
import { getSocket } from '../utils/socketService';
import { PRIVATE, GROUP } from '../APP_CONSTS';
import { fetchAllDirectMessages, fetchAllGroupMessages } from "./ChatPageUsers";
import img42 from '../img/icon_42.png'
import Cookies from "js-cookie";
import { BACKEND_URL } from "../data/Global";
import { set } from "react-hook-form";
import { FindUserMemberShip } from './ChatDialogGroupInvite';

export const getUserById = (users: User[], id: any) => {
    return users.filter((user: User) => id == user.id)[0];
}

export const formatMessages = (users: User[], messages: Chat[], userId: any): ChatMessageProps[] => {
    let chats: ChatMessageProps[] = [];
    messages.map((el: Chat) => {
        if (el) {
            const message: ChatMessageProps = {
                user: (el.author == userId) ? Cookies.get('userName') + '' : getUserById(users, el.author).userNameLoc,
                id: el.id,
                message: el.message,
                incoming: (el.author == userId) ? false : true,
                timeOfSend: new Date,
            };
            chats.push(message);
        }
    });
    return chats;
}

export const IsActiveUserBlocked = (
    userId: string | null,
    blockList: (Block | null)[],
    activUser: User | null
): boolean => {

    const blockEntity = blockList!
        .filter((el) => {
            if ((el!.blockerUserId.toString() == userId && el!.blockeeUserId == +activUser!.id)
                || (el!.blockerUserId == +activUser!.id && el!.blockeeUserId.toString() == userId)
            ) { return el }
        })

    if (blockEntity.length > 0) return true;

    return false;
}

const ChatConversation: React.FC<ChatProps> = ({ userId }) => {

    const dispatch = useDispatch();
    const chatStore = useSelector(selectChatStore);
    const [channels, setChannels] = useState<string[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [userMessage, setUserMessage] = useState<string>('');
    const socket = getSocket(userId);
    const [messages, setMessages] = useState<ChatMessageProps[]>([]);
    const [username, setUserName] = useState<string>('');
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [blockState, setBlockState] = useState<boolean>(false);
    const url_info = `${BACKEND_URL}/pong/users/` + userId;

    // const IsPriviledged = (): boolean => {
    //     const chatType = chatStore.chatType;
    //     if (chatType === enChatType.Group) {
    //         const memberShip = userId && FindUserMemberShip(userId, chatStore.chatActiveGroup!.channelId);
    //         if (!memberShip) return false;
    //         if (memberShip.rights !== enChatMemberRights.PRIVILEDGED) return false;
    //     }
    //     return true;
    // }

    const IsLoggedUserBlockedInGroup = (): boolean => {
        if (!userId || !chatStore.chatActiveGroup) {
            return true;
        }
        const memberShip = userId ? FindUserMemberShip(userId, chatStore.chatActiveGroup!.channelId) : null;
        console.log(memberShip);
        if (memberShip != null && memberShip.rights == enChatMemberRights.PRIVILEDGED && memberShip.status == enChatGroupInviteStatus.ACCEPTED) {
            return false;
        }
        else {
            console.log('TRUE');
        }
        return true;
    }

    const isPriviledged = chatStore.chatType == enChatType.OneOnOne ? IsActiveUserBlocked(userId, chatStore.chatBlockedUsers, chatStore.chatActiveUser) : IsLoggedUserBlockedInGroup();

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollIntoView()
        }
    };
    const onMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = userMessage.trim();

        if (trimmedMessage !== '') {
            const newMessage = {
                author: userId,
                message: userMessage,
                type: (chatStore.chatType == enChatType.OneOnOne) ? PRIVATE : GROUP,
                receiver: chatStore.chatRoomId
            };
            socket.emit('sendMessage', newMessage);
            scrollToBottom();
            setUserMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!isPriviledged) {
                onMessageSubmit(e);
            }
        }
    }


    useEffect(() => {
        if (chatStore.chatType == enChatType.OneOnOne) {
            const newDirectMessages = fetchAllDirectMessages(chatStore.chatUserMessages, userId, chatStore.chatRoomId);
            setMessages(formatMessages(chatStore.chatUsers, newDirectMessages, userId));
            //IsActiveUserBlocked();
        }
        else if (chatStore.chatType == enChatType.Group && chatStore.chatRoomId != null) {
            //IsLoggedUserBlockedInGroup();
            const newGroupMessages = fetchAllGroupMessages(chatStore.chatUserMessages, +chatStore.chatRoomId);
            setMessages(formatMessages(chatStore.chatUsers, newGroupMessages, userId));
        }
    }, [chatStore.chatUserMessages, chatStore.chatRoomId,
    chatStore.chatType, chatStore.chatBlockedUsers,
    chatStore.chatGroupMembers]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    //----------------------Incoming events handler -----------------------------------/
    return (
        <Stack sx={{ height: "75vh", width: "100%", }}
            justifyContent={"space-between"}
        >
            {/* Chat header */}
            <Box p={1} sx={{
                width: "100%", backgroundColor: "white",
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"
            }}
            >
                <Stack direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ height: "100%", width: "100%" }}
                >
                    <Stack onClick={() => {
                        dispatch(toggleSidebar());
                        //console.log(chatStore.chatSideBar.type);
                        //console.log(chatStore.chatSideBar.open);
                    }
                    }
                        direction={"row"} spacing={2} alignItems={"center"}
                    >
                        <Box p={1}>
                            <Badge
                            >
                                {/* update with user image or channel group image */}
                                <Avatar alt={"image"} src={
                                    chatStore.chatType === enChatType.OneOnOne
                                        ? (chatStore.chatActiveUser != null ? chatStore.chatActiveUser.avatar : "")
                                        : img42
                                }
                                />
                            </Badge>
                        </Box>
                        <Stack spacing={1.2}>
                            {/* update with username or channel group title */}
                            <Typography variant="subtitle1"
                            > {
                                    chatStore.chatType === enChatType.OneOnOne
                                        ? (chatStore.chatActiveUser != null ? chatStore.chatActiveUser.userNameLoc : "")
                                        : (chatStore.chatActiveGroup ? chatStore.chatActiveGroup.title : null)
                                }
                            </Typography>

                        </Stack>
                    </Stack>
                    <Stack>
                        <IconButton>
                            <CaretDown />
                        </IconButton>
                    </Stack>
                </Stack>
            </Box>


            {/* Chat message window */}
            <Box p={1} sx={{ height: "100%", width: "100%", backgroundColor: "#eee", overflowY: "auto" }} >
                {/* what's the diff with others ChatMessage */}
                {/* <ChatMessage {new} /> */}
                <div className='w-4/5 p-4' >
                    <div className='flex-1'>
                        {/* {messages.map((message) => (
                            <div key={message.id} className='mb-2'>
                                <p>{message.user}: {message.message}</p>
                            </div>
                        ))} */}
                        {/* <ChatMessage incoming={false} user="facinet" message="What ?" timeOfSend={new Date} id={1}/> */}
                        {messages.map((message) => {
                            return (<div key={message.id} className="mb-2">
                                <ChatMessage incoming={message.incoming} user={message.user} message={message.message} timeOfSend={message.timeOfSend} id={message.id} />
                            </div>)
                        })}
                    </div>
                </div>
                {/* Refer to div element for auto scroll to most recent message */}
                <div ref={messageContainerRef} />
            </Box>

            {/* chat message input box */}
            <Box>
                <div className="h-4/5 w-full">
                    {/* <div className="p-1 h-5/6 w-full bg-gray-200 overflow-y-auto">
					<ChatMessage incoming={true} user="facinet" message="Hello there" timeOfSend={new Date} id={1}/>
					<ChatMessage incoming={false} user="cudoh" message="How are you doing?" timeOfSend={new Date} id={2} />
					{messages.map((message) => (
						<div key={message.id} className="mb-2">
							<ChatMessage incoming={message.incoming} user={message.user} message={message.message} timeOfSend={message.timeOfSend} id={message.id} />
						</div>
					))} */}
                    {/* </div> */}

                    <div className="h-1/6 bg-white">
                        <div className="flex items-center w-full">
                            <input
                                disabled={isPriviledged}
                                placeholder="Type here..."
                                className="flex-1 px-3 py-2 text-gray-800 rounded border border-gray-300 focus:outline-none focus:border-yellow-400"
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                disabled={isPriviledged}
                                onClick={onMessageSubmit}
                                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </Box>
        </Stack>
    );
}

export default ChatConversation;