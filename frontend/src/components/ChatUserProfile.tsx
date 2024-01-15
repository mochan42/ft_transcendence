import { Avatar, Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Prohibit, GameController, X } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { selectConversation, toggleSidebar } from "../redux/slices/chatSlice";
import { faker } from "@faker-js/faker"
import { selectChatStore } from "../redux/store";
import { fetchAllStats, friendToUserType } from "../data/ChatData";
import Cookies from 'js-cookie';
import Game from "./pages/Game";
import { useEffect, useState } from "react";
import { User, UserStats, GameType } from "../types";
import { getSocket } from "../utils/socketService";
import { enChatType } from "../enums";
import { IsActiveUserBlocked } from './ChatConversation';
import { useNavigate } from "react-router-dom";

/* component to show contact profile */

const ChatUserProfile = () => {
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const theme = useTheme()
    const dispatch = useDispatch();
    const chatStore = useSelector(selectChatStore);
    const socket = getSocket(userId)

    let userSelect = {} as User
    if (chatStore.chatActiveUser && userId != null) {
        userSelect = chatStore.chatActiveUser;
    }


    const onBlock = () => {
        if (chatStore.chatActiveUser) {
            socket.emit('blockFriend', { blockerUserId: userId, blockeeUserId: chatStore.chatActiveUser.id });
            dispatch(selectConversation({ chatRoomId: null, chatType: enChatType.OneOnOne }))
        }
        dispatch(toggleSidebar());
    }

    const challengeToPlay = () => {
        if (chatStore.chatActiveUser) {
            const game: GameType = {
                id: -1,
                player1: userId ? +userId : 0,
                player2: +chatStore.chatActiveUser.id,
                difficulty: 2,
                includeBoost: false,
                status: 'request',
                score1: 0,
                score2: 0,
                paddle1Y: 0,
                paddle2Y: 0,
                boostX: 0,
                boostY: 0,
                ballX: 0,
                ballY: 0,
            }
            socket.emit('requestMatch', game);
        }
    }

    useEffect(() => {
        (async () => {
            if (chatStore.chatActiveUser) {
                const updatedUserStats = await fetchAllStats(chatStore.chatActiveUser.id);
                setUserStats(updatedUserStats);
            }
        })();
    });

    const isBlock = userId ? IsActiveUserBlocked(userId, chatStore.chatBlockedUsers, chatStore.chatActiveUser) : false;

    return (
        <Box sx={{
            width: "550px", backgroundColor: "white",
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            height: "100%"
        }}
        >
            <Stack sx={{ height: "100%" }}>
                {/* header */}
                <Box sx={{
                    width: "100%",
                    boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
                }}
                >
                    <Stack sx={{ p: 2, height: "100%" }}
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        spacing={3}
                    >
                        <Typography variant="subtitle2">Profile</Typography>
                        <IconButton onClick={() => dispatch(toggleSidebar())}>
                            <X />
                        </IconButton>
                    </Stack>
                </Box>

                {/* body */}
                <Stack sx={{ height: "100%", position: "relative", flexGrow: 1, overflowY: "scroll", }}
                    p={3} spacing={3}
                >
                    <Stack alignItems={"center"} direction={"row"} spacing={2}>
                        <Avatar
                            src={userSelect ? userSelect.avatar : faker.image.avatar()}
                            alt={userSelect ? userSelect.userNameLoc : faker.name.firstName()}
                            sx={{ height: 80, width: 80 }}
                        />
                        <Stack spacing={2}
                        >
                            <Typography variant="subtitle2" fontWeight={600}>
                                {userSelect ? userSelect.userName : faker.name.firstName()}
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={400}>
                                {userSelect ? userSelect.email : faker.internet.email()}
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={400}>
                                {userSelect ? userSelect.lastSeen : "06:35pm"}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Divider />
                    {/* a new stack to store all game data about the user */}
                    {/* information : total number of wins, loses*/}
                    <Stack alignItems={"center"} spacing={2}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {`XP :  ${userSelect?.xp}  `}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {`Total Played :  ${(userStats != null) ? userStats.wins + userStats.losses + userStats.draws : 0} `}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {`Victories :  ${(userStats != null) ? userStats.wins : 0}  `}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {`Defeats :  ${(userStats != null) ? userStats.losses : 0} `}
                        </Typography>
                    </Stack>
                    <Divider />
                    <Stack alignItems={"center"} direction={"row"} spacing={2}>
                        <Button startIcon={<Prohibit />} fullWidth variant="outlined" onClick={() => { onBlock() }} disabled={isBlock}> BLock </Button>
                        <Button startIcon={<GameController />} fullWidth variant="outlined" onClick={() => { challengeToPlay() }}> Play game </Button>
                    </Stack>

                </Stack>

            </Stack>

        </Box>
    );
}

export default ChatUserProfile;