import { useState, useEffect } from "react";
import { ChatUserList, friendToUserType } from '../data/ChatData';
import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge } from "@mui/material";
import { CircleDashed, Handshake } from "phosphor-react";
import ChatConversation from "./ChatConversation";
import { ChatProps, User, Chat } from "../types";
import ChatFriends from "./ChatFriends";
import { useSelector } from "react-redux";
import { selectChatStore } from "../redux/store";
import ChatUserProfile from "./ChatUserProfile";
import { useDispatch } from "react-redux";
import { selectConversation, updateChatActiveUser, updateStateUserFriendDialog } from "../redux/slices/chatSlice";
import { LOG_STATE, enChatType } from "../enums";
import Cookies from 'js-cookie';
import { fr } from "@faker-js/faker";
import axios from 'axios';
import { GROUP, PRIVATE } from '../APP_CONSTS';

export const fetchAllDirectMessages = (allMessages: Chat[], userId: any, friend: any): Chat[] => {
    const chats = allMessages.filter((el) => {
        if (el.type == PRIVATE) {
            if (el.author == userId && el.receiver == friend) {
                return el;
            }
            if (el.receiver == userId && el.author == friend) {
                return el;
            }
        }
    });
    return chats;
}

export const fetchAllGroupMessages = (allMessages: Chat[], groupId: number): Chat[] => {
    const chats = allMessages.filter((el) => {
        if (el.type == GROUP && el.receiver == groupId) {
            return el;
        }
    });
    return chats;
}

const ChatElement = (user: User) => {
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch();

    useEffect(() => {

    }, [chatStore.chatUserMessages, chatStore.chatUsers]);

    return (
        <Box
            onClick={() => {
                dispatch(selectConversation({ chatRoomId: user.id, chatType: enChatType.OneOnOne }))
                dispatch(updateChatActiveUser(user));
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
                    {user.currentState == LOG_STATE.ONLINE &&
                        <Badge
                            color="success"
                            variant="dot"
                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                            overlap="circular"
                        >
                            <Avatar src={user.avatar} />
                        </Badge>
                    }
                    {(user.currentState == LOG_STATE.OFFLINE) &&
                        <Badge
                            color="primary"
                            variant="dot"
                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                            overlap="circular"
                        >
                            <Avatar src={user.avatar} />
                        </Badge>}
                    {user.currentState == LOG_STATE.INGAME &&
                        <Badge
                            color="error"
                            variant="dot"
                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                            overlap="circular"
                        >
                            <Avatar src={user.avatar} />
                        </Badge>
                    }
                    <Stack spacing={0.2}>
                        <Typography variant="subtitle2">{user.userNameLoc}</Typography>
                        {/* <Typography variant="caption">{  } </Typography> */}
                    </Stack>
                </Stack>
                <Stack spacing={2} alignItems={"center"}>
                    {/* <Typography variant="caption">{ 'TIME' }</Typography> */}
                    {/* <Badge color="primary" badgeContent={ 'UNREAD' }></Badge> */}
                </Stack>

            </Stack>
        </Box>
    );
}

const ChatPageUsers = (chatProp: ChatProps) => {
    const chatStore = useSelector(selectChatStore)
    const dispatch = useDispatch()
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const handleOpenDialog = () => {
        dispatch(updateStateUserFriendDialog(true));
    }
    // const handleCloseDialog = ()=>{
    //     dispatch(updateStateUserFriendDialog(false)); 
    //     // setDialogState(false)
    // }
    useEffect(() => {

    }, [chatStore.chatUserMessages, chatStore.chatUsers, chatStore.chatUserFriends]);

    return (
        <>
            <Stack direction={"row"} sx={{ width: "95vw" }}>
                <Box
                    sx={{
                        position: "relative",
                        height: "100%",
                        minWidth: "350px",
                        backgroundColor: "white",
                        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"
                    }}>
                    <Stack p={3} spacing={1} sx={{ height: "75vh" }} >

                        {/* Chatuserlist */}
                        <Stack
                            direction={"row"}
                            alignItems={"centered"}
                            justifyContent={"space-between"}
                        >
                            <Typography variant='h5'>Chats</Typography>
                            <Stack direction={"row"} alignItems={"centered"} spacing={1}>
                                <IconButton onClick={() => { handleOpenDialog() }}>
                                    <Handshake />
                                </IconButton>
                            </Stack>
                        </Stack>
                        <Divider />
                        <Stack
                            sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
                            spacing={0.5}
                        >
                            {
                                chatStore.chatUsers
                                    .filter((user: User) => {
                                        if (user.id !== userId) {
                                            const msgs = chatStore.chatUserMessages.filter((message: Chat) => {
                                                if (message.type == PRIVATE
                                                    && ((message.author.toString() == userId && message.receiver == +user.id)
                                                        || (message.author === +user.id && message.receiver.toString() == userId))) {
                                                    return message;
                                                }
                                            });
                                            if (msgs.length != 0) return user;
                                        }
                                    })
                                    .map((el) => {
                                        return (<ChatElement {...el} key={el.id} />)
                                    })
                            }
                        </Stack>
                    </Stack>
                </Box>

                {/* conversation panel */}
                <Stack sx={{ width: "100%" }} alignItems={"center"} justifyContent={"center"}>
                    {chatStore.chatRoomId !== null && chatStore.chatType === enChatType.OneOnOne
                        ? <ChatConversation userId={chatProp.userId} />
                        : <Typography variant="subtitle2">Select chat or create new</Typography>
                    }
                </Stack>

                {/* show profile for user or group on toggle. it depends on which chat is selected */}
                <Stack>
                    {chatStore.chatSideBar.open && <ChatUserProfile />}
                </Stack>
            </Stack>
            {/* handle friend request dialog panel */}
            {chatStore.chatUserFriendDialogState && <ChatFriends />}
        </>
    );
}


export default ChatPageUsers;