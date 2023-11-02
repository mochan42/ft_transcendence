import { Avatar, Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Prohibit, GameController, X } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/slices/chatSlice";
import { faker } from "@faker-js/faker"
import { selectChatStore } from "../redux/store";
import { friendToUserType } from "../data/ChatData";
import Cookies from 'js-cookie';
import Game from "./pages/Game";

/* component to show contact profile */
const ChatUserProfile = () => {
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';

    const theme = useTheme()
    const dispatch = useDispatch();
    const chatStore = useSelector(selectChatStore);
    
    let userSelect =  null
    if (chatStore.chatActiveUser && userId != null) {
        userSelect = friendToUserType(userId, chatStore.chatActiveUser, chatStore.chatUsers)
    }

    return ( 
        <Box sx={{
                width:"550px", backgroundColor: "white",
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
                        <IconButton onClick={ ()=> dispatch(toggleSidebar())}>
                            <X/>
                        </IconButton>
                    </Stack>
                </Box>

                {/* body */}
                <Stack sx={{ height:"100%", position:"relative", flexGrow:1, overflowY:"scroll", }}
                        p={3} spacing={3}
                >
                    <Stack alignItems={"center"} direction={"row"} spacing={2}>
                        <Avatar 
                            src={ userSelect ? userSelect.avatar : faker.image.avatar()} 
                            alt={ userSelect ? userSelect.userName : faker.name.firstName()}
                            sx={{ height:80, width:80 }}
                        /> 
                        <Stack spacing={2}
                        >
                            <Typography variant="subtitle2" fontWeight={600}>
                                { userSelect ? userSelect.userName : faker.name.firstName() } 
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
                            { `Total Played :  100  `} {/** update with real value from backend */}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            { `Wins :  100  `} {/** update with real value from backend */}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            { `Losts :  100  `} {/** update with real value from backend */}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            { `Score :  100  `} {/** update with real value from backend */}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            { `Rank :  100  `} {/** update with real value from backend */}
                        </Typography>
                    </Stack>
                    <Divider />
                    <Stack alignItems={"center"} direction={"row"} spacing={2}>
                        <Button startIcon={ <Prohibit/>} fullWidth variant="outlined"> Mute </Button>
                        <Button startIcon={ <GameController/>} fullWidth variant="outlined"> Play game </Button>
                    </Stack>

                </Stack>

            </Stack>

        </Box>
     );
}
 
export default ChatUserProfile;