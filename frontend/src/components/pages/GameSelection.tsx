import { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import Game from "./Game";
import PageNotFound from "./PageNotFound";
import { cn } from "../../lib/utils";

const GameSelection = () => {

	const [state, setState] = useState<'select' | 'bot' | 'player'>('select');
	const [difficulty, setDifficulty] = useState(0);
	const [difficultyStyle, setDifficultyStyle] = useState<'bg-green-300' | 'bg-yellow-300' | 'bg-red-300'>('bg-green-300')
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
		<div className='h-screen bg-slate-900 w-full grid place-items-center'>
			{state == 'select' ?
				<div className='h-full w-full flex justify-between items-center'>
					<Button
						className={cn('h-full w-5/12 text-slate-200 text-2xl font-extrabold', 'bg-center bg-[url(https://wallpaperaccess.com/full/2019427.jpg)]')}
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
					<div className='h-auto w-auto text-center text-slate-200 gap-6 bg-slate-900'>
						Choose your challenge:
						<Button className={cn('h-auto w-auto', difficultyStyle)} variant={'ghost'} onClick={() => handleDifficulty()}>
							{difficulty === 0 ? 'easy' : null}
							{difficulty === 1 ? 'medium' : null}
							{difficulty === 2 ? 'hard' : null}
							{difficulty === 3 ? 'very hard' : null}
							{difficulty === 4 ? 'extreme' : null}
						</Button>
					</div>
					<Button
						className={cn('h-full w-5/12 text-slate-200 text-2xl font-extrabold', ' bg-cover bg-right bg-[url(https://wallpaperaccess.com/full/2019544.jpg)]')}
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
				</div>
			: null }
			{state == 'bot' ? <Game difficulty={difficulty}/> : null}
			{state == 'player' ? <PageNotFound /> : null}
		</div>
	)
}

export default GameSelection