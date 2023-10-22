import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Stack, Avatar, Typography, Button, Box, Badge } from '@mui/material'
import { TChatUserData, TUserFriendRequest } from '../types';
import { useSelector, useDispatch } from 'react-redux';
import { selectChatStore } from '../redux/store';
import { updateChatUserFriendRequests } from '../redux/slices/chatSlice';
import { updateChatUserFriends } from '../redux/slices/chatSlice';



const StyledChatBox = styled(Box)(({ theme }) => ({
    "&:hover": {
        cursor: "pointer",
    },

}));


const ChatUserComp = (usrData : TChatUserData) => {
    const theme = useTheme()
    const chatStore = useSelector(selectChatStore)

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
                justifyContent="space-between"
            >
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {" "}
                    {usrData.online ? 
                        (
                            <Badge
                                variant='dot'
                                anchorOrigin={{ vertical:"bottom", horizontal:"right"}}
                                // overlap='cirular'
                            >
                                {/* <Avatar alt={usrData.userName} src={usrData.img} /> */}
                                <Avatar alt="image" src={usrData.img} />
                            </Badge>
                         )
                         : (<Avatar alt={usrData.name} src={usrData.img} />)
                        //  : (<Avatar alt={usrData.userName} src={usrData.img} />)
                    }
                    <Stack>
                        <Typography variant="subtitle2"> { usrData.name }</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Button 
                        onClick={() => {
                            alert("request_sent");
                            const newReq : TUserFriendRequest= {
                                receiverId: null,
                                senderId: chatStore.chatUsers[0].id,
                                senderImg: chatStore.chatUsers[0].img,
                                senderUsername: chatStore.chatUsers[0].name,
                            }
                            // EMIT SOCKET EVENT : FRIEND_REQUEST
                            // socket.emit("friend_request ", {data}, ()=> {
                            //     alert("request_sent");
                            // });
                        }}
                        sx={{backgroundColor: "#eee"}}
                    > Send Request
                    </Button>
                </Stack>

            </Stack>
        </StyledChatBox>
    )
}

const ChatUserFriendComp = (usrData : TChatUserData) => {
    const theme = useTheme()
    return (
        <StyledChatBox sx={{
            width : "100%",
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
                    {usrData.online ? 
                        (
                            <Badge
                                variant='dot'
                                anchorOrigin={{ vertical:"bottom", horizontal:"right"}}
                                // overlap='cirular'
                            >
                                {/* <Avatar alt={usrData.userName} src={usrData.img} /> */}
                                <Avatar alt="image" src={usrData.img} />
                            </Badge>
                         )
                         : (<Avatar alt={usrData.name} src={usrData.img} />)
                        //  : (<Avatar alt={usrData.userName} src={usrData.img} />)
                    }
                    <Stack>
                        <Typography variant="subtitle2"> { usrData.name }</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Button 
                        onClick={() => {
                            alert("message_sent");
                            // EMIT SOCKET EVENT : FRIEND_REQUEST
                            // socket.emit("friend_request ", {data}, ()=> {
                            //     alert("request_sent");
                            // });
                        }}
                        sx={{backgroundColor: "#eee"}}
                    > Send Msg
                    </Button>
                </Stack>

            </Stack>
        </StyledChatBox>
    )
}

const ChatUserFriendRequestComp = (reqData : TUserFriendRequest) => {
    const theme = useTheme()
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch();

    const onAccept = ()=>{
        // fetch user from user list
        const stranger = chatStore.chatUsers.filter(el => el.id===reqData.senderId)[0]
        // create new list of friend request for user
        const newFriendRequestList = chatStore.chatUserFriendRequests.filter(el => el.senderId !== stranger.id)
        // create new friend list for user
        const newFriendList = [...chatStore.chatUserFriends, stranger]
        // update the friend request list with new one
        dispatch(updateChatUserFriendRequests(newFriendRequestList));
        // update the friend list with new one.
        dispatch(updateChatUserFriends(newFriendList));
        // API CALLS
        // - Update user friend list in backend
        // - Update user friend request list in backend.

    }
    const onDeny = ()=>{
        // fetch user from user list
        const stranger = chatStore.chatUsers.filter(el => el.id===reqData.senderId)[0]
        // create new list of friend request for user
        const newFriendRequestList = chatStore.chatUserFriendRequests.filter(el => el.senderId !== stranger.id)
        // update the friend request list with new one
        dispatch(updateChatUserFriendRequests(newFriendRequestList));
        // API CALLS
        // - Update user friend request list in backend.

    }
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
                justifyContent="space-between"
            >
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {" "}
                    <Avatar alt={reqData.senderUsername} src={reqData.senderImg} />
                    <Stack>
                        <Typography variant="subtitle2"> { reqData.senderUsername }</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Button 
                        onClick={() => {
                            onAccept();
                            // API CALL
                            // add user to user friend list in backend
                            // EMIT SOCKET EVENT : ADD_FRIEND
                            // socket.emit("friend_request ", {data}, ()=> {
                            //     alert("request_sent");
                            // });
                        }}
                        sx={{backgroundColor: "#af9"}}
                        
                    > Accept
                    </Button>
                    <Button 
                        onClick={() => {
                            onDeny()

                            // API CALL
                            // update user friend request list in backend
                            // EMIT SOCKET EVENT : DENY_FRIEND
                            // socket.emit("friend_request ", {data}, ()=> {
                            //     alert("request_sent");
                            // });
                        }}
                        sx={{backgroundColor: "#fa9"}}
                    > Deny
                    </Button>
                </Stack>

            </Stack>
        </StyledChatBox>
    )
}

export { ChatUserComp, ChatUserFriendComp, ChatUserFriendRequestComp } 