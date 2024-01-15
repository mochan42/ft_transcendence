import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { User } from "../types";
import axios from "axios";
import { BACKEND_URL } from '../data/Global';

interface ChatProps {
    userId: string | null;
    socket: any
}

type Message = {
    message: string;
    user: string;
    id: number;
}

const Chat: React.FC<ChatProps> = ({ userId, socket }) => {

    const [channels, setChannels] = useState<string[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [userMessage, setUserMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUserName] = useState<string>('');
    const messageContainerRef = useRef<HTMLDivElement>(null);

    var id = 0;

    const url_info = `${BACKEND_URL}/pong/users/` + userId;

    useEffect(() => {
        // Fetch channels from the server and update the channels state
        // For now, you can use a sample array of channels
        const sampleChannels = ['General', 'Random', 'Tech', 'Games'];
        setChannels(sampleChannels);
    }, []);

    const getUserInfo = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
        };
        try {
            const response = await axios.get<User>(url_info, { headers });
            if (response.status === 200) {
                setUserInfo(response.data);
                setUserName(response.data.userName); // Set the username from user info
                // console.log('Received User Info: ', response.data);
            }
        } catch (error) {
            console.log('Error fetching user infos', error);
        }
    };

    useEffect(() => {
        if (userInfo === null) {
            getUserInfo();
        }
    }, [userInfo]);

    useEffect(() => {
        
    }, []);

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
                message: userMessage,
                id: id,
            };
    
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            scrollToBottom();
            setUserMessage('');
        }
    };

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onMessageSubmit(e);
        }
    };

    return (
        
        <div className='text-slate-200 flex flex-col h-full'>
            <div className='h-1/6 px-4 flex items-center text-center'>
                <h1 className='text-2xl font-semibold'>
                    Chat
                </h1>
            </div>
            <div className='flex'>
                <div className="flex flex-col w-1/5 bg-slate-900 dark:bg-slate-700 p-4">
                    <h2 className="text-xl text-amber-400 mb-4">Channels</h2>
                    <div className="space-y-2">
                        {channels.map((channel, index) => (
                            <div key={index} className="text-slate-200 hover:text-white cursor-pointer">
                                # {channel}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='dark:bg-slate-400 text-slate-800 flex-1 flex flex-col border-8 border-slate-900 overflow-auto w-4/5 bg-slate-800 p-4' ref={messageContainerRef}>
                    <div className='flex-1'>
                        {messages.map((message) => (
                            <div key={message.id} className='mb-2'>
                                <p>{message.user}: {message.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='space-x-4 w-full h-1/6 p-4 flex items-center'>
                <input
                    placeholder="Type here..."
                    className='flex-1 px-3 py-2 text-slate-800 rounded border border-slate-300 focus:outline-none focus:border-amber-400'
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={onMessageSubmit}
                    className='bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500'
                >
                    Send
                </button>
            </div>
        </div>
    )
};

export default Chat;