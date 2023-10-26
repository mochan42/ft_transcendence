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


const ChatUserComp = (userData : User) => {
    const theme = useTheme();
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch();
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';

    const onSendRequest = ()=>{
         // Create a new friend request object
         // Note!!! This object must be populated with data of active user.
        const newOutgoingReq : Friend = {
            sender: typeof userId == 'string' ? userId : null,
            receiver: userData.id,
            relation: PENDING,
            createdAt: new Date().toLocaleDateString()
        }
        // API CALL
        // post the above object (newOutgoingReq) to be added to the friendrequestlist
        // of the receiver. (receiver id has been provided) 
        // Add new friend request to friend request list
        const newFriendRequestList = [...chatStore.chatUserFriendRequests, newOutgoingReq]
        // update the friend request list with new one
        dispatch(updateChatUserFriendRequests(newFriendRequestList));
        if (chatStore.chatSocket != null) {
            alert("COOL SOCKET");
        }
        alert("request_sent");
        // API CALL
        // post the updated friendrequestlist to backend.
        
        // EMIT SOCKET EVENT : FRIEND_REQUEST
        // socket.emit("friend_request ", {data}, ()=> {
        //     alert("request_sent");
        // });
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
        const result: boolean = (srcFriendList) ? true : false;
        return result;
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
                    {userData.isLogged ? 
                        (
                            <Badge
                                variant='dot'
                                anchorOrigin={{ vertical:"bottom", horizontal:"right"}}
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
                        <Typography variant="subtitle2"> { userData.userNameLoc }</Typography>
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

const ChatUserFriendComp = (userData : User) => {
    const theme = useTheme()
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch()
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';

    const onSendMsg = ()=> {
        const user = chatStore.chatUserFriends.filter((el) => {
            if (el.sender == userData.id && el.receiver == userId) {
                return el;
            }
            if (el.receiver == userData.id && el.sender == userId) {
                return el;
            }
        })[0]
        // Create new list which excludes found user
        const newFriendListExc = chatStore.chatUserFriends
            .filter(el => el.sender != user.sender && el.receiver != user.receiver)
        // Add user to the top of the new friend list
        const newFriendListInc = [user, ...newFriendListExc]
        // update the store data for user friend list
        dispatch(updateChatUserFriends(newFriendListInc));
        dispatch(updateChatActiveUser(user));
        // close the dialog
        dispatch(updateStateUserFriendDialog(false)); 

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
                    {userData.isLogged ? 
                        (
                            <Badge
                                variant='dot'
                                anchorOrigin={{ vertical:"bottom", horizontal:"right"}}
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
                        <Typography variant="subtitle2"> { userData.userNameLoc   }</Typography>
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

const ChatUserFriendRequestComp = (reqData : User) => {
    const theme = useTheme()
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch();

    const onAccept = ()=>{
        // fetch user from user list
        const stranger = chatStore.chatUserFriends.filter((el: any) => el.sender === reqData.id)[0]
        // create new list of friend request for user
        const newFriendRequestList = chatStore.chatUserFriendRequests.filter(el => el.sender !== stranger.sender)
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
         const stranger = chatStore.chatUserFriends.filter((el: any) => el.sender === reqData.id)[0]
        const newFriendRequestList = chatStore.chatUserFriendRequests.filter(el => el.sender !== stranger.sender)
        // update the friend request list with new one
        dispatch(updateChatUserFriendRequests(newFriendRequestList));
        // chatStore.chatSocket.emit('deny_friend_request', stranger);
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