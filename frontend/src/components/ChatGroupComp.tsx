import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Stack, Avatar, Typography, Button, Box, Badge, Divider } from '@mui/material'
import { Friend, Group, JoinGroup, User } from '../types';
import { useSelector, useDispatch } from 'react-redux';
import { selectChatDialogStore, selectChatStore } from '../redux/store';
import Cookies from 'js-cookie';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { enChatMemberRank, enChatMemberRights, enChatPrivacy } from '../enums';
import { updateChatDialogProfileUserId, updateChatDialogShwProfile } from '../redux/slices/chatDialogSlice';
import img42 from "../img/icon_42.png"
import { getUserById } from './ChatConversation';



const StyledChatBox = styled(Box)(({ theme }) => ({
    "&:hover": {
        cursor: "pointer",
    },

}));

interface IUserData {
    memberUser: User,
    memberJoin: JoinGroup
}
const ChatGroupMemberProfileComp = (user: IUserData) => {
    const theme = useTheme();
    const chatStore = useSelector(selectChatStore);
    const chatDialogStore = useSelector(selectChatDialogStore);
    const dispatch = useDispatch();
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    // const userId = '0' // for testing only
    const loggedUser = chatStore.chatGroupMembers.filter(el => (el.usrId.toString()) === userId)[0]
    // console.log(loggedUser, 'id- ', userId)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const onShwProfile = () => {
        dispatch(updateChatDialogShwProfile(true))
        dispatch(updateChatDialogProfileUserId(user.memberUser.id))
        handleClose()
    }
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
                        {user.memberUser.isLogged ? 
                            (
                                <Badge
                                    variant='dot'
                                    anchorOrigin={{ vertical:"bottom", horizontal:"right"}}
                                    // overlap='cirular'
                                >
                                    {/* <Avatar alt={member.user.userName} src={member.user.img} /> */}
                                    <Avatar alt="image" src={user.memberUser.avatar} />
                                </Badge>
                             )
                             : (<Avatar alt={user.memberUser.userNameLoc} src={user.memberUser.avatar} />)
                            //  : (<Avatar alt={member.user.userName} src={member.user.img} />)
                        }
                        <Stack direction={"row"} alignItems={"center"} spacing={2}>
                            <Typography variant="subtitle2"> { user.memberUser.userName }</Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Typography variant="subtitle2"> 
                        { user.memberJoin.rank } | { user.memberJoin.rights}
                    </Typography>
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
            <MenuItem onClick={onShwProfile}>View profile</MenuItem>
            <MenuItem onClick={handleClose}>Play game</MenuItem>
            { loggedUser.rank != enChatMemberRank.MEMBER &&
              user.memberJoin.rank != enChatMemberRank.OWNER &&  <Divider/> }

            { loggedUser.rank != enChatMemberRank.MEMBER && 
              user.memberJoin.rank != enChatMemberRank.OWNER &&  
              user.memberJoin.rights != enChatMemberRights.BANNED && <MenuItem onClick={handleClose}>Mute</MenuItem> }

            { loggedUser.rank != enChatMemberRank.MEMBER && 
              user.memberJoin.rank != enChatMemberRank.OWNER && 
              user.memberJoin.rights != enChatMemberRights.PRIVILEDGED && <MenuItem onClick={handleClose}>Unmute</MenuItem> }

            { loggedUser.rank != enChatMemberRank.MEMBER && 
              user.memberJoin.rank != enChatMemberRank.OWNER &&   <MenuItem onClick={handleClose}>Kick</MenuItem> }

            { loggedUser.rank != enChatMemberRank.MEMBER && 
              user.memberJoin.rank != enChatMemberRank.OWNER &&   
              user.memberJoin.rank == enChatMemberRank.ADMIN && <MenuItem onClick={handleClose}>Demote</MenuItem> }

            { loggedUser.rank != enChatMemberRank.MEMBER && 
              user.memberJoin.rank != enChatMemberRank.OWNER && 
              user.memberJoin.rank == enChatMemberRank.MEMBER && <MenuItem onClick={handleClose}>Promote</MenuItem> }
        </Menu>
        </>
    )
}
export function IsUserInGroup (userId: string | undefined, group: Group) : boolean {
    let result = false
    const chatStore = useSelector(selectChatStore)
    const groupMembers = chatStore.chatGroupMembers.filter(
        el => el.channelId == group.channelId )
    
    const memberResult = groupMembers.filter(el => {
        if (el.usrId && userId && parseInt(userId) == el.usrId)
            return el
    })
    result = (memberResult.length == 1)? true : false 
    return result
    
    // const srcFriendList = chatStore.chatUserFriends.find((el) => {
    //     if (el.sender == userId && el.receiver == userData.id) {
    //         return el;
    //     }
    //     if (el.sender == userData.id && el.receiver == userId) {
    //         return el;
    //     }
    // });
    // const srcFriendReqList = chatStore.chatUserFriendRequests.find((el: any) => {
    //     if (el.sender == userId && el.receiver == userData.id) {
    //         return el;
    //     }
    //     if (el.sender == userData.id && el.receiver == userId) {
    //         return el;
    //     }
    // });
    // const result: boolean = (srcFriendList || srcFriendReqList) ? true : false;
    // return result;
}

