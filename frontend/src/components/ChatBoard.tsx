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
        <div className="p-2 bg-slate-200 shadow-md h-full w-1/5">
			<div className="space-y-3 flex flex-col items-center w-full">
				{ChatBoardBtns.map((el) => (
					<div key={el.index}>
						{el.index === selected ? (
							<div className="bg-slate-900 rounded-md">
								<button
									className="w-16 h-16 text-amber-400 py-2 flex items-center justify-center text-2xl"
								>
									{el.icon}
								</button>
							</div>
						) : (
							<button
								onClick={() => setSelected(el.index)}
								className="w-full py-2 flex items-center justify-center text-2xl"
							>
								{el.icon}
							</button>
						)}
					</div>
				))}
			</div>
		</div>
    );
}
 
export default ChatBoard;