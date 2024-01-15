import { GameType, User } from '../types';
import { Button } from './ui/Button';
import { getSocket } from '../utils/socketService';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUser } from '../data/ChatData';
import PvP_2 from './PvP_2';
import Game_2 from './pages/Game_2';

interface GameChallengeProps{
    game: GameType | undefined,
    userId: string | null,
    setChallenge: (boolean: boolean) => void;
}

const GameChallenge: React.FC<GameChallengeProps> = ({ userId,  game, setChallenge }) => {

    const socket = getSocket(userId);
	const navigate = useNavigate();
	const [opponent, setOpponent] = useState< User|null>(null);
	const [gaming, setGaming] = useState(false);

    function acceptGame() {
		if (game != undefined && game != null) {
			const newGame: GameType = {
				... game,
				status: 'found',
			}
			if (socket != null) {
				socket.emit('acceptMatch', newGame);
				console.log("Accepting match: ", newGame);
			}
		}
		setChallenge(false);
		navigate('/game/pvp');
    }

    function declineGame() {
		if (game != undefined && game != null) {
			const newGame: GameType = {
				... game,
				status: 'aborted',
			}
			if (socket != null) {
				socket.emit('abortMatch', newGame);
			}	
		}
		setChallenge(false);
    }

	useEffect(() => {
		(async() => {
			if (game) {
				const user = await fetchUser(game.player1.toString());
				setOpponent(user);
				console.log("Found game object!\n");
			} else {
				console.log("Game object isn't defined, can't load game object.\n");
			}
		})()
	},[game]);

    return (
		<>
			<div className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 bg-opacity-70'>
				<div className='rounded h-1/2 w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-slate-900 dark:bg-slate-400'>
					<div className="h-full p-4 flex-col text-center justify-between space-y-4">
						<div className='h-4/5 w-full space-y-4 text-center flex justify-center'>
							<h1 className='text-slate-200'>
								You are challenged to play a Pong Game with {opponent ? opponent.userNameLoc : "Bot"}
							</h1>
						</div>
						<div>
							{/* <Button variant='default' onClick={() => acceptGame()}>
								Check out the Challenger!
							</Button> */}
							<Button variant='default' onClick={() => acceptGame()}>
								Accept Challenge!
							</Button>
							<Button variant='destructive' onClick={() => declineGame()}>
								Decline Challenge!
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
    )
}

export default GameChallenge