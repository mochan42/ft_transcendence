import { useState, useEffect } from "react";
import { Box, Stack, IconButton, Typography, Divider, Avatar, Button } from "@mui/material";
import { CircleDashed, Handshake } from "phosphor-react";
import { ChatProps, User, GameType } from "../types";
import { useSelector } from "react-redux";
import { selectChatStore } from "../redux/store";
import ChatUserProfile from "./ChatUserProfile";
import { useDispatch } from "react-redux";
import { updateStateUserFriendDialog, updateChatGameRequest } from "../redux/slices/chatSlice";
import Cookies from 'js-cookie';
import { faker } from "@faker-js/faker";

const GetUserById = (userId: string | number ): User => {
    const chatStore = useSelector(selectChatStore);
    const users = chatStore.chatUsers.filter( (el) => el.id == userId.toString())
    if (users.length)
    {
        return (users[0])
    }
    return users[0]
}

const ChatGameRequestElement = (request: GameType) => {
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    console.log("Show userId", userId)
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch();
    let activeUser = {} as User
    activeUser = GetUserById(request.player1);

    return (
        <Box 
            onClick={ () => {
                dispatch(updateChatGameRequest(request))
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
                    <Avatar 
                        alt={ activeUser? activeUser.userName : faker.person.firstName()  } 
                        src={ activeUser? activeUser.avatar : faker.image.avatar() }
                    />
                </Stack>
                <Stack spacing={0.2} alignItems={"center"}>
                    <Typography variant="subtitle2">
                        { activeUser? activeUser.userName : faker.person.firstName()}
                    </Typography>
                    {/* <Typography variant="caption">{  } </Typography> */}
                </Stack>
                <Stack spacing={2} alignItems={"center"}>
                    <Typography variant="caption">{ request.difficulty }</Typography>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {/* accept button  */}
                    <Button onClick={() => {}} sx={{backgroundColor: "#af9"}}
                    > Accept
                    </Button>
                    {/* deny button */}
                    <Button onClick={() => {}} sx={{backgroundColor: "#fa9"}}
                    > Deny
                    </Button>
                </Stack>

            </Stack>
        </Box>
    ); 
}

const  ChatPageGameRequests = (chatProp : ChatProps) => {
    // const [dialogState, setDialogState] = useState<boolean>(false);
    const chatStore = useSelector(selectChatStore)
    const dispatch = useDispatch()
    const handleOpenDialog = ()=>{
        dispatch(updateStateUserFriendDialog(true));

        // setDialogState(true)
    }
    chatStore.chatGameRequests 
    ? dispatch(updateChatGameRequest(chatStore.chatGameRequests[0]))
    : dispatch(updateChatGameRequest(null))
    return (
    <>
        <Stack direction={"row"} sx={{ width: "95vw"}}>
        <Box 
          sx={{
            position:"relative",
            height: "100%",
            minWidth: "450px",
            backgroundColor: "white",
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"
          }}>
                <Stack p={3} spacing={1} sx={{height:"75vh"}} >

                    {/* game request list */}
                    <Stack 
                        direction={"row"} 
                        alignItems={"centered"} 
                        justifyContent={"space-between"}
                    >
                        <Typography variant='h5'>Game Challenge Requests</Typography>
                    </Stack>
                    <Divider/>
                    <Stack 
                        sx={{flexGrow:1, overflowY:"scroll", height:"100%"}}
                        spacing={0.5} 
                    >
                            {chatStore.chatGameRequests
                                .filter((request) => {
                                    if (request.player1.toString() == chatProp.userId || 
                                        request.player2.toString() == chatProp.userId) {
                                        return request;
                                    }
                                })
                                .filter((reqplayer1) => {
                                    if (reqplayer1.player1.toString() != chatProp.userId ) {
                                        return reqplayer1;
                                    }
                                })
                                // .map((incomingRequest) => getUserById(incomingRequest.player1))
                                .map((incomingRequest) => {
                                    return (<ChatGameRequestElement {...incomingRequest} key={incomingRequest.id} />)
                                })}
                    </Stack>
                </Stack>
        </Box>

                {/* challenger profile panel */}
                <Stack 
                    sx={{ width: "100%" }}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    {
                        chatStore.chatGameRequest
                        ? <ChatUserProfile userId={chatStore.chatGameRequest.player1} />
                        : <Typography
                            variant="subtitle2"
                          >Select game request to view challenger 
                          </Typography>
                    }
                </Stack>
        </Stack>
    </>
      );
}
 

export default ChatPageGameRequests  ;