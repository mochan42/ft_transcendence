import React, { useEffect, useState } from 'react'
import { User, Game, GameMap } from "../types";
import { Button } from './ui/Button';
import UserCard from './UserCard';
import axios from 'axios';

interface MatchMakingProps {
	userId: string | undefined | null;
	socket: any;
	difficulty: number;
	includeBoost: boolean;
	setMatchFound: (boolean: boolean) => void;
	setState: React.Dispatch<React.SetStateAction<'select' | 'bot' | 'player'>>;
}

const MatchMaking:React.FC<MatchMakingProps> =({ setMatchFound, socket, userId, setState, difficulty, includeBoost}) => {
	const [foundMatch, setFoundMatch] = useState< boolean | undefined >(undefined);
	const [opponentInfo, setOpponentInfo] = useState< User | null >(null);
	const url_info = 'https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev/pong/users/';
	const MatchMaking = 'MatchMaking';

	if (userId) {
		let game: Game = {
			player1: +userId,
			player2: -1,
			difficulty: difficulty,
			isBoost: includeBoost,
			status: 'request'
		}
	}
	// async function fetchOpponentInfo(id: number) {
	// 	try {
	// 	  const response = await axios.get<User>(url_info + id);
	// 	  if (response.status === 200) {
	// 		setOpponentInfo(response.data);
	// 		console.log('Received Opponent Info: ', response.data);
	// 	  }
	// 	} catch (error) {
	// 	  console.log('Error fetching opponent infos', error);
	// 	}
	//   }

	useEffect(() => {
		if (socket !== null) {
			socket.on('foundMatch', (data: boolean) => {
				setFoundMatch(data);
			});
			socket.on('foundOpponent', (data: number) => {
				//fetchOpponentInfo(data);
			});
		}
	});

	return (
		<div className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-400 bg-opacity-70'>
			<div className='flex rounded min-w-[350px] h-4/5 w-3/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 text-slate-200'>
				<div className='h-full w-1/2 border-r-4 border-amber-400 z-0'>
					<div className={'h-4/5'} >
						<UserCard userId={userId}/>
					</div>
				</div>
				<div>
					<button onClick={() => setMatchFound(true)}>
						Select target
					</button>
				</div>
				<div className={'border-l-4 border-amber-400 h-full w-1/2 z-0'}>
					<div className={'h-4/5'} >
						<UserCard userId={opponentInfo?.id}/>
					</div>
				</div>
				<button 
					onClick={() => {
						if (foundMatch === undefined) {
							setFoundMatch(false);
							if (socket !== null) {
								// socket.emit('requestMatch', game);
							}
						} else if (foundMatch === false) {
							setState('select');
						} else {
							setMatchFound(true);
						}
					}}
					className='border-8 border-slate-200 text-slate-900 h-12 rounded-md absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-200'>
					{foundMatch === undefined ? 'Search for opponent' : null}
					{foundMatch === false ? 'Cancel' : null}
					{foundMatch ? 'Start Match' : null}
				</button>
				<div className={'bg-slate-900 border-4 border-amber-400 rounded-full h-32 w-32 text-white text-xl font-extrabold flex-cols justify-around text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center'}>
					{foundMatch === undefined ? <img className={'max-h-28 max-w-28'} src='https://media3.giphy.com/media/vl4kjjLdRxjU9x1z36/giphy.webp?cid=ecf05e476eupiqtr7dj6gjr0sm4pdhb1ahor8x8n7fdu2dj1&ep=v1_stickers_search&rid=giphy.webp&ct=s'/>
						: null}
					{foundMatch === true ? <img className={'max-h-32 max-w-32 rounded-full'} src='https://media3.giphy.com/media/SwUwZMPpgwHNQGIjI7/200w.webp?cid=ecf05e479jqxlumq0r4dolafw2l2f1dw6p8px3dy7z1hqqxv&ep=v1_stickers_search&rid=200w.webp&ct=s' alt="crossed swords"/>
						: null}
					{(foundMatch === false && foundMatch != undefined) ? <img className={'max-h-32 max-w-32 rounded-full'} src="https://media3.giphy.com/media/LOo1VDVtrKG3hsNdxy/200.webp?cid=ecf05e47l5fbfbccar0h7wsl9e6b833ahvul8abt3igzb1y9&ep=v1_stickers_search&rid=200.webp&ct=s" alt='waiting screen'/>
						: null}
				</div>
			</div>
		</div>
	)
}

export default MatchMaking