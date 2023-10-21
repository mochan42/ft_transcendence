import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Stack, Avatar, Typography, Button, Box, Badge } from '@mui/material'
import { TChatUserData } from '../types';

const StyledChatBox = styled(Box)(({ theme }) => ({
    "&:hover": {
        cursor: "pointer",
    },

}));


const ChatUserComp = (usrData : TChatUserData) => {
    const theme = useTheme()
    return (
        <StyledChatBox sx={{
            width : "100%",
            biorderRadius: 1,
            backgroundColor: theme.palette.background.paper,
            p: 2
        }}
        >

            <Stack
                direction={"row"} 
                alignItems={"center"} 
                justifyContent="space-between"
            >
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {" "}
                    {usrData.online ? 
                        (
                            <Badge
                                variant='dot'
                                anchorOrigin={{ vertical:"bottom", horizontal:"right"}}
                                // overlap='cirular'
                            >
                                {/* <Avatar alt={usrData.userName} src={usrData.img} /> */}
                                <Avatar alt="image" src={usrData.img} />
                            </Badge>
                         )
                         : (<Avatar alt={usrData.name} src={usrData.img} />)
                        //  : (<Avatar alt={usrData.userName} src={usrData.img} />)
                    }
                    <Stack>
                        <Typography variant="subtitle2"> { usrData.name }</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Button 
                        onClick={() => {
                            alert("request_sent");
                            // EMIT SOCKET EVENT : FRIEND_REQUEST
                            // socket.emit("friend_request ", {data}, ()=> {
                            //     alert("request_sent");
                            // });
                        }}
                    > Send Request
                    </Button>
                </Stack>

            </Stack>
        </StyledChatBox>
    )
}

export { ChatUserComp } 