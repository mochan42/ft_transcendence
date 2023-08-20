import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Users, ChatCircleDots, Phone } from "phosphor-react";
import { useState } from "react";
//import { faker } from 'faker-js';

import { TChatUserData } from "../types";
import { ChatUserList } from '../data/ChatData';

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
                        <Avatar />
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


const  ChatPageUsers = () => {
    return (
        <Box 
          sx={{
            position:"relative",
            height: "100%",
            width: "500px",
            backgroundColor: "white",
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"
          }}>
            <Stack p={3} spacing={1} sx={{height:"100%"}}>
                <Stack alignItems={"centered"} >
                    <Typography variant='h5'>Chats</Typography>
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
      );
}
 

export default ChatPageUsers  ;