import { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import Game from "./Game";
import PageNotFound from "./PageNotFound";
import { cn } from "../../lib/utils";

interface GameSelectionProps {
	userId: number;
}

const GameSelection:React.FC<GameSelectionProps> =({ userId }) => {

	const [state, setState] = useState<'select' | 'bot' | 'player'>('select');
	const [difficulty, setDifficulty] = useState(0);
	const [difficultyStyle, setDifficultyStyle] = useState<'bg-green-300' | 'bg-yellow-300' | 'bg-red-300' | 'bg-violet-300' | 'bg-amber-900' | 'bg-white'>('bg-white')
	const [isHoveredBot, setIsHoveredBot] = useState(false);
	const [isHoveredPlayer, setIsHoveredPlayer] = useState(false);

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
		handleDifficultyStyle();
	}, [difficulty])

	const  handleDifficultyStyle = () => {
		if (difficulty === 0) {
			setDifficultyStyle('bg-green-300')
		} else if (difficulty === 1) {
			setDifficultyStyle('bg-yellow-300')
		} else if (difficulty === 2) {
			setDifficultyStyle('bg-red-300')
		} else if (difficulty === 3) {
			setDifficultyStyle('bg-violet-300')
		} else if (difficulty === 4) {
			setDifficultyStyle('bg-amber-900')
		}
	}
	
	const handleDifficulty = () => {
		if (difficulty === 4) {
			setDifficulty(0);
		} else {
			setDifficulty(difficulty + 1);
		}
	}

	return (
		<div className='h-screen dark:bg-slate-900 bg-slate-200 w-full grid place-items-center'>
			{state == 'select' ?
				<div className='h-full w-full relative border-4 border-slate-200 dark:border-slate-900'>
					<Button
						className={cn('border-4 border-slate-200 dark:border-slate-900 h-full w-1/2 text-2xl font-extrabold z-0', 'bg-center bg-[url(https://wallpaperaccess.com/full/2019427.jpg)]')}
						variant={'link'}
						onClick={() => setState('bot')}
						onMouseEnter={() => handleMouseEnterBot()}
						onMouseLeave={() => handleMouseLeaveBot()}
						style={{
							opacity: isHoveredBot ? 0.9 : 0.6,
						}}
					>
						Play Bot
					</Button>
					<Button
						className={cn('border-4 border-slate-200 dark:border-slate-900 h-full w-1/2 text-slate-200 text-2xl font-extrabold z-0', ' bg-cover bg-right bg-[url(https://wallpaperaccess.com/full/2019544.jpg)]')}
						onClick={() => setState('player')}
						variant={'link'}
						onMouseEnter={() => handleMouseEnterPlayer()}
						onMouseLeave={() => handleMouseLeavePlayer()}
						style={{
							opacity: isHoveredPlayer ? 0.9 : 0.6,
						}}
					>
						Play live
					</Button>
						<button className={cn('border-4 border-slate-200 dark:border-slate-900 rounded-full h-64 w-64 text-white hover:underline text-xl font-extrabold flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900',
							difficultyStyle)}
							onClick={() => handleDifficulty()}>
							{difficulty === 0 ? 'easy' : null}
							{difficulty === 1 ? 'medium' : null}
							{difficulty === 2 ? 'hard' : null}
							{difficulty === 3 ? 'very hard' : null}
							{difficulty === 4 ? 'extreme' : null}
						</button>
				</div>
			: null }
			{state == 'bot' ? <Game difficulty={difficulty} userId={userId} setState={setState}/> : null}
			{state == 'player' ? <PageNotFound /> : null}
		</div>
	)
}

export default GameSelection