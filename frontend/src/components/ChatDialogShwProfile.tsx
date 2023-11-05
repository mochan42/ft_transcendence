import { Tabs, Dialog, Stack, Tab } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateStateUserFriendDialog } from '../redux/slices/chatSlice';
import { useSelector } from 'react-redux';
import { selectChatDialogStore, selectChatStore } from "../redux/store";
import Cookies from 'js-cookie';
import { User } from "../types";
import ChatUserShwProfile from './ChatUserShwProfile';
import { updateChatDialogShwProfile } from '../redux/slices/chatDialogSlice';


const ChatDialogShwProfile = ({userId} : any) =>{

    const chatStore = useSelector(selectChatDialogStore)
    const dispatch = useDispatch()
    const open = chatStore.chatDialogShwProfile;

    const handleClose = ()=>{
        dispatch(updateChatDialogShwProfile(false));
    }


    return (
        <>
        <Dialog fullWidth maxWidth="xs" open={open} keepMounted
            onClose={handleClose} sx={{p: 4}}
        >
            {/* Dialog content  */}
            <Stack sx={{height: "100%"}}>
                <ChatUserShwProfile userId={userId} />
            </Stack>

        </Dialog>
        </>
    )
}






export default ChatDialogShwProfile