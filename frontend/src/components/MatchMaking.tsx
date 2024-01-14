import React, { useEffect, useState } from 'react'
import { User, GameType } from "../types";
import UserCard from './UserCard';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../data/Global';
import { getUserById } from './ChatConversation';

interface MatchMakingProps {
	userId: string | null | undefined;
	socket: any;
	difficulty: number;
	includeBoost: boolean;
	opponentId: number;
	setOpponentId: (number: number) => void;
	setPlayer1Id: (string: string) => void;
	setPlayer2Id: (string: string) => void;
	setMatchFound: (boolean: boolean) => void;
	setGameObj: (GameType: GameType) => void;
	gameObj: GameType | undefined;
	setState?: React.Dispatch<React.SetStateAction<'select' | 'bot' | 'player'>>;
}

const MatchMaking: React.FC<MatchMakingProps> = ({ gameObj, setGameObj, setMatchFound, socket, userId, setState, difficulty, includeBoost, opponentId, setOpponentId, setPlayer1Id, setPlayer2Id }) => {
	
	const [searchingForMatch, setSearchingForMatch] = useState<boolean | undefined>(undefined);
	const [matched, setMatched] = useState<boolean>(false);
	const [oId, setOId] = useState<string>("1");
	const navigate = useNavigate();
	const [leaveAbort, setLeaveAbort] = useState<'leave' | 'abort'>('leave');
	let game: GameType = {
		id: -1,
		player1: userId ? +userId : -1,
		player2: -1,
		difficulty: difficulty,
		includeBoost: includeBoost,
		status: 'request',
		score1: 0,
		score2: 0,
		paddle1Y: 0,
		paddle2Y: 0,
		boostX: 0,
		boostY: 0,
		ballX: 0,
		ballY: 0,
	}

	useEffect(() => {
		if (socket !== null) {
			socket.on('MatchFound', async (data: GameType) => {
				if (userId && (data.player1.toString() || data.player2.toString())) {
					console.log("\n\n\nwhat happens here??\n\n")
					setGameObj(data);
					setMatchFound(true);
				}
			});
		}
	});

	useEffect(() => {
		if (socket != null) {
			if (!matched) {
				socket.once('invitedToMatch', (data: any) => {
					if (userId == data.player2) {
						setGameObj(data);
						setPlayer1Id(data.player2);
						setPlayer2Id(data.player1);
						console.log("Invitation received! from", data.player1, "\n\n");
						setOpponentId(data.player1);
						setOId(data.player1.toString());
						console.log("Match invitation received! \n\n", data);
						setMatched(true);
						setSearchingForMatch(false);
					}
				});
			}
		} else {
			console.log("Missing socket\n");
		}
	});

	useEffect(() => {
		if (socket != null) {
			if (!matched) {
				socket.once('matchedToGame', (data: any) => {
					if (userId == data.player1) {
						setGameObj(data);
						setPlayer1Id(data.player1);
						setPlayer2Id(data.player2);
						console.log("Matched to game !", data.player1, "   ", data.player2, "\n\n");
						setOpponentId(data.player2);
						setOId(data.player2.toString());
						setLeaveAbort('abort');
						// setMatched(true);
						// setSearchingForMatch(false);
					}
				});
			}
		} else {
			console.log("Missing socket\n");
		}
	});

	function acceptGame() {
		if (userId == gameObj?.player1) {
			console.log("I am player 1");
		} else if (userId == gameObj?.player2) {
			console.log("I am player 2");
			if (gameObj) {
				gameObj.status = 'found'
				if (socket != null) {
					socket.emit('acceptMatch', gameObj);
					console.log("Accepting match: ", gameObj);
					navigate("/game/pvp");
				}
				// socket.emit('gameLoop', gameObj);
			}
		}
		// setMatchFound(true);
	  };

	return (
		<div className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-400 bg-opacity-70'>
			<div className='flex rounded min-w-[350px] h-4/5 w-3/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 text-slate-200'>
				<div className='h-full w-1/2 border-r-4 border-amber-400 z-0'>
					<div className={'h-4/5'} >
						<UserCard userId={userId} />
					</div>
				</div>
				<div className={'border-l-4 border-amber-400 h-full w-1/2 z-0'}>
					<div className={'h-4/5'} >
						<UserCard userId={oId} />
					</div>
				</div>
				<button
					onClick={() => {
						if (searchingForMatch === undefined) {
							setSearchingForMatch(true);
							if (socket !== null) {
								console.log("\nSearching for Opponent - Sending requestMatch event to Backend!\n With difficulty: ", game.difficulty, " and booster: ", game.includeBoost, "\n");
								setPlayer1Id(userId ? userId.toString() : "0")
								socket.emit('requestMatch', game);
							}
						} else if (searchingForMatch === true) {
							if (leaveAbort == 'leave'){
								socket.emit('leaveQueue');
								console.log("Left game queue!")
								setState ? setState('select') : navigate("/game");
							}
						} else if (matched) {
							console.log("Accepting Game!");
							acceptGame();
						}
					}}
					className='border-8 border-slate-200 text-slate-900 h-12 rounded-md absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-200'>
					{searchingForMatch === undefined ? 'Search for opponent' : null}
					{(searchingForMatch === true && leaveAbort == 'leave') ? 'Cancel' : null}
					{(searchingForMatch === true && leaveAbort == 'abort') ? '. . .' : null}
					{matched === true ? 'Start Match' : null}
				</button>
				<div className={'bg-slate-900 border-4 border-amber-400 rounded-full h-32 w-32 text-white text-xl font-extrabold flex-cols justify-around text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center'}>
					{searchingForMatch === undefined ? <img className={'max-h-28 max-w-28'} src='https://media3.giphy.com/media/vl4kjjLdRxjU9x1z36/giphy.webp?cid=ecf05e476eupiqtr7dj6gjr0sm4pdhb1ahor8x8n7fdu2dj1&ep=v1_stickers_search&rid=giphy.webp&ct=s' />
						: null}
					{searchingForMatch === true ? <img className={'max-h-32 max-w-32 rounded-full'} src='https://media3.giphy.com/media/LOo1VDVtrKG3hsNdxy/200.webp?cid=ecf05e47l5fbfbccar0h7wsl9e6b833ahvul8abt3igzb1y9&ep=v1_stickers_search&rid=200.webp&ct=s' alt="waiting screen" />
						: null}
					{matched === true ? <img className={'max-h-32 max-w-32 rounded-full'} src="https://media3.giphy.com/media/SwUwZMPpgwHNQGIjI7/200w.webp?cid=ecf05e479jqxlumq0r4dolafw2l2f1dw6p8px3dy7z1hqqxv&ep=v1_stickers_search&rid=200w.webp&ct=s" alt='crossing swords' />
						: null}
				</div>
			</div>
		</div>
	)
}

export default MatchMaking