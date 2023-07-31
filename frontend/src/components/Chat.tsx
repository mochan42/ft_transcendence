// import React, { useState, useEffect } from "react";
// import { Socket } from "socket.io";

// const Chat = () => {
// 	const [messages, setMessages] = useState([]);
// 	const [message, setMessage] = useState("");
// 	const [username, setUsername] = useState("");

// 	const socket = io("http://localhost:5000"); // Replace with your backend server URL

// 	io.on('connection', Socket => {
// 		socket.emit('request', /* … */); // emit an event to the socket
// 		io.emit('broadcast', /* … */); // emit an event to all connected sockets
// 		socket.on('reply', () => { /* … */ }); // listen to the event
// 	  });

// 	useEffect(() => {
// 	socket.on("message", (data) => {
// 		setMessages((prevMessages) => [...prevMessages, data]);
// 	});
// 	}, []);

// 	const handleSendMessage = () => {
// 	if (message.trim() !== "") {
// 		socket.emit("sendMessage", { username, message });
// 		setMessage("");
// 	}
// 	};

// 	return (
// 		<div className="p-4">
// 			<div className="h-80 border p-2 overflow-y-auto">
// 			{messages.map((msg, index) => (
// 				<div key={index} className="mb-2">
// 				<span className="font-bold">{msg.username}: </span>
// 				<span>{msg.message}</span>
// 				</div>
// 			))}
// 			</div>
// 			<div className="mt-2">
// 			<input
// 				type="text"
// 				placeholder="Username"
// 				value={username}
// 				onChange={(e) => setUsername(e.target.value)}
// 				className="p-2 border mr-2"
// 			/>
// 			<input
// 				type="text"
// 				placeholder="Enter your message..."
// 				value={message}
// 				onChange={(e) => setMessage(e.target.value)}
// 				className="p-2 border mr-2"
// 			/>
// 			<button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white">
// 				Send
// 			</button>
// 			</div>
// 		</div>
// 	);
// };

// export default Chat;
