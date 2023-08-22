import { Box, Stack, IconButton, Typography, Divider, Avatar, Badge } from "@mui/material";
import { CaretDown } from "phosphor-react";
const ChatConversation = () => {
    return ( 
        <Stack sx={{ height: "100%", width: "100%",
            }} 
        >
            {/* Chat header */}
            <Box p={1} sx={{ 
                width: "100%", backgroundColor: "white",
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)" }}
            >
                <Stack direction={"row"} justifyContent={"space-between"} sx={{ height:"100%", width:"100%"}}>
                    <Stack direction={"row"} spacing={2} alignContent={"center"}>

                        <Box p={1}>
                            <Badge 
                                color="success" 
                                variant="dot" 
                                anchorOrigin={{vertical:"bottom", horizontal:"left"}}
                                overlap="circular"
                            >
                                <Avatar alt="image"/>
                            </Badge>
                        </Box>
                        <Stack spacing={0.2}>
                            <Typography variant="subtitle1">Pmeising</Typography>
                            <Typography variant="caption">Online</Typography>
                        </Stack>
                    </Stack>
                    <Stack>
                        <IconButton>
                            <CaretDown />
                        </IconButton>
                    </Stack>

                </Stack>

            </Box>


            {/* Chat message */}
            <Box p={1} sx={{ height: "100%", width: "100%", backgroundColor: "#eee", flexGrow:1}} >
                <Typography>msg area</Typography>

            </Box>


            {/* Chat footer */}
            <Box p={1} sx={{ height: "50px", width: "100%", backgroundColor: "white", 
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"}} >
                <Typography>footer</Typography>

            </Box>
        </Stack>
     );
}
 
export default ChatConversation;    