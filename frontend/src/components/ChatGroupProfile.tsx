import { Avatar, Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Prohibit, Gear, X, SignOut } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/slices/chatSlice";
import { selectChatStore } from "../redux/store";
import { selectChatDialogStore } from "../redux/store";
import { faker } from "@faker-js/faker"
import img42 from '../img/icon_42.png'
import { User } from "../types";
import { ChatGroupMemberProfileComp }  from "./ChatGroupComp";
import Cookies from 'js-cookie';
import { enChatMemberRank } from "../enums";
import ChatGroupActionBtn from "./ChatGroupActionBtn";
import { useState } from "react";
import ChatGroupFormSetPasswd from "./ChatGroupFormSetPasswd";
import ChatGroupFormSetTitle from "./ChatGroupFormSetTitle";
import ChatGroupFormAddUser from "./ChatGroupFormAddUser";
import ChatDialogShwProfile from "./ChatDialogShwProfile";
import ChatDialogShwPasswd from "./ChatDialogShwPasswd";

/* component to show contact profile */
const ChatGroupProfile = () => {

    const theme = useTheme()
     const userId = Cookies.get('userId') ? Cookies.get('userId') : ''; // not working
    //const userId = '1' // for testing only member (7) admin (1)
    const dispatch = useDispatch();
    const chatStore = useSelector(selectChatStore);
    const chatDialogStore = useSelector(selectChatDialogStore);
    const activeGroupTitle = (chatStore.chatActiveGroup ? chatStore.chatActiveGroup.title : "")
    const activeGroupPrivacy = (chatStore.chatActiveGroup ? chatStore.chatActiveGroup.privacy: "")
    const groupMemberNo = (chatStore.chatActiveGroup ? chatStore.chatGroupMembers.length: 0)
    const loggedUser = chatStore.chatGroupMembers.filter(el => (el.usrId.toString()) === userId)
    // console.log(loggedUser, 'id- ', userId, loggedUser[0].rank)
    // console.log("Show userId", userId)
    let actionBtnState = (loggedUser[0].rank === enChatMemberRank.MEMBER) ? false : true
    const [ChangePasswdDialogState, setChangePasswdDialogState] = useState<Boolean>(false)
    // const actionBtnState = true


    return ( 
        <Box sx={{
                width:"550px", backgroundColor: "white",
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
                height: "75vh"
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

                <Stack sx={{ height:"100%", position:"relative", flexGrow:1, overflowY:"scroll"}}
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
                            <Typography variant="subtitle2" fontWeight={400}>{ activeGroupPrivacy } </Typography>
                        </Stack>
                    </Stack>

                    {/* divider  */}
                    <Divider />
                    <Stack alignItems={"center"} direction={"row"} spacing={2}>
                        <Button startIcon={ <SignOut/>} fullWidth variant="outlined"> Exit </Button>
                        {/* render action button if logged user is owner or admin */}
                        { actionBtnState && ChatGroupActionBtn(activeGroupPrivacy)
                            // <Button startIcon={ <Gear size={25} />} fullWidth variant="outlined" > Actions </Button>
                        }
                    </Stack>

                    {/* divider  */}
                    <Divider />
                    {/* map to list to show group members */}
                    <Stack sx={{ height:"35vh", flexGrow:1, overflowY:"scroll"}}
                        spacing={0.5}
                    >
                        {
                            chatStore.chatGroupMembers.map( (member) => {
                                const memberUser = (chatStore.chatUsers.filter(el => parseInt(el.id) === member.usrId)[0])
                                if (memberUser)
                                {
                                    return <ChatGroupMemberProfileComp 
                                                key={memberUser.id}
                                                memberUser={memberUser} 
                                                memberJoin={member} 
                                            />
                                }
                            })
                        }
                    {/* divider  */}
                    <Divider />
                    </Stack>
                </Stack>
                </Stack>
                {/* show dialogs here */}
                { chatDialogStore.chatDialogSetTitle && <ChatGroupFormSetTitle />}
                { chatDialogStore.chatDialogSetPasswd && <ChatGroupFormSetPasswd />}
                { chatDialogStore.chatDialogAddUser && <ChatGroupFormAddUser />}
                { chatDialogStore.chatDialogShwProfile && 
                  chatDialogStore.chatDialogProfileUserId && 
                    <ChatDialogShwProfile userId={chatDialogStore.chatDialogProfileUserId}/>
                }
                { chatDialogStore.chatDialogShwPasswd && <ChatDialogShwPasswd/>}
            </Stack>

        </Box>
     );
}
 
export default ChatGroupProfile;