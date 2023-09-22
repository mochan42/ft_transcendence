import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge } from "@mui/material";
import { CaretDown } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message, User } from "../types";
import ChatMessage from "./ChatMessage";
//import { Chat_History } from "../data/ChatData";
import { toggleSidebar, updateSidebarType } from "../redux/slices/chatSideBar";
import { useDispatch, useSelector } from "react-redux";
import { selectChatSidebar } from "../redux/store";

interface ChatProps {
    userId: string | null;
}

const ChatConversation: React.FC<ChatProps> = ({ userId }) => {

	const [channels, setChannels] = useState<string[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [userMessage, setUserMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket | undefined>();
    const [username, setUserName] = useState<string>('');
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const chatSideBar = useSelector(selectChatSidebar);

	var id = 0;

    const url_info = 'http://localhost:5000/pong/users/' + userId;
	useEffect(() => {
        const socket: Socket = io('ws://localhost:8080');
        setSocket(socket);
	  
		socket.on('connect', () => {
		  console.log('Connected to socket');
		});
	  
		socket.on('message', (data: Message) => {
		  setMessages((prevMessages) => [...prevMessages, data]);
		});
	  
		return () => {
		  socket.disconnect();
		};
	  }, []);

	
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
    
            const newMessage: Message = {
                user: username,
                id: id,
                type:"msg",
                subtype: "",
                message: userMessage,
                img: "",
                incoming: false,
				outgoing: true,

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
                                            console.log(chatSideBar.chatSideBar.type);
                                            console.log(chatSideBar.chatSideBar.open);
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
            <Box p={1} sx={{ height: "100%", width: "100%", backgroundColor: "#eee", overflowY:"scroll"}} >
                <ChatMessage/>
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


            {/* Chat footer */}
            <Box p={1} sx={{ width: "100%", backgroundColor: "white", 
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"}} 
            >
                <Stack direction={"row"} sx={{ width:"100%"}} p={0}>
                    
                <input 
                    placeholder="Type here..."
                    className='flex-1 px-3 py-2 text-slate-800 rounded border border-slate-300 focus:outline-none focus:border-amber-400'
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    //{/*onKeyDown={handleKeyDown}*/}
                />
                <button
                    //{/*onClick={onMessageSubmit}*/}
                    className='bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500'
                >
                    Send
                </button>
                </Stack>

            </Box>
        </Stack>
     );
}
 
export default ChatConversation;    