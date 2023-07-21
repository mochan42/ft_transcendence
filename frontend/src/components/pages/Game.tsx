import { useState } from 'react'
import { Button } from '../ui/Button'
import SmallHeading from '../ui/SmallHeading'
import Pong from '../Pong'

const Game = () => {

	const [playerScore, setPlayerScore] = useState(0)
	const [botScore, setBotScore] = useState(0)
	const [gameActive, setGameActive] = useState(false)
	const [reset, setReset] = useState(false) // #STILL WORKING ON THIS PART!!!!

	const playerPoint = () => {
		setPlayerScore(playerScore + 1)
	}

	const botPoint = () => {
		setBotScore(botScore + 1)
	}

	const handlePause = () => {
		setGameActive(!gameActive)
		if (reset) {
			setReset(false);
		}
	}

	const handleReset = () => {
		setPlayerScore(0);
		setBotScore(0);
		handlePause();
		setReset(true)
		console.log(reset);
	}

	return (
		<div className='h-screen w-full flex flex-col items-center justify-between bg-gray-200 dark:bg-slate-900 border-t-8 dark:border-slate-900'>
			<div className='h-1/6 gap-6 items-center justify-between flex'>
				<div className='border-8 dark:border-slate-900 flex justify-evenly'>
					<img className='min-w-[25px] min-h-[25px] w-1/12 h-1/12 rounded-full overflow-hidden' src='https://fastly.picsum.photos/id/294/200/200.jpg?hmac=tSuqBbGGNYqgxQ-6KO7-wxq8B4m3GbZqQAbr7tNApz8'></img>
					<SmallHeading className='text-lg dark:text-amber-400'>
						Bill
					</SmallHeading>
				</div>
				<div className='border-8 dark:border-slate-900'>
					<Button onClick={() => playerPoint()}>
						{playerScore}
					</Button>
				</div>
				<div>
					<Button variant='ghost' onClick={handlePause}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z" />
						</svg>
					</Button>
					<Button variant='ghost' onClick={() => handleReset()}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
						</svg>
					</Button>
				</div>
				<div className='border-8 dark:border-slate-900'>
					<Button onClick={() => botPoint()}>
						{botScore}
					</Button>
				</div>
				<div className='border-8 dark:border-slate-900 flex justify-evenly'>
					<img className='min-w-[25px] min-h-[25px] w-1/12 h-1/12 rounded-full overflow-hidden' src='https://fastly.picsum.photos/id/294/200/200.jpg?hmac=tSuqBbGGNYqgxQ-6KO7-wxq8B4m3GbZqQAbr7tNApz8'></img>
					<SmallHeading className='text-lg dark:text-amber-400'>
						Bot
					</SmallHeading>
				</div>
			</div>
			<div className='w-full h-5/6 border-t-2 border-l-2 border-r-2 border-slate-500 black:border-slate-200 bg-slate-500 dark:text-slate-200 text-center'>
				<Pong difficulty={0} isGameActive={gameActive} isReset={reset} />
			</div>
		</div>
	)

}

export default Game