import React, { Dispatch, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Stack, Avatar, Typography, Button, Box, Badge } from '@mui/material'
import { Friend, User, Block } from '../types';
import { useSelector, useDispatch } from 'react-redux';
import { selectChatStore } from '../redux/store';
import { toggleSidebar, updateStateUserFriendDialog, updateChatUserFriendRequests, updateChatBlockedUsers } from '../redux/slices/chatSlice';
import { updateChatUserFriends, updateChatActiveUser, selectConversation } from '../redux/slices/chatSlice';
import { ACCEPTED, PENDING } from '../APP_CONSTS';
import { fetchAllUsers, fetchAllFriends, fetchAllUsersFriends } from '../data/ChatData';
import Cookies from 'js-cookie';
import { getSocket } from '../utils/socketService';
import { LOG_STATE, enChatType } from '../enums';
import { IChatState } from '../redux';
import { AnyAction } from 'redux';

const StyledChatBox = styled(Box)(({ theme }) => ({
    "&:hover": {
        cursor: "pointer",
    },

}));

function HandleOnSendMsg(userData: User, chatStore: IChatState, dispatch: Dispatch<AnyAction>) {
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    dispatch(updateChatActiveUser(userData));
    dispatch(updateStateUserFriendDialog(false));
    dispatch(selectConversation({ chatRoomId: userData.id, chatType: enChatType.OneOnOne }))
}

const ChatUserComp = (userData: User) => {
    const theme = useTheme();
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch()
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const socket = getSocket(userId);

    const onSendRequest = () => {

        socket.emit('inviteFriend', userData.id);
    }

    const isUserKnown = () => {
        const srcFriendList = chatStore.chatUserFriends.find((el) => {
            if (el.sender == userId && el.receiver == userData.id) {
                return el;
            }
            if (el.sender == userData.id && el.receiver == userId) {
                return el;
            }
        });
        const srcFriendReqList = chatStore.chatUserFriendRequests.find((el: any) => {
            if (el.sender == userId && el.receiver == userData.id) {
                return el;
            }
            if (el.sender == userData.id && el.receiver == userId) {
                return el;
            }
        });
        const result: boolean = (srcFriendList || srcFriendReqList) ? true : false;
        return result;
    }

    useEffect(() => {

    }, [chatStore.chatUserFriendRequests, chatStore.chatUserFriends, chatStore.chatUserFriendDialogState]);

    return (
        <StyledChatBox sx={{
            width: "100%",
            biorderRadius: 1,
            backgroundColor: theme.palette.background.paper,
            p: 2
        }}
        >

            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent="space-between"
            >
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {" "}
                    {userData.currentState != LOG_STATE.OFFLINE ?
                        (
                            <Badge
                                variant='dot'
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            // overlap='cirular'
                            >
                                {/* <Avatar alt={userData.userName} src={userData.img} /> */}
                                <Avatar alt="image" src={userData.avatar} />
                            </Badge>
                        )
                        : (<Avatar alt={userData.userNameLoc} src={userData.avatar} />)
                        //  : (<Avatar alt={userData.userName} src={userData.img} />)
                    }
                    <Stack>
                        <Typography variant="subtitle2"> {userData.userNameLoc}</Typography>
                    </Stack>
                </Stack>
                {/* button */}
                <Stack direction={"row"} spacing={2}>
                    <Button
                        onClick={() => HandleOnSendMsg(userData, chatStore, dispatch)}
                        sx={{ backgroundColor: "#eee" }}
                    > Send Msg
                    </Button>
                    <Button
                        disabled={isUserKnown()}
                        onClick={() => onSendRequest()}
                        sx={{ backgroundColor: "#eee" }}
                    > Send Request
                    </Button>
                </Stack>

            </Stack>
        </StyledChatBox>
    )
}

const ChatUserFriendComp = (userData: User) => {
    const theme = useTheme()
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch()

    useEffect(() => {

    }, [chatStore.chatUserFriendDialogState, chatStore.chatUserFriends, chatStore.chatUserFriendRequests]);

    return (
        <StyledChatBox sx={{
            width: "100%",
            borderRadius: 1,
            backgroundColor: theme.palette.background.paper,
            p: 2
        }}
        >
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent="space-between"
            >
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {" "}
                    {userData.currentState != LOG_STATE.OFFLINE ?
                        (
                            <Badge
                                variant='dot'
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            // overlap='cirular'
                            >
                                {/* <Avatar alt={userData.userName} src={userData.img} /> */}
                                <Avatar alt="image" src={userData.avatar} />
                            </Badge>
                        )
                        : (<Avatar alt="image" src={userData.avatar} />)
                        //  : (<Avatar alt={userData.userName} src={userData.img} />)
                    }
                    <Stack>
                        <Typography variant="subtitle2"> {userData.userNameLoc}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Button
                        onClick={() => HandleOnSendMsg(userData, chatStore, dispatch)}
                        sx={{ backgroundColor: "#eee" }}
                    > Send Msg
                    </Button>
                </Stack>
            </Stack>
        </StyledChatBox>
    )
}

