
import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge, Link, Icon} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Users, ChatCircleDots, Phone, Plus} from "phosphor-react";
import { useState } from "react";
import { faker } from "@faker-js/faker";

import { ChatUserList } from "../data/ChatData";
import ChatPageGroupsCreate from "./ChatPageGroupsCreate";

import { ChatProps, User } from "../types";
import ChatConversation from "./ChatConversation";
import ChatContact from "./ChatContact";
import { selectChatStore } from "../redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectConversation, updateChatActiveUser } from "../redux/slices/chatSlice";
import { enChatType } from "../enums";
import Cookies from 'js-cookie';


const ChatElement = (user : User) => {
    const dispatch = useDispatch();
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const chatStore = useSelector(selectChatStore);

    return (
        <Box 
            onClick={()=>{
                dispatch(selectConversation({chatRoomId: user.id, chatType: enChatType.Group}))
                dispatch(updateChatActiveUser(chatStore.chatUserFriends.filter((el) => {
                    if (el.sender == user.id && el.receiver == userId) {
                        return el;
                    }
                    if (el.receiver == user.id && el.sender == userId) {
                        return el;
                    }
                })[0]));
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
                    {user.isLogged ? 
                    <Badge 
                        color="success" 
                        variant="dot" 
                        anchorOrigin={{vertical:"bottom", horizontal:"left"}}
                        overlap="circular"
                    >
                        <Avatar src={ user.avatar }/>
                    </Badge>
                    : <Avatar alt={ user.userNameLoc }/>
                    }
                    <Stack spacing={0.2}>
                        <Typography variant="subtitle2">{ user.userNameLoc }</Typography>
                        <Typography variant="caption">{ 'Last Message' } </Typography>
                    </Stack>
                </Stack>
                <Stack spacing={2} alignItems={"center"}>
                    <Typography variant="caption">{ 'Time' }</Typography>
                    <Badge color="primary" badgeContent={ 'Unread' }></Badge>
                </Stack>

            </Stack>
        </Box>
    ); 
}


const  ChatPageGroups = (chatProp : ChatProps) => {
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const chatStore = useSelector(selectChatStore)

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
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
                    <Stack alignItems={"centered"} >
                        <Typography variant='h5'>Channels</Typography>
                    </Stack>
                    <Divider/>

                    {/* Chatgrouplist */}
                    <Stack 
                        direction={"row"} 
                        justifyContent={"space-between"} 
                        alignItems={"center"} 
                    >
                        <Typography variant="h5" component={Link}>
                            Create New Channel
                        </Typography>
                        <IconButton onClick={() => { setOpenDialog(true) }} >
                            <Plus style={{ color: theme.palette.primary.main }}/>
                        </IconButton>
                    </Stack>
                    <Divider/>
                    <Stack 
                        sx={{flexGrow:1, overflowY:"scroll", height:"100%"}}
                        spacing={0.5} 
                    >
                        { ChatUserList.map((el: any) => { return (<ChatElement {...el} />) })}
                    </Stack>
                </Stack>
            </Box>

            {/* Right side : conversation panel */}
            <Stack sx={{ width: "100%" }} alignItems={"center"} justifyContent={"center"}>
                {chatStore.chatRoomId !== null && chatStore.chatType === enChatType.Group 
                    ? <ChatConversation userId={ chatProp.userId }/>
                    : <Typography variant="subtitle2">Select channel chat or create new</Typography>
                }
            </Stack>
                
            {/* show the contact profile on toggle */}
            <Stack>
			{ chatStore.chatSideBar.open && <ChatContact/> }
            </Stack>
        </Stack>

        {/* create group channel form */}
        {openDialog && <ChatPageGroupsCreate openState={openDialog} handleClose={handleCloseDialog}/>}
        </>
      );
}
 

export default ChatPageGroups;