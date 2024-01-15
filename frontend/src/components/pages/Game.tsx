import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import SmallHeading from '../ui/SmallHeading'
import Pong from '../Pong'
// import axios from 'axios';
import { GameType, User } from '../../types';
import PvP from '../PvP';
import { fetchUser } from '../../data/ChatData';
// import { Socket } from 'socket.io-client';
import { getSocket } from '../../utils/socketService';
import { MAX_SCORE } from '../../APP_CONSTS';
import { Socket } from 'socket.io-client';
import { getUserById } from '../ChatConversation';
import axios from 'axios';
import { BACKEND_URL } from '../../data/Global';
import { LOG_STATE } from '../../enums';


interface GameProps {
	difficulty: number | undefined;
	userId: string | null;
	includeBoost: boolean;
	opponent: string;
	matchIsFound?: boolean;
	status?: string;
	setState?: React.Dispatch<React.SetStateAction<'select' | 'bot' | 'player'>>;
	game?: GameType;
}

const Game:React.FC<GameProps> = ({ difficulty, userId, includeBoost, opponent, setState, status, game, matchIsFound }) => {
	
	const socket = getSocket(userId);
	const [gameRef, setGameRef] = useState(game);
	const [gameActive, setGameActive] = useState(false)
	const [reset, setReset] = useState(false)
	const [isGameOver, setIsGameOver] = useState(false)
	const [player1Id, setPlayer1Id] = useState('-1')
	const [player2Id, setPlayer2Id] = useState('-1')
	const [player1Info, setPlayer1Info] = useState< User | null | undefined >(null);
	const [player2Info, setPlayer2Info] = useState< User | null | undefined >(null);
	const [userInfo, setUserInfo] = useState< User | null | undefined >(null);
	const [player1Score, setPlayer1Score] = useState(0);
	const [player2Score, setPlayer2Score] = useState(0);
	const [isActive, setIsActive] = useState(true);
	const [isPause, setIsPause] = useState(false);

	const playerPoint = () => {
		setPlayer1Score(player1Score + 1);
		if (player1Score === MAX_SCORE) {
			setIsGameOver(true);
		}
	}

	const opponentPoint = () => {
		setPlayer2Score(player2Score + 1);
		if (player2Score === MAX_SCORE) {
			setIsGameOver(true);
		}
	}

	const handlePause = () => {
		if (opponent === 'bot') {
			setGameActive(!gameActive);
			if (reset) {
				setReset(false);
			}
		} else if (opponent == 'player') {
			setIsPause(true);
			console.log("Setting pause to true");
		}
	}

	const handleReset = () => {
		setPlayer1Score(0);
		setPlayer2Score(0);
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

	const handleReturn = () => {
		if (((+player1Id > 0) && (+player2Id < 0)) || ((+player2Id > 0) && (+player1Id < 0))) {
			socket.emit('leaveQueue');
			console.log("Leaving match queue!");
		} else if ((+player1Id > 0) && (+player2Id > 0)) {
			socket.emit('abortMatch', gameRef);
			console.log("Aborting game!");
		} else {
			console.log("WARNING: NEITHER CONDITION WAS MET!")
		}
		if (setState) {
			setState('select');
			setIsActive(false);
			console.log("Player leaving game.");
		}
		else
			console.log("Can't return, don't have the setState object.");
	}

	useEffect(() => {
			(async() => {
				if (player1Id && player2Id) {
					console.log("player1Id: ", player1Id, "player2ID :", player2Id, "\n");
					const ply1 = await fetchUser(player1Id);
					const ply2 = await fetchUser(player2Id);
					setPlayer1Info(ply1);
					setPlayer2Info(ply2);
				}
				else if (userId) {
					const tmp = await fetchUser(userId)
					setPlayer1Info(tmp);
				}
				if (userId) {
					const user = await fetchUser(userId)
					setUserInfo(user);
				}
			})();
			window.addEventListener('keypress', handleKeyPress);
			return () => {
				window.removeEventListener('keypress', handleKeyPress); // Clean up the event listener when the component is unmounted
			};
	}, [userId, player1Id, player2Id, gameActive]);

	const getUserInfo = async (id: number) => {
		const url_info = `${BACKEND_URL}/pong/users/` + id;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
        };
        try {
            const response = await axios.get<User>(url_info, { headers });
            if (response.status === 200) {
				if (id == +player1Id) {
					setPlayer1Info(response.data);
				} else {
					setPlayer2Info(response.data);
				}
            }
        }
        catch (error) {
            console.log('Error fetching user infos', error);
        }
    }

	useEffect(() => {
		if (gameRef) {
			setPlayer2Id(gameRef.player2.toString());
			getUserInfo(+player1Id);
			getUserInfo(+player2Id);
		}
		// if (player1Info?.currentState != LOG_STATE.INGAME) {
		// 	setIsActive(false);
		// }

	}, [gameRef]);

	return (
		<div className='h-full w-full flex flex-col items-center justify-between bg-gray-200 dark:bg-slate-900 border-t-8 dark:border-slate-900 z-50'>
			<div className='h-1/6 gap-6 items-center justify-between flex'>
				<div className='left-10'>
					<Button variant={'link'} onClick={() => handleReturn()}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
						</svg>
					</Button>
				</div>
				<div className='border-8 dark:border-slate-900 flex justify-between gap-8 items-center'>
					<img className='min-w-[24px] h-12 w-12 rounded-full overflow-hidden' src={(player1Info && player1Info.avatar) ? player1Info.avatar : userInfo?.avatar }></img>
					<SmallHeading className='text-lg dark:text-amber-400'>
						{ player1Info ? player1Info.userNameLoc : userInfo?.userNameLoc }
					</SmallHeading>
				</div>
				<div className='border-8 dark:border-slate-900'>
					<Button>
						{player1Score}
					</Button>
				</div>
				<div>
					<Button className='focus:outline-none' variant='ghost' onClick={handlePause}>
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z' />
						</svg>
					</Button>
					{ opponent === 'bot' ? <Button className='focus:outline-none' variant='ghost' onClick={() => handleReset()}>
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3' />
						</svg>
					</Button> : null }
				</div>
				<div className='border-8 dark:border-slate-900'>
					<Button>
						{player2Score}
					</Button>
				</div>
				<div className='border-8 dark:border-slate-900 flex justify-between gap-8 items-center'>
					<img className='min-w-[24px] h-12 w-12 rounded-full overflow-hidden' src={player2Info ? player2Info.avatar : (opponent === 'bot') ? 'https://www.svgrepo.com/show/303599/spider-man-4-logo.svg' : 'https://fastly.picsum.photos/id/294/200/200.jpg?hmac=tSuqBbGGNYqgxQ-6KO7-wxq8B4m3GbZqQAbr7tNApz8'}></img>
					<SmallHeading className='text-lg dark:text-amber-400'>
						{ player2Info ? player2Info.userNameLoc : (opponent === 'bot') ? 'Bot' : 'Player 2' }
					</SmallHeading>
				</div>
			</div>
			<div className='w-full h-5/6 border-t-2 border-l-2 border-r-2 border-slate-700 black:border-slate-200 bg-slate-400 dark:text-slate-200 text-center'>
				{(opponent === 'bot') ? <Pong userId={userId} difficulty={difficulty} isGameActive={gameActive} isReset={reset} isGameOver={isGameOver} player1Score={player1Score} opponentScore={player2Score} includeBoost={includeBoost} setIsGameOver={setIsGameOver} playerPoint={playerPoint} opponentPoint={opponentPoint} setReset={setReset}/> : null }
				{(opponent === 'player') ? <PvP setIsPause={setIsPause} isPause={isPause} isActive={isActive} setIsActive={setIsActive} includeBoost={includeBoost} isReset={reset} setReset={setReset} userId={userId} isGameActive={gameActive} selectedDifficulty={difficulty ? difficulty : 0} isGameOver={isGameOver} player1Score={player1Score} player2Score={player2Score} setIsGameOver={setIsGameOver} setState={setState} playerPoint={playerPoint} opponentPoint={opponentPoint} setPlayer1Id={setPlayer1Id} setPlayer2Id={setPlayer2Id} setPlayer1Info={setPlayer1Info} setPlayer2Info={setPlayer2Info} setPlayer1Score={setPlayer1Score} setPlayer2Score={setPlayer2Score} game={game} setGameRef={setGameRef} matchIsFound={matchIsFound} /> : null}
			</div>
		</div>
	)

}

export default Game