const ChatGroupInfoComp = (group: Group) => {
    const chatStore = useSelector(selectChatStore)
    const groupOwner = getUserById(chatStore.chatUsers, group.ownerId)

    return (
        <>
            <Stack 
                direction={"row"}
                alignItems={"center"} 
                position={"relative"}
                justifyContent={"space-between"}
                width={"100%"}
            >
                <Stack direction={"row"} spacing={1}>
                    <Stack direction="row" spacing={2} position={"relative"}>
                        <Avatar alt={ group.title } src={ img42 }
                        />
                    </Stack>
                    <Stack spacing={1} alignItems={"start"} >
                        <Typography variant="subtitle2"> 
                        { `Channel Title: ${ group.title } `}
                        </Typography>
                        <Typography variant="caption"> 
                            { `Privacy: ${group.privacy }`} 
                        </Typography>
                        <Typography variant="caption"> 
                            { `Owner: ${groupOwner?.userName}` } 
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}

const ChatGroupDialogInviteEntryComp = (group : Group) => {
    const loggedUserId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const onAccept = () => {
        // API call to backend for update

    }

    const onDecline = () => {
        // API call to backend for update

    }

    return (
        <>
        <Box 
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
                spacing={2}
            >
                {/* general group info */}
                <ChatGroupInfoComp {...group} />

                {/* button */}
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {/* join or request button  */}
                    
                    <Button onClick={onAccept} variant='contained'
                    >Accept
                    </Button>
                    <Button onClick={onDecline} variant='contained'
                    >Decline
                    </Button>
                </Stack>

            </Stack>
        </Box>
        </>

    )
}

const ChatGroupDialogEntryComp = (group : Group) => {
    const btnText = ( group.privacy == enChatPrivacy.PUBLIC) ? "Join" : "Request"
    const loggedUserId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const handleRequest = () => {
        // API call to backend
        // Create joinGroup object for loggedInuser to join group
        // Set status to pending or or accepted depending on channel privacy
        // public - accepted
        // private and protected - pending 
        // Send to backend

    }

    return (
        <>
        <Box 
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
                spacing={2}
            >
                {/* general group info */}
                <ChatGroupInfoComp {...group} />

                {/* button */}
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {/* join or request button  */}
                    
                    <Button onClick={handleRequest} variant='contained'
                        disabled = { IsUserInGroup(loggedUserId, group)} 
                    > {btnText}
                    </Button>
                </Stack>

            </Stack>
        </Box>
        </>

    )
}

const ChatGroupDialogRequestEntryComp = (group : Group) => {
    const loggedUserId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const handleRequest = () => {
        // API call to backend for update
        // Send to backend

    }

    return (
        <>
        <Box 
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
                spacing={2}
            >
                {/* general group info */}
                <ChatGroupInfoComp {...group} />

                {/* button */}
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {/* join or request button  */}
                    
                    <Button onClick={handleRequest} variant='contained' disabled > Pending
                    </Button>
                </Stack>
            </Stack>
        </Box>
        </>
    )
}
export { ChatGroupMemberProfileComp,
    ChatGroupDialogEntryComp,
    ChatGroupDialogInviteEntryComp,
    ChatGroupDialogRequestEntryComp 
}