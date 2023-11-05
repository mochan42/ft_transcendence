import { Tabs, Dialog, Stack, Tab, Avatar, Typography, Divider } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectChatDialogStore, selectChatStore } from "../redux/store";
import { updateChatDialogShwPasswd } from '../redux/slices/chatDialogSlice';
import img42 from '../img/icon_42.png'


const ChatDialogShwPasswd = () =>{

    const chatStore = useSelector(selectChatStore)
    const chatDialogStore = useSelector(selectChatDialogStore)
    const dispatch = useDispatch()
    const open = chatDialogStore.chatDialogShwPasswd;
    const activeGroup = chatStore.chatActiveGroup

    const handleClose = ()=>{
        dispatch(updateChatDialogShwPasswd(false));
    }

    return (
        <>
        <Dialog fullWidth maxWidth="xs" open={open} keepMounted
            onClose={handleClose} sx={{p: 4}}
        >
            {/* Dialog content  */}
            <Stack sx={{height: "100%"}} justifyContent={"space-between"}>

                <Stack sx={{ height:"100%", position:"relative"}}
                    p={3} spacing={3}
                >
                    <Stack alignItems={"center"} direction={"row"} spacing={2}>
                        <Avatar src={ img42 } alt={ activeGroup?.title }
                            sx={{ height:60, width:60 }}
                        /> 
                        <Stack spacing={2} >
                            <Typography variant="subtitle2" fontWeight={600}>
                                { activeGroup?.title } 
                            </Typography>
                        </Stack>
                    </Stack>

                    {/* divider  */}
                    <Divider />
                    <Stack alignItems={"center"} direction={"row"} spacing={2}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            { `Password: `}  
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={400}>
                            { activeGroup?.password } 
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Dialog>
        </>
    )
}


export default ChatDialogShwPasswd 