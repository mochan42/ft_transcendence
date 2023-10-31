import { Box, Stack, IconButton, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Users, ChatCircleDots, GameController, Browser, Handshake} from "phosphor-react";
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
        index: HOME_SECTION.GAME_REQUEST,
        icon: <GameController/>,
    },
    // {
    //     index: HOME_SECTION.GROUP_REQUEST,
    //     icon: <Handshake/>,
    // }
]

interface ISelectSection {
	section: Number,
	setSection: React.Dispatch<React.SetStateAction<Number>>
}

const HomeBoard = (select : ISelectSection) => {

    const theme = useTheme();

	const navigate = useNavigate();

    //const [selected, setSelected] = useState<Number>(0)
    


    
    return (  
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
								<Divider/>
							</div>
						) : (
							<button
								onClick={() => {
									select.setSection(el.index);
									console.log("Select:", select.section, "-", el.index)
									navigate('/')
								}}
								className="w-full py-2 flex items-center justify-center text-2xl"
							>
								{el.icon}
							</button>
						)}
					</div>
				))}
			</div>
    );
}
 
export default HomeBoard;