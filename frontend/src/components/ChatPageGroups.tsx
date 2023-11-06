
import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge, Link, Icon} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Users, ChatCircleDots, Phone, Plus, Handshake} from "phosphor-react";
import { useState } from "react";
import img42 from "../img/icon_42.png"
import ChatPageGroupsCreate from "./ChatPageGroupsCreate";

import { ChatProps, Group, User } from "../types";
import ChatConversation from "./ChatConversation";
import ChatGroupProfile from "./ChatGroupProfile";
import { selectChatDialogStore, selectChatStore } from "../redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectConversation, updateChatActiveGroup, updateChatGroupMembers } from "../redux/slices/chatSlice";
import { enChatType } from "../enums";
import Cookies from 'js-cookie';
import { updateChatDialogGroupInvite } from "../redux/slices/chatDialogSlice";
import ChatFriends from "./ChatFriends";
import ChatDialogGroupInvite from "./ChatDialogGroupInvite";
import { ChatGroupMemberList2 } from "../data/ChatData";


const ChatGroupElement = (group : Group) => {
    const dispatch = useDispatch();
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const chatStore = useSelector(selectChatStore);

    return (
        <Box 
            onClick={()=>{
                dispatch(selectConversation({chatRoomId: group.channelId, chatType: enChatType.Group}))
                dispatch(updateChatActiveGroup(chatStore.chatGroupList.filter((el) => {
                    if (el && (el.channelId === group.channelId)) {
                        return el;
                    }
                })[0]));
                //  ! TODO : update the active group memberlist here using store reducer
                // use data from backend
                // this is to be done with the chatActiveGroupMembers in Store
                dispatch(updateChatGroupMembers(ChatGroupMemberList2));

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
                    <Badge 
                        overlap="circular"
                    >
                        <Avatar alt={ group.title } src={ img42 }/>
                    </Badge>
                    <Stack spacing={0.2}>
                        <Typography variant="subtitle2">{ group.title }</Typography>
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
    const dispatch = useDispatch()
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const chatStore = useSelector(selectChatStore)
    const chatDialogStore = useSelector(selectChatDialogStore)

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    const handleOpenDialogGroupInvite = ()=>{
        dispatch(updateChatDialogGroupInvite(true));
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
                    <Stack direction={"row"} alignItems={"centered"} 
                        justifyContent={"space-between"}
                    >
                        <Typography variant='h5'>Channels</Typography>
                        <Stack alignItems={"centered"} spacing={1}>
                            <IconButton onClick={handleOpenDialogGroupInvite}>
                                <Handshake/>
                            </IconButton>
                        </Stack>
                    </Stack>
                    <Divider/>

                    {/* Chatgrouplist */}
                    <Stack 
                        direction={"row"} 
                        justifyContent={"space-between"} 
                        alignItems={"center"} 
                    >
                        <Typography variant="h5" component={Link}
                            onClick={ () => { setOpenDialog(true)}}
                        >
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
                        { chatStore.chatGroupList.map((el) => {
                            if (el)
                                return (<ChatGroupElement key={el.channelId} {...el} />) })}
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
			{ chatStore.chatSideBar.open && <ChatGroupProfile/> }
            </Stack>
        </Stack>

        {/* create group channel form */}
        { openDialog && 
            <ChatPageGroupsCreate openState={openDialog} handleClose={handleCloseDialog}/>
        }
        {/* handle group list and invites dialog panel */}
        { chatDialogStore.chatDialogGroupInvite && <ChatDialogGroupInvite />}
        </>
      );
}
 

export default ChatPageGroups;