import { useRef, useState, useEffect } from "react";
import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge } from "@mui/material";
import { CaretDown } from "phosphor-react";
import { Socket } from "socket.io-client";
import { ChatMessageProps, User } from "../types";
import ChatMessage from "./ChatMessage";
import { friendToUserType } from "../data/ChatData";
import { toggleSidebar, updateSidebarType } from "../redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectChatStore } from "../redux/store";
import { ChatProps } from "../types";
import { enChatType } from "../enums";
import img42 from '../img/icon_42.png'


const ChatConversation: React.FC<ChatProps> = ({ userId }) => {

    const dispatch = useDispatch();
    const chatStore = useSelector(selectChatStore);
	const [channels, setChannels] = useState<string[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [userMessage, setUserMessage] = useState<string>('');
    // API CALL
    // Load message for each user or chat group from server.
    // information about conversation type is store in chatStore
    // example:
    // const chatType = chatStore.chatType
    // you can now decide with it to fetch info for group or one_on_one
    //
    const [messages, setMessages] = useState< ChatMessageProps [] >([]);
    const [username, setUserName] = useState<string>('');
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

	var id = 0;

	
	const scrollToBottom = () => {
		if (messageContainerRef.current) {
            messageContainerRef.current.scrollIntoView()
		}
	};

    const onMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = userMessage.trim();
    
        if (trimmedMessage !== '') {
            const newMessage: ChatMessageProps = {
                user: username,
                id: id,
                message: userMessage,
                incoming: false,
				timeOfSend: new Date,
            };
    
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            scrollToBottom();
            setUserMessage('');
        }
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onMessageSubmit(e);
        }
    };

    useEffect(() => {
        scrollToBottom();

    }, [messages]);

    return ( 
        <Stack sx={{ height: "75vh", width: "100%", }} 
            justifyContent={"space-between"}
        >
            {/* Chat header */}
            <Box p={1} sx={{ 
                width: "100%", backgroundColor: "white",
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)" }}
            >
                <Stack direction={"row"} 
                    justifyContent={"space-between"} 
                    sx={{ height:"100%", width:"100%"}}
                >
                    <Stack onClick={ ()=> { 
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
                                        ? (chatStore.chatActiveUser ? friendToUserType(userId, chatStore.chatActiveUser).avatar : "")
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
                                ? (chatStore.chatActiveUser ? friendToUserType(userId, chatStore.chatActiveUser).userNameLoc: "nog")
                                : (chatStore.chatActiveGroup ? chatStore.chatActiveGroup.title: null)
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
                        <ChatMessage incoming={true} user="facinet" message="Hello there" timeOfSend={new Date} id={1}/>
					    {messages.map((message) => (
						    <div key={message.id} className="mb-2">
							    <ChatMessage incoming={message.incoming} user={message.user} message={message.message} timeOfSend={message.timeOfSend} id={message.id} />
						    </div>
					    ))}
                    </div>
                </div>
                {/* Refer to div element for auto scroll to most recent message */}
                <div ref={messageContainerRef}/>
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
							placeholder="Type here..."
							className="flex-1 px-3 py-2 text-gray-800 rounded border border-gray-300 focus:outline-none focus:border-yellow-400"
							value={userMessage}
							onChange={(e) => setUserMessage(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						<button
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