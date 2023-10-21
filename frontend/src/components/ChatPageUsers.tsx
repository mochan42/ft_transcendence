import { useState, useEffect } from "react";
import { TChatUserData } from "../types";
import { ChatUserList } from '../data/ChatData';
import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge } from "@mui/material";
import { CircleDashed, Handshake } from "phosphor-react";
import ChatConversation from "./ChatConversation";
import { ChatProps } from "../types";
import ChatFriends from "./ChatFriends";
import { useSelector } from "react-redux";
import { selectChatStore } from "../redux/store";
import ChatContact from "./ChatContact";



const ChatElement = (user : TChatUserData) => {
    return (
        <div className="w-full h-1/3 bg-slate-900 rounded text-slate-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 overflow-auto p-1">
                    {/* {user.online ? (
                        <span className="relative">
                            <span className="block w-8 h-8 bg-green-500 rounded-full">
                                <span className="w-3 h-3 bg-green-400 rounded-full absolute bottom-0 right-0"></span>
                            </span>
                        </span>
                    ) : (
                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                    )} */}
                    <div className="space-y-0.2">
                        <p className="text-base font-semibold">
							{user.name}
						</p>
                        <p className="text-xs">
							{user.msg}
						</p>
                    </div>
                </div>
                <div className="space-x-2 flex items-center">
                    <p className="text-xs">
						{user.time}
					</p>
                    {user.unread > 0 && (
                        <span className="bg-amber-400 text-white px-2 py-1 rounded-full">
                            {user.unread}
                        </span>
                    )}
                </div>
            </div>
        </div>
    ); 
}


const  ChatPageUsers = (chatProp : ChatProps) => {
    const [dialogState, setDialogState] = useState<boolean>(false);
    const chatStore = useSelector(selectChatStore)
    const [userListCompWidth, setUserListCompWidth] = useState<Number>(350)

    const handleOpenDialog = ()=>{
        setDialogState(true)
    }
    const handleCloseDialog = ()=>{
        setDialogState(false)
    }
    useEffect(()=>{
        if (chatStore.chatSideBar.open)
        {
            setUserListCompWidth(500);
        }
        else
        {
            setUserListCompWidth(350);
        }

    }, [chatStore.chatSideBar.open])
    return (
    <>
        <Box 
          sx={{
            position:"relative",
            height: "100%",
            width: "95vw",
            //minWidth: "1200px",
            backgroundColor: "white",
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"
          }}>
            <Stack direction={"row"} p={3} spacing={1}>
                <Stack p={3}
                    spacing={1}
                    sx={{height:"75vh", 
                        width: `${userListCompWidth}px`, 
                        borderColor:"grey", borderWidth:"1px"}}
                >
                    {/* Chatuserlist */}
                    <Stack direction={"row"} 
                        alignItems={"centered"} 
                        justifyContent={"space-between"}>
                        <Typography variant='h5'>Chats</Typography>
                        <Stack direction={"row"} alignItems={"centered"} spacing={1}>
                            <IconButton onClick={()=>{handleOpenDialog()}}>
                                <Handshake/>
                            </IconButton>
                            <IconButton>
                                <CircleDashed/>
                            </IconButton>
                        </Stack>
                    </Stack>
                    <Divider/>
                    <Stack 
                        sx={{flexGrow:1, overflowY:"scroll", height:"100%"}}
                        spacing={0.5} 
                    >
                        {ChatUserList.map((el) => { return (<ChatElement {...el} />) })}
                    </Stack>
                </Stack>
                {/* conversation panel */}
                <Stack sx={{ width: "100%" }}>
                    <ChatConversation userId={chatProp.userId} socket={chatProp.socket} />
                </Stack>

                {/* show the contact profile on toggle */}
                <Stack>
    			{ chatStore.chatSideBar.open && <ChatContact/> }
                </Stack>
            </Stack>
        </Box>
        {/* handle friend request dialog panel */}
        { dialogState && <ChatFriends open={dialogState} handleClose={handleCloseDialog}/>}
    </>
      );
}
 

export default ChatPageUsers  ;