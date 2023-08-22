import React from 'react';
import { Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ChatTextMsg = (el) => {

    const theme = useTheme();
    return (
        <Stack direction={"row"}
            justifyContent={ el.incoming ? "start" : "end" }
        >
            <Box p={1.5}
                sx={{
                    backgroundColor: el.incoming ? theme.palette.background.default : theme.palette.primary.main,
                    borderRadius: 1.5,
                    width: "max-content"
                }}
            >
                <Typography 
                    variant="body2"
                    color={ el.incoming ? theme.palette.text : "#fff" }
                >
                     { el.message } 
                </Typography>
            </Box>
        </Stack>
    )
}   

export  { ChatTextMsg };