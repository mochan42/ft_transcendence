import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Stack, Avatar, Typography, Button, Box, Badge } from '@mui/material'
import { TChatUserData, TUserFriendRequest } from '../types';
import { useSelector, useDispatch } from 'react-redux';
import { selectChatStore } from '../redux/store';
import { updateChatUserFriendRequests } from '../redux/slices/chatSlice';
import { updateChatUserFriends, updateChatActiveUser } from '../redux/slices/chatSlice';



const StyledChatBox = styled(Box)(({ theme }) => ({
    "&:hover": {
        cursor: "pointer",
    },

}));


const ChatUserComp = (usrData : TChatUserData) => {
    const theme = useTheme()
    const chatStore = useSelector(selectChatStore)
    const dispatch = useDispatch()

    const onSendRequest = ()=>{
         // Create a new friend request object
         // Note!!! This object must be populated with data of active user.
        const newOutgoingReq : TUserFriendRequest= {
            userId: chatStore.chatUsers[0].id,
            userImg: chatStore.chatUsers[0].img,
            userName: chatStore.chatUsers[0].name,
            reqType: "incoming",
        }
        // API CALL
        // post the above object (newOutgoingReq) to be added to the friendrequestlist
        // of the receiver. (receiver id has been provided) 


        const newReq : TUserFriendRequest= {
            userId: usrData.id,
            userImg: usrData.img,
            userName: usrData.name,
            reqType: "outgoing",
        }
        // Add new friend request to friend request list
        const newFriendRequestList = [...chatStore.chatUserFriendRequests, newReq]
        // update the friend request list with new one
        dispatch(updateChatUserFriendRequests(newFriendRequestList));
        alert("request_sent");
        // API CALL
        // post the updated friendrequestlist to backend.
        
        // EMIT SOCKET EVENT : FRIEND_REQUEST
        // socket.emit("friend_request ", {data}, ()=> {
        //     alert("request_sent");
        // });
    }
    const isUserKnown = () => {
        const srcFriendList = chatStore.chatUserFriends.filter(el=> el.id === usrData.id)
        const srcFriendReqSentList = chatStore.chatUserFriendRequests.filter(el=> el.userId === usrData.id)

        const result : boolean = (srcFriendList.length || srcFriendReqSentList.length) ? true : false
        return result
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
                        disabled={isUserKnown()}
                        onClick={() => onSendRequest()}
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
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch()
    const onSendMsg = ()=> {
        alert("message_sent");
        const user = chatStore.chatUserFriends.filter(el => el.id === usrData.id)[0]
        // Create new list which excludes found user
        const newFriendListExc = chatStore.chatUserFriends.filter(el=> el.id !== user.id)
        // Add user to the top of the new friend list
        const newFriendListInc = [user, ...newFriendListExc]
        // update the store data for user friend list
        dispatch(updateChatUserFriends(newFriendListInc));
        dispatch(updateChatActiveUser(user));

        // API CALL - update to backend may be ignore
        // because we only change user position to top positon on list
        // the content of the list remains same.
    }
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
                        onClick={() => onSendMsg()}
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
        const stranger = chatStore.chatUsers.filter(el => el.id===reqData.userId)[0]
        // create new list of friend request for user
        const newFriendRequestList = chatStore.chatUserFriendRequests.filter(el => el.userId !== stranger.id)
        // create new friend list for user
        const newFriendList = [...chatStore.chatUserFriends, stranger]
        // update the friend request list with new one
        dispatch(updateChatUserFriendRequests(newFriendRequestList));
        // update the friend list with new one.
        dispatch(updateChatUserFriends(newFriendList));
        // API CALLS
        // - Update active user friend list in backend
        // - Update receiver user friend list in backend
        // - Update user friend request list in backend.
        // - Update receiver user friend request list in backend - remove from request list.
        // API CALL
                            // add user to user friend list in backend
                            // EMIT SOCKET EVENT : ADD_FRIEND
                            // socket.emit("friend_request ", {data}, ()=> {
                            //     alert("request_sent");
                            // });

    }
    const onDeny = ()=>{
        // fetch user from user list
        const stranger = chatStore.chatUsers.filter(el => el.id===reqData.userId)[0]
        // create new list of friend request for user
        const newFriendRequestList = chatStore.chatUserFriendRequests.filter(el => el.userId !== stranger.id)
        // update the friend request list with new one
        dispatch(updateChatUserFriendRequests(newFriendRequestList));
        // API CALLS
        // - Update user friend request list in backend.
        // - Update receiver user friend request list in backend - remove from request list.
                            // API CALL
                            // update user friend request list in backend
                            // EMIT SOCKET EVENT : DENY_FRIEND
                            // socket.emit("friend_request ", {data}, ()=> {
                            //     alert("request_sent");
                            // });
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
                    <Avatar alt={reqData.userName} src={reqData.userImg} />
                    <Stack>
                        <Typography variant="subtitle2"> { reqData.userName }</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {
                        (reqData.reqType === "incoming") &&
                        <Button onClick={() => onAccept()} sx={{backgroundColor: "#af9"}}
                        > Accept
                        </Button>
                    }
                    {
                        (reqData.reqType === "incoming") &&
                        <Button onClick={() => onDeny()} sx={{backgroundColor: "#fa9"}}
                        > Deny
                        </Button>
                    }
                    {
                        (reqData.reqType === "outgoing") &&
                        <Button disabled sx={{backgroundColor: "#eee"}}
                        > Pending
                        </Button>
                    }
                </Stack>
            </Stack>
        </StyledChatBox>
    )
}

export { ChatUserComp, ChatUserFriendComp, ChatUserFriendRequestComp } 