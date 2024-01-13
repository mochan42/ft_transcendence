import { Button } from './ui/Button';
import { getSocket } from '../utils/socketService';
import { GameType } from '../types';

interface StartGameProps {
    userId: string | null | undefined;
    setStartGame: (boolen: boolean) => void;
	game: GameType | null;
}

const StartGame: React.FC<StartGameProps> = ({ userId, setStartGame, game }) => {

	const socket = getSocket(userId);
	
	function letsGo() {
		setStartGame(true)
		console.log("StartGame of game Id: ", game?.id);
		socket.emit('gameLoop', game);
	}
    
    return (
        <div className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 bg-opacity-70'>
			<div className='rounded h-1/2 w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-slate-900 dark:bg-slate-400'>
				<div className="h-full p-4 flex-col text-center justify-between space-y-4">
                    <div className='h-4/5 w-full space-y-4 text-center flex justify-center'>
						<h1 className='text-slate-200'>
							Are you ready to start the game?
						</h1>
					</div>
					<div>
						<Button variant='default' onClick={() => letsGo()}>
							Let's Go!
						</Button>
					</div>
                </div>
            </div>
        </div>
    )
}

export default StartGame;