import { Avatar, Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Prohibit, Trash, X } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/slices/chatSideBar";
import { faker } from "@faker-js/faker"

/* component to show contact profile */
const ChatContact = () => {

    const theme = useTheme()
    const dispatch = useDispatch();

    return ( 
        <Box sx={{
                width:"550px", backgroundColor: "white",
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"
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
                        <Avatar src={faker.image.avatar()} alt={faker.name.firstName()}
                                sx={{ height:60, width:60 }}
                        /> 
                        <Stack spacing={2}
                        >
                            <Typography variant="subtitle2" fontWeight={600}>{ faker.name.fullName() } </Typography>
                            <Typography variant="subtitle2" fontWeight={400}>{"+924 324 234 23"} </Typography>
                        </Stack>
                        <Divider />
                        {/* a new stack to store all data about the user */}
                        {/* information : total number of wins, loses*/}

                    </Stack>
                    <Divider />
                    <Stack alignItems={"center"} direction={"row"} spacing={2}>
                        <Button startIcon={ <Prohibit/>} fullWidth variant="outlined"> Block </Button>
                        <Button startIcon={ <Trash/>} fullWidth variant="outlined"> Delete </Button>
                    </Stack>

                </Stack>

            </Stack>

        </Box>
     );
}
 
export default ChatContact;