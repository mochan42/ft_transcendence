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
import { useDispatch } from "react-redux";
import { selectConversation, updateChatActiveUser, updateStateUserFriendDialog } from "../redux/slices/chatSlice";
import { enChatType } from "../enums";



const ChatElement = (user : TChatUserData) => {
    const dispatch = useDispatch();
    return (
        <Box 
            onClick={()=>{
                dispatch(selectConversation({chatRoomId: user.id, chatType: enChatType.OneOnOne}))
                dispatch(updateChatActiveUser(user));
            }}
            sx={{
                width: "100%",
                backgroundColor: "#ddd",
                borderRadius: 1
            }}
            p={2}
        >
            <Stack 
                direction={"row"}
                alignItems={"center"} 
                justifyContent={"space-between"}
            >
                <Stack direction="row" spacing={2}>
                    {user.online ? 
                    <Badge 
                        color="success" 
                        variant="dot" 
                        anchorOrigin={{vertical:"bottom", horizontal:"left"}}
                        overlap="circular"
                    >
                        <Avatar src={ user.img }/>
                    </Badge>
                    : <Avatar alt={ user.name }/>
                    }
                    <Stack spacing={0.2}>
                        <Typography variant="subtitle2">{ user.name }</Typography>
                        <Typography variant="caption">{ user.msg } </Typography>
                    </Stack>
                </Stack>
                <Stack spacing={2} alignItems={"center"}>
                    <Typography variant="caption">{ user.time }</Typography>
                    <Badge color="primary" badgeContent={ user.unread }></Badge>
                </Stack>

            </Stack>
        </Box>
    ); 
}

const  ChatPageUsers = (chatProp : ChatProps) => {
    const [dialogState, setDialogState] = useState<boolean>(false);
    const chatStore = useSelector(selectChatStore)
    const dispatch = useDispatch()

    const handleOpenDialog = ()=>{
        dispatch(updateStateUserFriendDialog(true));
        // setDialogState(true)
    }
    // const handleCloseDialog = ()=>{
    //     dispatch(updateStateUserFriendDialog(false)); 
    //     // setDialogState(false)
    // }
    return (
    <>
        <Stack direction={"row"} sx={{ width: "95vw"}}>
        <Box 
          sx={{
            position:"relative",
            height: "100%",
            minWidth: "350px",
            backgroundColor: "white",
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"
          }}>
                <Stack p={3} spacing={1} sx={{height:"75vh"}} >

                    {/* Chatuserlist */}
                    <Stack 
                        direction={"row"} 
                        alignItems={"centered"} 
                        justifyContent={"space-between"}
                    >
                        <Typography variant='h5'>Chats</Typography>
                        <Stack direction={"row"} alignItems={"centered"} spacing={1}>
                            <IconButton onClick={()=>{handleOpenDialog()}}>
                                <Handshake/>
                            </IconButton>
                        </Stack>
                    </Stack>
                    <Divider/>
                    <Stack 
                        sx={{flexGrow:1, overflowY:"scroll", height:"100%"}}
                        spacing={0.5} 
                    >
                        {chatStore.chatUserFriends.map((el) => { return (<ChatElement {...el} />) })}
                    </Stack>
                </Stack>
        </Box>

                {/* conversation panel */}
                <Stack sx={{ width: "100%" }} alignItems={"center"} justifyContent={"center"}>
                    {chatStore.chatRoomId !== null && chatStore.chatType === enChatType.OneOnOne 
                        ? <ChatConversation userId={chatProp.userId} socket={chatProp.socket} />
                        : <Typography variant="subtitle2">Select chat or create new</Typography>
                    }
                </Stack>

                {/* show the contact profile on toggle */}
                <Stack>
    			{ chatStore.chatSideBar.open && <ChatContact/> }
                </Stack>
        </Stack>
        {/* handle friend request dialog panel */}
        { chatStore.chatUserFriendDialogState && <ChatFriends />}
    </>
      );
}
 

export default ChatPageUsers  ;