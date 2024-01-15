import { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import Game from "./Game";
import { cn } from "../../lib/utils";
import imgBot from "../../img/SinglePlay.png"
import imgCommunity from "../../img/CommunityPlay.png"

interface GameSelectionProps {
	userId: string | null;
}

const GameSelection: React.FC<GameSelectionProps> = ({ userId }) => {

	const [state, setState] = useState<'select' | 'bot' | 'player'>('select');
	const [difficulty, setDifficulty] = useState(0);
	const [difficultyStyle, setDifficultyStyle] = useState<'bg-green-400' | 'bg-yellow-400' | 'bg-red-400' | 'bg-violet-400' | 'bg-amber-500' | 'bg-white'>('bg-white')
	const [isHoveredBot, setIsHoveredBot] = useState(false);
	const [isHoveredPlayer, setIsHoveredPlayer] = useState(false);
	const [includeBoost, setIncludeBoost] = useState(true);

	const handleMouseEnterBot = () => {
		setIsHoveredBot(true);
	};

	const handleMouseLeaveBot = () => {
		setIsHoveredBot(false);
	};

	const handleMouseEnterPlayer = () => {
		setIsHoveredPlayer(true);
	};

	const handleMouseLeavePlayer = () => {
		setIsHoveredPlayer(false);
	};



	useEffect(() => {
		if (difficulty === 0) {
			setDifficultyStyle('bg-green-400')
		} else if (difficulty === 1) {
			setDifficultyStyle('bg-yellow-400')
		} else if (difficulty === 2) {
			setDifficultyStyle('bg-red-400')
		} else if (difficulty === 3) {
			setDifficultyStyle('bg-violet-400')
		} else if (difficulty === 4) {
			setDifficultyStyle('bg-amber-500')
		}
	}, [difficulty])


	const handleDifficulty = () => {
		if (difficulty === 4) {
			setDifficulty(0);
		} else {
			setDifficulty(difficulty + 1);
		}
	}

	return (
		<div className='h-5/6 dark:bg-slate-900 bg-slate-200 w-full grid place-items-center'>
			{state === 'select' ?
				<div className='h-full w-full relative'>
					<Button
						className={'border-r-4 border-slate-200 dark:border-slate-900 h-full w-1/2 text-slate-200 text-2xl font-extrabold z-0 bg-center'}
						variant={'link'}
						onClick={() => setState('bot')}
						onMouseEnter={() => handleMouseEnterBot()}
						onMouseLeave={() => handleMouseLeaveBot()}
						style={{
							backgroundImage: `url(${imgBot})`,
							opacity: isHoveredBot ? 0.9 : 0.6,
						}}
					>
						Play Bot
					</Button>
					<Button
						className={'border-l-4 border-slate-200 dark:border-slate-900 h-full w-1/2 text-slate-200 text-2xl font-extrabold z-0 bg-cover bg-right'}
						onClick={() => setState('player')}
						variant={'link'}
						onMouseEnter={() => handleMouseEnterPlayer()}
						onMouseLeave={() => handleMouseLeavePlayer()}
						style={{
							backgroundImage: `url(${imgCommunity})`,
							opacity: isHoveredPlayer ? 0.9 : 0.6,
						}}
					>
						Play live
					</Button>
					<div className={'border-4 border-slate-200 dark:border-slate-900 rounded-full h-64 w-64 text-white text-xl font-extrabold flex-cols justify-around text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center'}>
						<button className={cn(difficultyStyle, 'hover:underline w-full h-1/2 rounded-tl-full rounded-tr-full border-4 border-slate-200 dark:border-slate-900 saturate-50')}
							onClick={() => handleDifficulty()}>
							{difficulty === 0 ? 'easy' : null}
							{difficulty === 1 ? 'medium' : null}
							{difficulty === 2 ? 'hard' : null}
							{difficulty === 3 ? 'very hard' : null}
							{difficulty === 4 ? 'extreme' : null}
						</button>
						<button className='hover:underline w-full h-1/2 rounded-bl-full rounded-br-full border-4 border-slate-200 dark:border-slate-900 bg-slate-500 saturate-50'
							onClick={() => setIncludeBoost((prev) => !prev)}>
							{includeBoost ? "Upgrade enabled" : "Upgrade disabled"}
						</button>
					</div>
				</div>
				: <Game difficulty={difficulty} userId={userId} opponent={state} setState={setState} includeBoost={includeBoost} />}
		</div>
	)
}

export default GameSelection