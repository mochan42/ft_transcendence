import { useRef, useState } from "react";
import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge } from "@mui/material";
import { CaretDown } from "phosphor-react";
import { Socket } from "socket.io-client";
import { ChatMessageProps, User } from "../types";
import ChatMessage from "./ChatMessage";
//import { Chat_History } from "../data/ChatData";
import { toggleSidebar, updateSidebarType } from "../redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectChatStore } from "../redux/store";
import { ChatProps } from "../types";


const ChatConversation: React.FC<ChatProps> = ({ userId, socket }) => {

	const [channels, setChannels] = useState<string[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [userMessage, setUserMessage] = useState<string>('');
    const [messages, setMessages] = useState< ChatMessageProps [] >([]);
    const [username, setUserName] = useState<string>('');
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const chatStore = useSelector(selectChatStore);

	var id = 0;

    const url_info = 'http://localhost:5000/pong/users/' + userId;
	
	const scrollToBottom = () => {
		if (messageContainerRef.current) {
			messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
		}
	};

    const onMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = userMessage.trim();
    
        if (trimmedMessage !== '') {
            if (socket) {
                socket.emit('message', {
                    username,
                    message: userMessage,
                });
                id++;
            }
    
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

    return ( 
        <Stack sx={{ height: "100%", width: "100%",
            }} 
        >
            {/* Chat header */}
            <Box p={1} sx={{ 
                width: "100%", backgroundColor: "white",
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)" }}
            >
                <Stack direction={"row"} justifyContent={"space-between"} sx={{ height:"100%", width:"100%"}}>
                    <Stack onClick={ ()=> { 
                                            dispatch(toggleSidebar());
                                            console.log(chatStore.chatSideBar.type);
                                            console.log(chatStore.chatSideBar.open);
                                        } 
                                   }
                           direction={"row"} spacing={2} alignContent={"center"}
                    >
                        <Box p={1}>
                            <Badge 
                                color="success" 
                                variant="dot" 
                                anchorOrigin={{vertical:"bottom", horizontal:"left"}}
                                overlap="circular"
                            >
                                <Avatar alt="image"/>
                            </Badge>
                        </Box>
                        <Stack spacing={0.2}>
                            <Typography variant="subtitle1">pmeising</Typography>
                            <Typography variant="caption">Online</Typography>
                        </Stack>
                    </Stack>
                    <Stack>
                        <IconButton>
                            <CaretDown />
                        </IconButton>
                    </Stack>
                </Stack>
            </Box>


            {/* Chat message */}
            <Box p={1} sx={{ height: "100%", width: "100%", backgroundColor: "#eee", overflowY: "scroll" }} >
                {/* what's the diff with others ChatMessage */}
                {/* <ChatMessage {new} /> */}
                <ChatMessage incoming={true} user="facinet" message="Hello there" timeOfSend={new Date} id={1}/>
				<div className='w-4/5 p-4' ref={messageContainerRef}>
                    <div className='flex-1'>
                        {messages.map((message) => (
                            <div key={message.id} className='mb-2'>
                                <p>{message.user}: {message.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Box>
			<div className="h-4/5 w-full">
				<div className="p-1 h-5/6 w-full bg-gray-200 overflow-y-auto">
					<ChatMessage incoming={true} user="facinet" message="Hello there" timeOfSend={new Date} id={1}/>
					<ChatMessage incoming={false} user="cudoh" message="How are you doing?" timeOfSend={new Date} id={2} />
					{messages.map((message) => (
						<div key={message.id} className="mb-2">
							<ChatMessage incoming={message.incoming} user={message.user} message={message.message} timeOfSend={message.timeOfSend} id={message.id} />
						</div>
					))}
				</div>
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
        </Stack>
    );
}
 
export default ChatConversation;    