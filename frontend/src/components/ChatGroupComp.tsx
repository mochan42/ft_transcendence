import React, { useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Stack, Avatar, Typography, Button, Box, Badge, Divider } from '@mui/material'
import { Friend, Group, JoinGroup, TGroupRequestArgs, User } from '../types';
import { useSelector, useDispatch } from 'react-redux';
import { selectChatDialogStore, selectChatStore } from '../redux/store';
import Cookies from 'js-cookie';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { LOG_STATE, enChatGroupInviteStatus, enChatMemberRank, enChatMemberRights, enChatPrivacy } from '../enums';
import { updateChatDialogProfileUserId, updateChatDialogShwProfile, updateChatDialogGroupInvite } from '../redux/slices/chatDialogSlice';
import img42 from "../img/icon_42.png"
import { getUserById } from './ChatConversation';
import { getSocket } from '../utils/socketService';
import { updateChatGroupMembers, updateChatAllJoinReq, updateNewGrpId } from '../redux/slices/chatSlice';
import { ChatGroupMemberList, getMembers } from "../data/ChatData";


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
    const dispatch = useDispatch();
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const groupMembers = chatStore.chatActiveGroup ? getMembers(chatStore.chatGroupMembers, chatStore.chatActiveGroup.channelId) : [];
    const groupMemberNo = (chatStore.chatActiveGroup ? groupMembers.length : 0)
    const loggedUser = groupMembers.filter((el: JoinGroup) => el && el.userId.toString() == userId)[0];
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

    const handleMute = (rights: string) => {
        if (user && user.memberJoin) {
            const joinGroup = { ...user.memberJoin, rights: rights }
            socket.emit('memberMuteToggle', joinGroup);
            handleClose();
        }
    }

    const handlePromote = (rank: string) => {
        if (user && user.memberJoin) {
            const joinGroup = { ...user.memberJoin, rank: rank }
            socket.emit('memberPromoteToggle', joinGroup);
            handleClose();
        }
    }

    const handleKick = () => {
        if (user && user.memberJoin) {
            socket.emit('kickMember', user.memberJoin);
            handleClose();
        }
    }

    useEffect(() => {

    }, [chatStore.chatGroupMembers,
    chatStore.chatAllJoinReq,
    chatStore.chatSideBar.open])


    return (
        <>
            <StyledChatBox sx={{
                width: "100%",
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
                            {user.memberUser.currentState != LOG_STATE.OFFLINE ?
                                (
                                    <Badge
                                        variant='dot'
                                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
                                <Typography variant="subtitle2"> {user.memberUser.userNameLoc}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        <Typography variant="subtitle2">
                            {user.memberJoin.rank} | {user.memberJoin.rights}
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
                {/* {loggedUser.userId != +user.memberUser.id && <MenuItem onClick={handleClose}>Play game</MenuItem>} */}
                {loggedUser && loggedUser.rank != enChatMemberRank.MEMBER &&
                    <Divider />}

                {/* {loggedUser.rank == enChatMemberRank.ADMIN && <Divider />} */}

                {loggedUser && loggedUser.rank != enChatMemberRank.MEMBER &&
                    user.memberJoin.rank != enChatMemberRank.OWNER &&
                    user.memberJoin.rights != enChatMemberRights.BANNED &&
                    loggedUser.userId != +user.memberUser.id &&
                    <MenuItem onClick={() => handleMute(enChatMemberRights.BANNED)}>Mute</MenuItem>}

                {loggedUser && loggedUser.rank != enChatMemberRank.MEMBER &&
                    user.memberJoin.rank != enChatMemberRank.OWNER && user.memberJoin.rights == enChatMemberRights.BANNED &&
                    <MenuItem onClick={() => handleMute(enChatMemberRights.PRIVILEDGED)}>Unmute</MenuItem>}

                {loggedUser && loggedUser.rank != enChatMemberRank.MEMBER &&
                    user.memberJoin.rank != enChatMemberRank.OWNER && loggedUser.userId != +user.memberUser.id && <MenuItem onClick={handleKick}>Kick</MenuItem>}

                {loggedUser && loggedUser.rank != enChatMemberRank.MEMBER &&
                    user.memberJoin.rank != enChatMemberRank.OWNER &&
                    user.memberJoin.rank == enChatMemberRank.ADMIN && loggedUser.userId != +user.memberUser.id && <MenuItem onClick={() => handlePromote(enChatMemberRank.MEMBER)}>Demote</MenuItem>}

                {loggedUser && loggedUser.rank != enChatMemberRank.MEMBER &&
                    user.memberJoin.rank != enChatMemberRank.OWNER &&
                    user.memberJoin.rank == enChatMemberRank.MEMBER && loggedUser.userId != +user.memberUser.id && <MenuItem onClick={() => handlePromote(enChatMemberRank.ADMIN)}>Promote</MenuItem>}
            </Menu>
        </>
    )
}
export function IsUserInGroup(userId: string | undefined, group: Group | null): boolean {
    const chatStore = useSelector(selectChatStore)
    if (!group) {
        return false;
    }
    let result = false
    const groupMembers = chatStore.chatAllJoinReq.filter(
        el => el.channelId == group.channelId)

    const memberResult = groupMembers.filter(el => {
        if (el.userId && userId && +userId == el.userId)
            return el
    })
    result = (memberResult.length == 1) ? true : false
    return result
}

const loggedUserId = Cookies.get('userId') ? Cookies.get('userId') : '';
const socket = getSocket(loggedUserId);

const ChatGroupInfoComp = (group: Group) => {
    const chatStore = useSelector(selectChatStore)
    const groupOwner = getUserById(chatStore.chatUsers, group.ownerId)

    useEffect(() => {

    }, [chatStore.chatGroupMembers, chatStore.chatAllJoinReq])

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
                        <Avatar alt={group.title} src={img42}
                        />
                    </Stack>
                    <Stack spacing={1} alignItems={"start"} >
                        <Typography variant="subtitle2">
                            {`Channel Title: ${group.title} `}
                        </Typography>
                        <Typography variant="caption">
                            {`Privacy: ${group.privacy}`}
                        </Typography>
                        <Typography variant="caption">
                            {`Owner: ${groupOwner?.userNameLoc}`}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}

const ChatGroupDialogInviteEntryComp = (group: Group) => {
    const chatStore = useSelector(selectChatStore)

    const onAccept = () => {
        const joinGroup = chatStore.chatGroupMembers.find((el: JoinGroup) =>
            el && el.userId
            && el.userId.toString() == loggedUserId
            && el.channelId == group.channelId)
        if (joinGroup) {
            socket.emit('acceptJoinGroup', joinGroup);
        }
    }

    const onDecline = () => {
        const joinGroup = chatStore.chatGroupMembers.find((el: JoinGroup) =>
            el && el.userId
            && el.userId.toString() == loggedUserId
            && el.channelId == group.channelId);
        if (joinGroup) {
            socket.emit('declineJoinGroup', joinGroup);
        }
    }

    useEffect(() => {

    }, [chatStore.chatGroupList,
    chatStore.chatGroupMembers,
    chatStore.chatGroupDialogState
    ]);

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

const ChatGroupDialogEntryComp = (group: Group) => {
    const btnText = (group.privacy == enChatPrivacy.PUBLIC) ? "Join" : "Request"
    const loggedUserId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const socket = getSocket(loggedUserId);

    const handleRequest = () => {
        if (loggedUserId) {
            const joinGroup = {
                userId: +loggedUserId,
                channelId: group.channelId,
                rank: enChatMemberRank.MEMBER,
                rights: enChatMemberRights.PRIVILEDGED,
                status: (btnText == "Join") ? enChatGroupInviteStatus.ACCEPTED : enChatGroupInviteStatus.PENDING
            };
            socket.emit('joinChannel', joinGroup);
        }

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
                            disabled={IsUserInGroup(loggedUserId, group)}
                        > {btnText}
                        </Button>
                    </Stack>

                </Stack>
            </Box>
        </>

    )
}

const ChatGroupDialogRequestEntryComp = (args: TGroupRequestArgs) => {
    const loggedUserId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const group = args.group;
    const joinGroup = args.joinGroup;
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch();

    const acceptRequest = (joinGroup: JoinGroup) => {
        if (joinGroup) {
            const newJoinGroup = { ...joinGroup, status: enChatGroupInviteStatus.ACCEPTED }
            socket.emit('acceptJoinGroup', newJoinGroup);
            socket.once('acceptMemberSuccess', (data: any) => {
                dispatch(updateChatGroupMembers(data.all));
                dispatch(updateChatAllJoinReq(data.all));
                if (loggedUserId && data.new.userId == loggedUserId) {
                    dispatch(updateNewGrpId(data.new.channelId));
                }
            });
        }
        dispatch(updateChatDialogGroupInvite(false));
    }

    const denyRequest = (joinGroup: JoinGroup) => {
        if (joinGroup) {
            socket.emit('declineJoinGroup', joinGroup);
            socket.once('declinedMemberSuccess', (data: any) => {
                dispatch(updateChatGroupMembers(data.all));
                dispatch(updateChatAllJoinReq(data.all));
            });
        }
        dispatch(updateChatDialogGroupInvite(false));
    }

    useEffect(() => {

    }, [chatStore.chatGroupList,
    chatStore.chatGroupMembers,
    chatStore.chatAllJoinReq,
    ]);

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
                    <Typography variant="caption">
                        {`User: ${getUserById(chatStore.chatUsers, joinGroup.userId)?.userNameLoc}`}
                    </Typography>
                    {/* button */}
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        {/* join or request button  */}


                        {
                            (joinGroup.status === enChatGroupInviteStatus.INVITE) &&
                            <Button disabled sx={{ backgroundColor: "#eee" }}
                            > Pending
                            </Button>
                        }
                        {
                            (joinGroup.status === enChatGroupInviteStatus.PENDING && joinGroup.userId.toString() == loggedUserId) &&
                            <Button disabled sx={{ backgroundColor: "#eee" }}
                            > Pending
                            </Button>
                        }
                        {
                            (joinGroup.status === enChatGroupInviteStatus.PENDING && joinGroup.userId.toString() != loggedUserId) &&
                            <Button onClick={() => { acceptRequest(joinGroup) }} sx={{ backgroundColor: "#af9" }}
                            > Accept
                            </Button>
                        }
                        {
                            (joinGroup.status === enChatGroupInviteStatus.PENDING && joinGroup.userId.toString() != loggedUserId) &&
                            <Button onClick={() => { denyRequest(joinGroup) }} sx={{ backgroundColor: "#fa9" }}
                            > Deny
                            </Button>
                        }
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}
export {
    ChatGroupMemberProfileComp,
    ChatGroupDialogEntryComp,
    ChatGroupDialogInviteEntryComp,
    ChatGroupDialogRequestEntryComp
}