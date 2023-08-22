import React from 'react'
import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge } from "@mui/material";
import { Chat_History } from '../data/ChatData';
import { ChatTextMsg } from '../types_Chat';


const ChatMessage = () => {
    return (
        <Box p={3}>
            <Stack>
                { Chat_History.map((el) => {
                    switch (el)
                    {
                        //case "divider":
                            //break;
                        case "msg":
                            switch (el.subtype)
                            {
                                case "img":
                                    break;
                                case "doc":
                                    break;
                                case "link":    
                                    break;
                                case "reply":
                                    break;
                                default: // text
                                    return <ChatTextMsg el={el}/>
                            }
                            break ;
                        default: 
                            return <></>;
                    }
                })}
 
            </Stack>
            
        </Box>
	)
}

export default ChatMessage;