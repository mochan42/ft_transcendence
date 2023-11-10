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
import ChatDialogShwProfile from "./ChatDialogShwProfile";
import ChatUserShwProfile from "./ChatUserShwProfile";
import { ChatGameRequestList, GameDifficultyTxt, dummyUsers } from "../data/ChatData";

const GetUserById = (userId: string | number ): User | null => {
    const chatStore = useSelector(selectChatStore);
    // const users = dummyUsers.filter( (el) => {     // for development only
    const users = chatStore.chatUsers.filter( (el) => {  // uncomment for production
        if (el.id == userId.toString())
            return el
    })
    if (users.length)
    { 
        return (users[0])
    }
    return null
}


const ChatGameRequestElement = (request: GameType) => {
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    // console.log("Show userId - game request - ", userId)
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch();
    let activeUser = {} as User | null
    // console.log("request data - ", request)
    activeUser = GetUserById(request.player1);
    // console.log("active_user - ", activeUser)

    return (
        <Box 
            onClick={ () => {
                dispatch(updateChatGameRequest(request))
                //console.log("one click ------ away ")
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
                </Stack>
                <Stack spacing={2} alignItems={"center"}>
                    <Typography variant="caption">
                        { GameDifficultyTxt[request.difficulty] }
                    </Typography>
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
    const chatStore = useSelector(selectChatStore)

    //console.log("game request", chatStore.chatGameRequest)
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
                            {
                            chatStore.chatGameRequests // uncomment for production
                            //  ChatGameRequestList            // comment for development
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
                                .map((incomingRequest) => {
                                    return (<ChatGameRequestElement {...incomingRequest}
                                            key={incomingRequest.id} 
                                            />)
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
                    chatStore.chatGameRequest &&
                     <ChatUserShwProfile userId={chatStore.chatGameRequest.player1} />
                }
                {
                    !chatStore.chatGameRequest &&
                     (<Typography variant="subtitle2">Select game request to view challenger 
                      </Typography>)
                }
            </Stack>
        </Stack>
    </>
      );
}
 

export default ChatPageGameRequests  ;