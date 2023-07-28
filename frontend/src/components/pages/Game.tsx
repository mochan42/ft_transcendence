import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import SmallHeading from '../ui/SmallHeading'
import Pong from '../Pong'
import axios from 'axios';
import { User } from '../../types';
import PvP from '../PvP';


interface GameProps {
	difficulty: number;
	userId: number;
	includeBoost: boolean;
	opponent: string;
	setState: React.Dispatch<React.SetStateAction<'select' | 'bot' | 'player'>>;
}

const Game:React.FC<GameProps> = ({ difficulty, userId, includeBoost, opponent, setState }) => {
	const [playerScore, setPlayerScore] = useState(0)
	const [opponentScore, setOpponentScore] = useState(0)
	const [gameActive, setGameActive] = useState(false)
	const [reset, setReset] = useState(false)
	const [isGameOver, setIsGameOver] = useState(false)
	const [userInfo, setUserInfo] = useState<User | null>(null);
	const [opponentInfo, setOpponentInfo] = useState< User | null >(null);

	const playerPoint = () => {
		setPlayerScore(playerScore + 1);
		if (playerScore === 5) {
			setIsGameOver(true);
		}
	}

	const opponentPoint = () => {
		setOpponentScore(opponentScore + 1);
		if (opponentScore === 5) {
			setIsGameOver(true);
		}
	}

	const handlePause = () => {
		setGameActive(!gameActive)
		if (reset) {
			setReset(false);
		}
	}

	const handleReset = () => {
		setPlayerScore(0);
		setOpponentScore(0);
		handlePause();
		setIsGameOver(false);
		setReset(true)
	}

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === ' ') {
			event.preventDefault();
			handlePause();
		}
	};

	useEffect(() => {
		getUserInfo(userId.toString());
		window.addEventListener('keypress', handleKeyPress);
		return () => {
			// Clean up the event listener when the component is unmounted
			window.removeEventListener('keypress', handleKeyPress);
		};
	}, [userId, gameActive]);

	const getUserInfo = async (id: string) => {
		try {
			const url = 'http://localhost:5000/pong/users/' + id;
			const response = await axios.get<User>(url);
			if (response.status === 200) {
				setUserInfo(response.data);
			}
		}
		catch (error) {
			console.log('Error fetching user infos', error);
		}
	}

	return (
		<div className='h-screen w-full flex flex-col items-center justify-between bg-gray-200 dark:bg-slate-900 border-t-8 dark:border-slate-900'>
			<div className='h-1/6 gap-6 items-center justify-between flex'>
				<div className='left-10'>
					<Button variant={'link'} onClick={() => setState('select')}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
						</svg>
					</Button>
				</div>
				<div className='border-8 dark:border-slate-900 flex justify-between gap-8 items-center'>
					<img className='min-w-[24px] h-12 w-12 rounded-full overflow-hidden' src={(userInfo && userInfo.avatar) ? userInfo.avatar : 'https://fastly.picsum.photos/id/294/200/200.jpg?hmac=tSuqBbGGNYqgxQ-6KO7-wxq8B4m3GbZqQAbr7tNApz8'}></img>
					<SmallHeading className='text-lg dark:text-amber-400'>
						{userInfo ? userInfo.userNameLoc : 'Player' }
					</SmallHeading>
				</div>
				<div className='border-8 dark:border-slate-900'>
					<Button>
						{playerScore}
					</Button>
				</div>
				<div>
					<Button className='focus:outline-none' variant='ghost' onClick={handlePause}>
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z' />
						</svg>
					</Button>
					<Button className='focus:outline-none' variant='ghost' onClick={() => handleReset()}>
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3' />
						</svg>
					</Button>
				</div>
				<div className='border-8 dark:border-slate-900'>
					<Button>
						{opponentScore}
					</Button>
				</div>
				<div className='border-8 dark:border-slate-900 flex justify-between gap-8 items-center'>
					<img className='min-w-[24px] w-12 h-12 rounded-full overflow-hidden' src='https://www.svgrepo.com/show/384679/account-avatar-profile-user-3.svg'></img>
					<SmallHeading className='text-lg dark:text-amber-400'>
						{(opponent === 'bot') ? 'Bot' : null}
						{(opponent === 'player') ? 'player' : null}
					</SmallHeading>
				</div>
			</div>
			<div className='w-full h-5/6 border-t-2 border-l-2 border-r-2 border-slate-700 black:border-slate-200 bg-slate-400 dark:text-slate-200 text-center'>
				{opponent === 'bot' ? <Pong userId={userId} difficulty={difficulty} isGameActive={gameActive} isReset={reset} isGameOver={isGameOver} playerScore={playerScore} opponentScore={opponentScore} includeBoost={includeBoost} setIsGameOver={setIsGameOver} playerPoint={playerPoint} opponentPoint={opponentPoint} setReset={setReset}/> : null }
				{(opponent === 'player') ? <PvP setOpponentInfo={setOpponentInfo} userId={userId} difficulty={difficulty} isGameActive={gameActive} isReset={reset} isGameOver={isGameOver} playerScore={playerScore} opponentScore={opponentScore} includeBoost={includeBoost} setIsGameOver={setIsGameOver} playerPoint={playerPoint} opponentPoint={opponentPoint} setReset={setReset} setState={setState} /> : null}
			</div>
		</div>
	)

}

export default Game