import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Stack, Avatar, Typography, Button, Box, Badge } from '@mui/material'
import { TChatUserData, TUserFriendRequest, User } from '../types';
import { useSelector, useDispatch } from 'react-redux';
import { selectChatStore } from '../redux/store';
import { updateChatUserFriendRequests } from '../redux/slices/chatSlice';
import { updateChatUserFriends } from '../redux/slices/chatSlice';
import { enReqType } from '../enums';



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


        const newReq = chatStore.allUsers[0];
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
        const srcFriendList = chatStore.chatUserFriends.filter(el=> +el.id === usrData.id)
        const srcFriendReqSentList = chatStore.chatUserFriendRequests.filter(el=> +el.id === usrData.id)

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

const ChatUserFriendComp = (usrData : User) => {
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
                    {usrData.isLogged ? 
                        (
                            <Badge
                                variant='dot'
                                anchorOrigin={{ vertical:"bottom", horizontal:"right"}}
                                // overlap='cirular'
                            >
                                {/* <Avatar alt={usrData.userName} src={usrData.img} /> */}
                                <Avatar alt="image" src={usrData.avatar} />
                            </Badge>
                         )
                         : (<Avatar alt={usrData.userNameLoc} src={usrData.avatar} />)
                        //  : (<Avatar alt={usrData.userName} src={usrData.img} />)
                    }
                    <Stack>
                        <Typography variant="subtitle2"> { usrData.userNameLoc   }</Typography>
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

const ChatUserFriendRequestComp = (reqData : User) => {
    const theme = useTheme()
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch();

    const onAccept = ()=>{
        // fetch user from user list
        const stranger = chatStore.allUsers.filter(el => el.id === reqData.id)[0]
        // create new list of friend request for user
        const newFriendRequestList = chatStore.chatUserFriendRequests.filter(el => el.id !== stranger.id)
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
        const stranger = chatStore.allUsers.find(el => el.id === reqData.id);
        // create new list of friend request for user
        const newFriendRequestList = chatStore.chatUserFriendRequests.filter((el) => {
            if (stranger) {
                return el.id !== stranger.id;
            }
        });
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
                    <Avatar alt={reqData.userNameLoc} src={reqData.avatar} />
                    <Stack>
                        <Typography variant="subtitle2"> { reqData.userNameLoc }</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {
                        (+reqData.id !== 1) &&
                        <Button onClick={() => onAccept()} sx={{backgroundColor: "#af9"}}
                        > Accept
                        </Button>
                    }
                    {
                        (+reqData.id != 1) &&
                        <Button onClick={() => onDeny()} sx={{backgroundColor: "#fa9"}}
                        > Deny
                        </Button>
                    }
                    {
                        (+reqData.id === 2 ) &&
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