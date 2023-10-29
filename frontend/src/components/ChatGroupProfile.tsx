import { Avatar, Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Prohibit, Trash, X } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/slices/chatSlice";
import { selectChatStore } from "../redux/store";
import { faker } from "@faker-js/faker"
import img42 from '../img/icon_42.png'
import { User } from "../types";
import { dummyUsers } from "../data/ChatData";
import ChatGroupMemberComp  from "./ChatGroupComp";

/* component to show contact profile */
const ChatGroupProfile = () => {

    const theme = useTheme()
    const dispatch = useDispatch();
    const chatStore = useSelector(selectChatStore);
    const activeGroupTitle = (chatStore.chatActiveGroup ? chatStore.chatActiveGroup.title : "")
    const groupMemberNo = (chatStore.chatActiveGroup ? chatStore.chatActiveGroupMembers.length: 0)

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
                <Stack  justifyContent={"space-between"}>

                <Stack sx={{ height:"100%", position:"relative", flexGrow:1, overflowY:"scroll", }}
                        p={3} spacing={3}
                >
                    <Stack alignItems={"center"} direction={"row"} spacing={2}>
                        <Avatar src={ img42 } alt={ activeGroupTitle }
                                sx={{ height:60, width:60 }}
                        /> 
                        <Stack spacing={2}
                        >
                            <Typography variant="subtitle2" fontWeight={600}>{ activeGroupTitle } </Typography>
                            <Typography variant="subtitle2" fontWeight={400}>{`${groupMemberNo} Members`} </Typography>
                        </Stack>
                    </Stack>

                    {/* divider  */}
                    <Divider />
                    <Stack alignItems={"center"} direction={"row"} spacing={2}>
                        <Button startIcon={ <Prohibit/>} fullWidth variant="outlined"> Exit </Button>
                        <Button startIcon={ <Trash/>} fullWidth variant="outlined"> Delete </Button>
                    </Stack>

                    {/* divider  */}
                    <Divider />
                    {/* map to list to show group members */}
                    <Stack>
                        {
                            chatStore.chatActiveGroupMembers.map( (member) => {
                                //const memberUser = (chatStore.chatUsers.filter(el => parseInt(el.id) === member.usrId)[0])
                                const memberUser: User = (dummyUsers.filter(el => parseInt(el.id) === member.usrId)[0])
                                if (memberUser)
                                {
                                    return <ChatGroupMemberComp key={memberUser.id} user={memberUser} rank={member.rank} />
                                }
                            })
                        }

                    </Stack>

                    {/* divider  */}
                    <Divider />


                </Stack>
                </Stack>

            </Stack>

        </Box>
     );
}
 
export default ChatGroupProfile;