const ChatUserFriendRequestComp = (reqData: User) => {
    const theme = useTheme()
    const chatStore = useSelector(selectChatStore);
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const socket = getSocket(userId);
    const dispatch = useDispatch()

    const isSender = (reqData: User): boolean => {
        const friend = chatStore.chatUserFriendRequests.find((el: any) => {
            if (reqData.id == el.sender && el.receiver == userId) {
                return el;
            }
        });
        return (friend) ? true : false;
    }

    const onAccept = () => {
        const stranger = chatStore.chatUserFriendRequests.filter((el: any) => {
            if (el.sender == reqData.id && el.receiver == userId) {
                return el;
            }
        })[0];
        socket.emit('acceptFriend', stranger.id);
        socket.once('newFriend', (data: any) => {
            if (data.new.id !== stranger.id) {
                return;
            }
            const newFriendRequestList = fetchAllUsersFriends(PENDING, data.all);
            const newFriendList = fetchAllUsersFriends(ACCEPTED, data.all);
            dispatch(updateChatUserFriendRequests(newFriendRequestList));
            dispatch(updateChatUserFriends(newFriendList));
        });
        dispatch(updateStateUserFriendDialog(false));
    }

    const onDeny = () => {
        const stranger = chatStore.chatUserFriendRequests.filter((el: Friend) => {
            if (el.sender == reqData.id && el.receiver == userId) {
                return el;
            }
        })[0];
        if (stranger != null) {
            socket.emit('denyFriend', stranger.id);
            socket.once('deniedFriend', (data: any) => {
                const newFriendRequestList = fetchAllUsersFriends(PENDING, data.all);
                const newFriendList = fetchAllUsersFriends(ACCEPTED, data.all);
                dispatch(updateChatUserFriendRequests(newFriendRequestList));
                dispatch(updateChatUserFriends(newFriendList));
            });
        }
        dispatch(updateStateUserFriendDialog(false));
    }

    useEffect(() => {

    }, [chatStore.chatUserFriendDialogState, chatStore.chatUserFriendRequests, chatStore.chatUserFriends]);

    return (
        <StyledChatBox sx={{
            width: "100%",
            biorderRadius: 1,
            backgroundColor: theme.palette.background.paper,
            p: 2
        }}
        >
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent="space-between"
            >
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {" "}
                    <Avatar alt={reqData.userNameLoc} src={reqData.avatar} />
                    <Stack>
                        <Typography variant="subtitle2"> {reqData.userNameLoc}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {
                        (isSender(reqData)) &&
                        <Button onClick={() => onAccept()} sx={{ backgroundColor: "#af9" }}
                        > Accept
                        </Button>
                    }
                    {
                        (isSender(reqData)) &&
                        <Button onClick={() => onDeny()} sx={{ backgroundColor: "#fa9" }}
                        > Deny
                        </Button>
                    }
                    {
                        (!isSender(reqData)) &&
                        <Button disabled sx={{ backgroundColor: "#eee" }}
                        > Pending
                        </Button>
                    }
                </Stack>
            </Stack>
        </StyledChatBox>
    )
}

const ChatUserBlockedComp = (userData: User) => {
    const theme = useTheme();
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const socket = getSocket(userId);
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch()

    const HandleUnblock = () => {
        socket.emit('unblockUser', { blocker: userId, blockee: userData.id });
        socket.once('unblockSuccess', (blocks: Block[]) => {
            dispatch(updateChatBlockedUsers(blocks));
        });
        dispatch(updateStateUserFriendDialog(false));
        // API CALL
        // update block list in backend
    }
    useEffect(() => {

    }, [chatStore.chatUserFriendDialogState, chatStore.chatBlockedUsers]);

    return (
        <StyledChatBox sx={{
            width: "100%",
            borderRadius: 1,
            backgroundColor: theme.palette.background.paper,
            p: 2
        }}
        >
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent="space-between"
            >
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {" "}
                    {userData.currentState != LOG_STATE.OFFLINE ?
                        (
                            <Badge
                                variant='dot'
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            // overlap='cirular'
                            >
                                {/* <Avatar alt={userData.userName} src={userData.img} /> */}
                                <Avatar alt="image" src={userData.avatar} />
                            </Badge>
                        )
                        : (<Avatar alt="image" src={userData.avatar} />)
                        //  : (<Avatar alt={userData.userName} src={userData.img} />)
                    }
                    <Stack>
                        <Typography variant="subtitle2"> {userData.userNameLoc}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Button
                        onClick={() => HandleUnblock()}
                        sx={{ backgroundColor: "#eee" }}
                    > Unblock
                    </Button>
                </Stack>
            </Stack>
        </StyledChatBox>
    )
}
export { ChatUserComp, ChatUserFriendComp, ChatUserFriendRequestComp, ChatUserBlockedComp } 