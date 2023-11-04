import { Tabs, Dialog, Stack, Tab } from '@mui/material';
import { useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { updateStateUserFriendDialog } from '../redux/slices/chatSlice';
import { useSelector } from 'react-redux';
import { selectChatStore } from "../redux/store";
import { ChatUserComp, ChatUserFriendComp, ChatUserFriendRequestComp } from './ChatUserComp';
import Cookies from 'js-cookie';
import { User } from "../types";
import { ACCEPTED, PENDING } from '../APP_CONSTS';
import ChatUserProfile from './ChatUserProfile';


const ChatDialogShwProfile = ({userId} : any) =>{

    const chatStore = useSelector(selectChatStore)
    const dispatch = useDispatch()
    const open = chatStore.chatUserFriendDialogState;

    const handleClose = ()=>{
        dispatch(updateStateUserFriendDialog(false));
    }


    return (
        <>
        <Dialog fullWidth maxWidth="xs" open={open} keepMounted
            onClose={handleClose} sx={{p: 4}}
        >
            {/* Dialog content  */}
            <Stack sx={{heigt: "100%"}}>
                <ChatUserProfile userId={userId} />
            </Stack>

        </Dialog>
        </>
    )
}






export default ChatDialogShwProfile