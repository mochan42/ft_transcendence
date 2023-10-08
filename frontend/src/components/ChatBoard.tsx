import { Box, Stack, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Users, ChatCircleDots, Phone, Browser} from "phosphor-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import ChatPageUsers from './ChatPageUsers';
import ChatPageGroups from './ChatPageGroups';
import { HOME_SECTION } from "../enums";


const ChatBoardBtns = [
    {
        index: HOME_SECTION.PROFILE,
        icon: <Browser />,
    },
    {
        index: HOME_SECTION.CHAT_USER,
        icon: <ChatCircleDots/>,
    },
    {
        index: HOME_SECTION.CHAT_GROUP,
        icon: <Users/>,
    },
    {
        index: HOME_SECTION.REQUEST,
        icon: <Phone/>,
    }
]

interface ISelectSection {
	section: Number,
	setSection: React.Dispatch<React.SetStateAction<Number>>
}

const ChatBoard = (select : ISelectSection) => {

    const theme = useTheme();

	const navigate = useNavigate();

    //const [selected, setSelected] = useState<Number>(0)
    


    
    return (  
        <div className="p-2 bg-slate-200 shadow-md h-full w-1/5">
			<div className="space-y-3 flex flex-col items-center w-full">
				{ChatBoardBtns.map((el) => (
					<div key={el.index}>
						{el.index === select.section ? (
							<div className="bg-slate-900 rounded-md">
								<button
									className="w-16 h-16 text-amber-400 py-2 flex items-center justify-center text-2xl"
								>
									{el.icon}
								</button>
							</div>
						) : (
							<button
								onClick={() => {
									select.setSection(el.index);
									console.log("Select:", select.section, "-", el.index)
									navigate('/')
									// { selected === HOME_SECTION.CHAT_USER 
									// 	? <ChatPageUsers/>
									// 	: <ChatPageGroups/>}

								}}
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