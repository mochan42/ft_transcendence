import { Box, Stack, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Users, ChatCircleDots, Phone } from "phosphor-react";
import { useState } from "react";

const ChatBoardBtns = [
    {
        index: 0,
        icon: <ChatCircleDots/>,
    },
    {
        index: 1,
        icon: <Users/>,
    },
    {
        index: 2,
        icon: <Phone/>,
    }
]

const ChatBoard = () => {

    const theme = useTheme();

    const [selected, setSelected] = useState<Number>(0)
    


    
    return (  
        <Box p={2} 
            sx={ {
                backgroundColor: theme.palette.background.paper, 
                boxShadow: "2px rgba{0.25}",  height: "100%", width:"80px"}}
        >
            <Stack direction="column" sx={{ width:"100%" }} alignItems={"center"} spacing={3}>
                { ChatBoardBtns.map((el) => (
                    el.index === selected ? 
                    <Box sx={{background: theme.palette.primary.main, borderRadius:1.5}}>
                        <IconButton
                            sx={{ color:"#fff", width:"100%" }}
                            key={el.index}
                        >
                            {el.icon} 
                        </IconButton>
                    </Box>
                   :
                   <IconButton 
                     onClick={ ()=> setSelected(el.index) }
                     sx={{ color:"#000", width:"100%" }}
                     key={el.index}
                   > 
                    {el.icon} 
                   </IconButton>
                ))}
            </Stack>
        </Box>
    );
}
 
export default ChatBoard;