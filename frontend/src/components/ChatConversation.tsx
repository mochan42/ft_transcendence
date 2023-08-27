import { useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { ChatMessageProps, User } from "../types";
import ChatMessage from "./ChatMessage";

interface ChatProps {
    userId: string | null;
}

const ChatConversation: React.FC<ChatProps> = ({ userId }) => {

	const [channels, setChannels] = useState<string[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [userMessage, setUserMessage] = useState<string>('');
    const [messages, setMessages] = useState< ChatMessageProps [] >([]);
    const [socket, setSocket] = useState<Socket | undefined>();
    const [username, setUserName] = useState<string>('');
    const messageContainerRef = useRef<HTMLDivElement>(null);

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
        <div className="h-full w-full flex flex-col bg-green-200">
            <div className="p-1 h-1/6 bg-white shadow-md">
                <div className="flex justify-between items-center h-full w-full">
                    <div className="flex items-center space-x-2">
                        <div className="p-1">
                            <span className="relative">
                                <span className="block w-8 h-8 rounded-full">
                                    <img src="avatar-image-url" alt="Avatar" className="w-8 h-8 rounded-full" />
                                </span>
                                <span className="absolute w-3 h-3 rounded-full bottom-0 right-0"></span>
                            </span>
                        </div>
                        <div className="space-y-0.2">
                            <p className="text-base font-medium">pmeising</p>
                            <p className="text-xs text-gray-500">Online</p>
                        </div>
                    </div>
                    <div>
                        <button>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                className="w-6 h-6"
                            >
                                <path d="M24 12l-8 8-8-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
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
        </div>
    );
}
 
export default ChatConversation;    