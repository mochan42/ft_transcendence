import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Stack, Avatar, Typography, Button, Box, Badge, Divider } from '@mui/material'
import { Friend, User } from '../types';
import { useSelector, useDispatch } from 'react-redux';
import { selectChatStore } from '../redux/store';
import { toggleSidebar, updateStateUserFriendDialog, updateChatUserFriendRequests } from '../redux/slices/chatSlice';
import { updateChatUserFriends, updateChatActiveUser } from '../redux/slices/chatSlice';
import { ACCEPTED, PENDING } from '../APP_CONSTS';
import Cookies from 'js-cookie';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { enChatMemberRank } from '../enums';



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
    //const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const userId = '0' // for testing only
    const loggedUser = chatStore.chatGroupMembers.filter(el => (el.usrId.toString()) === userId)[0]
    console.log(loggedUser, 'id- ', userId)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
        <>
        <StyledChatBox sx={{
            width : "100%",
            biorderRadius: 1,
            backgroundColor: theme.palette.background.paper,
            p: 2
        }}
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
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
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
            <MenuItem onClick={handleClose}>View profile</MenuItem>
            <MenuItem onClick={handleClose}>Play game</MenuItem>
            { loggedUser.rank != enChatMemberRank.MEMBER &&  <Divider/> }
            { loggedUser.rank != enChatMemberRank.MEMBER &&  <MenuItem onClick={handleClose}>Mute</MenuItem> }
            { loggedUser.rank != enChatMemberRank.MEMBER &&   <MenuItem onClick={handleClose}>Kick</MenuItem> }
            { loggedUser.rank != enChatMemberRank.MEMBER &&   <MenuItem onClick={handleClose}>Demote</MenuItem> }
            { loggedUser.rank != enChatMemberRank.MEMBER &&   <MenuItem onClick={handleClose}>Promote</MenuItem> }
        </Menu>
        </>
    )
}

export default ChatGroupMemberComp