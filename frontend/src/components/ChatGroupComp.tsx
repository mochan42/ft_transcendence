import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Stack, Avatar, Typography, Button, Box, Badge } from '@mui/material'
import { Friend, User } from '../types';
import { useSelector, useDispatch } from 'react-redux';
import { selectChatStore } from '../redux/store';
import { toggleSidebar, updateStateUserFriendDialog, updateChatUserFriendRequests } from '../redux/slices/chatSlice';
import { updateChatUserFriends, updateChatActiveUser } from '../redux/slices/chatSlice';
import { ACCEPTED, PENDING } from '../APP_CONSTS';
import Cookies from 'js-cookie';



const StyledChatBox = styled(Box)(({ theme }) => ({
    "&:hover": {
        cursor: "pointer",
    },

}));

interface IUserData {
    user: User,
    rank: string
}
const ChatGroupMemberComp = (member: IUserData) => {
    const theme = useTheme();
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch();
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';

    return (
        <StyledChatBox sx={{
            width : "100%",
            biorderRadius: 1,
            backgroundColor: theme.palette.background.paper,
            p: 2
        }}
        >
            <Stack
                direction={"row"} 
                alignItems={"center"} 
                justifyContent={"space-between"}
            >
                <Stack direction={"row"} alignItems={"center"} 
                    spacing={2}
                >
                    {" "}
                    <Stack direction="row" spacing={2}>
                        {member.user.isLogged ? 
                            (
                                <Badge
                                    variant='dot'
                                    anchorOrigin={{ vertical:"bottom", horizontal:"right"}}
                                    // overlap='cirular'
                                >
                                    {/* <Avatar alt={member.user.userName} src={member.user.img} /> */}
                                    <Avatar alt="image" src={member.user.avatar} />
                                </Badge>
                             )
                             : (<Avatar alt={member.user.userNameLoc} src={member.user.avatar} />)
                            //  : (<Avatar alt={member.user.userName} src={member.user.img} />)
                        }
                        <Stack direction={"row"} alignItems={"center"} spacing={2}>
                            <Typography variant="subtitle2"> { member.user.userName }</Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Typography variant="subtitle2"> { member.rank }</Typography>
                </Stack>

            </Stack>
        </StyledChatBox>
    )
}

export default ChatGroupMemberComp