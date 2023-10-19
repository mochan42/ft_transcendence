
import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge, Link, Icon} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Users, ChatCircleDots, Phone, Plus} from "phosphor-react";
import { useState } from "react";
import { faker } from "@faker-js/faker";

import { TChatUserData } from "../types";
import { ChatUserList } from "../data/ChatData";
import ChatPageGroupsCreate from "./ChatPageGroupsCreate";

import { ChatProps } from "../types";
import ChatConversation from "./ChatConversation";


const ChatElement = (user : TChatUserData) => {
    return (
        <Box 
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
                    {user.online ? 
                    <Badge 
                        color="success" 
                        variant="dot" 
                        anchorOrigin={{vertical:"bottom", horizontal:"left"}}
                        overlap="circular"
                    >
                        <Avatar src={ user.img }/>
                    </Badge>
                    : <Avatar alt={ user.name }/>
                    }
                    <Stack spacing={0.2}>
                        <Typography variant="subtitle2">{ user.name }</Typography>
                        <Typography variant="caption">{ user.msg } </Typography>
                    </Stack>
                </Stack>
                <Stack spacing={2} alignItems={"center"}>
                    <Typography variant="caption">{ user.time }</Typography>
                    <Badge color="primary" badgeContent={ user.unread }></Badge>
                </Stack>

            </Stack>
        </Box>
    ); 
}


const  ChatPageGroups = (chatProp : ChatProps) => {
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    return (
        <>
        <Stack direction={"row"}>

        <Box 
          sx={{
            position:"relative",
            height: "100%",
            minWidth: "350px",
            backgroundColor: "white",
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"
          }}>
            <Stack p={3} spacing={1} sx={{height:"100%"}}>
                <Stack alignItems={"centered"} >
                    <Typography variant='h5'>Groups</Typography>
                </Stack>
                <Divider/>
                <Stack direction={"row"} justifyContent={"space-between"} alignContent={"center"} >
                    <Typography variant="subtitle2" component={Link}>
                        Create New Group
                    </Typography>
                    <IconButton onClick={() => { setOpenDialog(true) }} >
                        <Plus style={{ color: theme.palette.primary.main }}/>
                    </IconButton>
                </Stack>
                <Divider/>
                <Stack 
                    sx={{flexGrow:1, overflowY:"scroll", height:"100%"}}
                    direction={"column"} 
                    spacing={0.5} 
                >
                    { ChatUserList.map((el) => { return (<ChatElement {...el} />) })}
                </Stack>
            </Stack>

        </Box>
        {/* Right side : conversation panel */}
        {/* // TODO */}
                <ChatConversation userId={chatProp.userId} socket={chatProp.socket} />

        </Stack>
            {openDialog && <ChatPageGroupsCreate openState={openDialog} handleClose={handleCloseDialog} socket={chatProp.socket} />}
        </>
      );
}
 

export default ChatPageGroups;