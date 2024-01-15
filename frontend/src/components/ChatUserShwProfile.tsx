import { Avatar, Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Prohibit, GameController, X } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/slices/chatSlice";
import { faker } from "@faker-js/faker"
import { selectChatStore } from "../redux/store";
import { dummyUsers, fetchAllStats, friendToUserType } from "../data/ChatData";
import Cookies from 'js-cookie';
import Game from "./pages/Game";
import { useEffect, useState } from "react";
import { User, UserStats } from "../types";
import { getUserById } from "./ChatConversation";

/* component to show contact profile */
type TUserId = {
    userId: number
}
const ChatUserShwProfile = ( otherUserId : TUserId) => {
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const [userStats, setUserStats] = useState<UserStats | null >(null);
    const theme = useTheme()
    const dispatch = useDispatch();
    const chatStore = useSelector(selectChatStore);
    const [userSelect, setUserSelect] = useState<User | null>(null)

    useEffect(() => {
        if (otherUserId.userId && userId != null) {
            // setUserSelect(getUserById(dummyUsers, otherUserId.userId))       // for development only
            setUserSelect(getUserById(chatStore.chatUsers, otherUserId.userId)) // uncomment for production
            // console.log ("show user in show profile - ", userSelect)
        }
        (async() => {
            const updatedUserStats = await fetchAllStats(otherUserId.userId);
            console.log("Fetching User stats");
            setUserStats(updatedUserStats);
        })();
    });
    // },[chatStore.chatGameRequest]);

    return ( 
        <Box sx={{
                width:"100%", backgroundColor: "white",
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
                height: "100%"
            }}
        >
            <Stack sx={{ height: "100%"}}>
                {/* header */}
                <Box sx={{
                        width:"100%",
                        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
                    }}
                >
                    <Stack sx={{ p:2, height:"100%" }} 
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            spacing={3}
                    >
                        <Typography variant="subtitle2">Profile</Typography>
                    </Stack>
                </Box>

                {/* body */}
                <Stack sx={{ height:"100%", position:"relative", flexGrow:1, overflowY:"scroll", }}
                        p={3} spacing={3}
                >
                    <Stack alignItems={"center"} direction={"row"} spacing={2}>
                        <Avatar 
                            src={ userSelect ? userSelect.avatar : faker.image.avatar()} 
                            alt={ userSelect ? userSelect.userNameLoc : faker.person.firstName()}
                            sx={{ height:80, width:80 }}
                        /> 
                        <Stack spacing={2}
                        >
                            <Typography variant="subtitle2" fontWeight={600}>
                                { userSelect ? userSelect.userName : faker.person.firstName() } 
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={400}>
                                { userSelect ? userSelect.email : faker.internet.email() } 
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={400}>
                                { userSelect ? userSelect.lastSeen : "06:35pm" } 
                            </Typography>
                        </Stack>
                    </Stack>
                    <Divider />
                    {/* a new stack to store all game data about the user */}
                    {/* information : total number of wins, loses*/}
                    <Stack alignItems={"center"} spacing={2}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            { `XP :  ${ userSelect?.xp }  `}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            { `Total Played :  ${(userStats != null) ? userStats.wins + userStats.losses + userStats.draws : 0 } `}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            { `Victories :  ${(userStats != null) ? userStats.wins : 0 }  `}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            { `Defeats :  ${(userStats != null) ? userStats.losses : 0 } `}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            { `Score :  100  `} {/** update with real value from backend */}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            { `Rank :  100  `} {/** update with real value from backend */}
                        </Typography>
                    </Stack>
                    <Divider />
                </Stack>

            </Stack>

        </Box>
     );
}
 
export default ChatUserShwProfile;