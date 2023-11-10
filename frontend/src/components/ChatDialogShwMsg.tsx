import { Tabs, Dialog, Stack, Tab, Typography, Divider } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateStateUserFriendDialog } from '../redux/slices/chatSlice';
import { useSelector } from 'react-redux';
import { selectChatDialogStore, selectChatStore } from "../redux/store";
import Cookies from 'js-cookie';
import { User } from "../types";
import ChatUserShwProfile from './ChatUserShwProfile';
import { updateChatDialogShwMsg, updateChatDialogShwProfile } from '../redux/slices/chatDialogSlice';
import { Divide } from 'phosphor-react';
import { enChatPrivacy } from '../enums';
import { getUserById } from './ChatConversation';
import { dummyUsers } from '../data/ChatData';


const ChatDialogShwMsg = ({userId} : any) =>{

    const chatDialogStore = useSelector(selectChatDialogStore)
    const chatStore = useSelector(selectChatStore)
    const dispatch = useDispatch()
    const open = chatDialogStore.chatDialogShwMsg;
    const group = chatStore.chatPreActiveGroup;
    const groupOwnerUserData = getUserById(chatStore.chatUsers, group?.ownerId)  // uncomment for production
    // const groupOwnerUserData = getUserById(dummyUsers, group?.ownerId) // for dev purpose only
    let title = ""
    let msg1 = "Contact Channel Owner ("
    let msg2 = ") for access"
    let msg = ""


    if (group?.privacy == enChatPrivacy.PRIVATE)
    {
        title = "Error: Invalid Private Channel Access"
        msg = msg1 + groupOwnerUserData?.userName + msg2
    }
    else if (group?.privacy == enChatPrivacy.PROTECTED)
    {
        title = "Error: Invalid Proctected Channel Access"
        msg2 = ") for password"
        msg = msg1 + groupOwnerUserData?.userName + msg2
    }


    const handleClose = ()=>{
        dispatch(updateChatDialogShwMsg(false)); // close dialog 
    }


    return (
        <>
        <Dialog fullWidth maxWidth="xs" open={open} keepMounted
            onClose={handleClose} sx={{p: 4}}
        >
            {/* Dialog content  */}
            <Stack sx={{height: "100%"}} padding={3}>
                <Stack sx={{backgroundColor:"#6fa8dc"}} alignItems={"center"} spacing={2}>
                    <Typography variant='h5'>{title} </Typography>
                </Stack>
                <Divider/>
                <Stack spacing={2}>
                    <Typography variant='caption'>{msg}</Typography>
                </Stack>
            </Stack>

        </Dialog>
        </>
    )
}



export default ChatDialogShwMsg