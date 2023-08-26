import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Users, ChatCircleDots, Phone } from "phosphor-react";
import { useState } from "react";
//import { faker } from 'faker-js';

import { TChatUserData } from "../types";
import { ChatUserList } from '../data/ChatData';
import UserCard from "./UserCard";
import Footer from "./Footer";

const ChatElement = (user : TChatUserData) => {
    return (
        <div className="w-full h-1/2 bg-gray-300 rounded p-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 overflow-auto p-4">
                    {/* {user.online ? (
                        <span className="relative">
                            <span className="block w-8 h-8 bg-green-500 rounded-full">
                                <span className="w-3 h-3 bg-green-400 rounded-full absolute bottom-0 right-0"></span>
                            </span>
                        </span>
                    ) : (
                        // <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                    )} */}
                    {/* <div className="space-y-0.2">
                        <p className="text-base font-semibold">{user.name}</p>
                        <p className="text-xs">{user.msg}</p>
                    </div> */}
                </div>
                <div className="space-x-2 flex items-center">
                    {/* <p className="text-xs">{user.time}</p>
                    {user.unread > 0 && (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full">
                            {user.unread}
                        </span>
                    )} */}
                </div>
            </div>
        </div>
    ); 
}


const  ChatPageUsers = () => {
    return (
		<>
		<div className='bg-white shadow-md'>
			<div className="p-3 space-y-1">
				{/* <div className="flex items-center">
					<h5 className="text-xl font-semibold">
						Chats
					</h5>
				</div> */}
				<hr className="border-8 border-yellow-300" />
				<div className="flex flex-col space-y-0.5 overflow-auto">
					<Footer/>
					<Footer/>
					<Footer/>
					<Footer/>
					<Footer/>
					{/* {ChatUserList.map((el) => (
						<ChatElement key={el.id} {...el} />
						))} */}
				</div>
			</div>
		</div>
		</>
	);
}
 

export default ChatPageUsers  ;