import { Game, User } from '../types';
import { Button } from './ui/Button';
import { getSocket } from '../utils/socketService';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUser } from '../data/ChatData';

interface GameChallengeProps{
    game: Game | undefined,
    userId: string | null,
    setChallenge: (boolean: boolean) => void;
}

const GameChallenge: React.FC<GameChallengeProps> = ({ userId,  game, setChallenge }) => {

    const socket = getSocket(userId);
	const navigate = useNavigate();
	const [opponent, setOpponent] = useState< User >()

    function acceptGame() {
		if (game != undefined && game != null) {
			const newGame: Game = {
				... game,
				status: 'found',
			}
			if (socket != null) {
				socket.emit('acceptMatch', newGame);
			}
		}
		setChallenge(false);
		navigate('/')
    }

    function declineGame() {
		if (game != undefined && game != null) {
			const newGame: Game = {
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
			} else {
				console.log("Game object isn't defined, can't load game object.\n");
			}
		})()
	},);

    return (
        <div className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 bg-opacity-70'>
			<div className='rounded h-1/4 w-1/4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-slate-900 dark:bg-slate-400'>
				<div className="h-full p-4 flex-col text-center justify-between space-y-4">
                    <div className='h-4/5 w-full space-y-4 text-center flex justify-center'>
						<h1 className='text-slate-200'>
							You were challenged to a Game of Pong by {opponent ? opponent.userNameLoc : "Bot"}
						</h1>
					</div>
					<div>
						<Button variant='default' onClick={() => acceptGame()}>
							Check out the Challenger!
						</Button>
					</div>
                </div>
            </div>
        </div>
    )
}

export default GameChallenge