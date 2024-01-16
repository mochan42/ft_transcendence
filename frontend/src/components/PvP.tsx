import React, { useState, useRef, useEffect } from 'react'
import VictoryLoss from './VictoryLoss';
import Boost from './Boost';
import Ball from './Ball';
import Paddle from './Paddle';
import { GameType, User, paddle1Type } from '../types';
import MatchMaking from './MatchMaking';
import { getSocket } from '../utils/socketService';
import { useNavigate } from 'react-router-dom';

interface PvPProps {
	isActive: boolean;
	setIsActive: (boolean: boolean) => void;
	userId: string | null | undefined;
	player1Score: number;
	player2Score: number;
	isGameOver: boolean;
	selectedDifficulty: number;
	isGameActive: boolean;
	includeBoost: boolean;
	isReset: boolean;
	setGameRef: (GameType: GameType) => void;
	playerPoint: () => void;
	opponentPoint: () => void;
	setReset: (boolen: boolean) => void;
	setIsGameOver: (boolean: boolean) => void;
	setState?: React.Dispatch<React.SetStateAction<'select' | 'bot' | 'player'>>;
	setPlayer1Id: (string: string) => void;
	setPlayer2Id: (string: string) => void;
	setPlayer1Info: (User: User) => void;
	setPlayer2Info: (User: User) => void;
	setPlayer1Score: (number: number) => void;
	setPlayer2Score: (number: number) => void;
	game?: GameType;
	matchIsFound?: boolean;
	isPause: boolean;
	setIsPause: (boolean: boolean) => void;
}

const PvP: React.FC<PvPProps> = ({ setIsPause, isPause, setGameRef, includeBoost, isActive, setIsActive, playerPoint, opponentPoint, setReset, userId, player1Score, player2Score, isGameActive, isReset, isGameOver, selectedDifficulty, setIsGameOver, setState, setPlayer1Id, setPlayer2Id, setPlayer1Score, setPlayer2Score, setPlayer1Info, setPlayer2Info, game, matchIsFound }) => {

	const socket = getSocket(userId);
	const [gameObj, setGameObj] = useState<GameType | undefined>(game ? game : undefined);
	const [startGame, setStartGame] = useState<boolean | undefined>(undefined);
	const [opponentId, setOpponentId] = useState(-1);
	const [difficulty, setDifficulty] = useState(0);
	const [matchFound, setMatchFound] = useState<true | false | undefined>(matchIsFound ? matchIsFound : false); // static
	const PvPRef = useRef<HTMLDivElement>(null);
	const paddleLengths = [200, 150, 100, 80, 50] // static
	const boostWidth = 80; //static
	var startX = 50; // static
	var startY = 50; // static
	if (PvPRef.current) { // static
		startX = (PvPRef.current?.clientWidth - 30) / 2 // The 30 here is somewhat a random value, but seems to be neccessary to calculate the exact location the screen ends.
		startY = (PvPRef.current?.clientHeight - 30) / 2
	}
	const [ballX, setBallX] = useState<number>(400); // dynamic
	const [ballY, setBallY] = useState<number>(400); // dynamic
	const [isBoost, setIsBoost] = useState<boolean | undefined>(false); // dynamic
	const [boostX, setBoostX] = useState<number>(100); // dynamic
	const [boostY, setBoostY] = useState<number>(100); // dynamic
	const [paddle1Y, setPaddle1Y] = useState(0); // dynamic
	const [paddle2Y, setPaddle2Y] = useState(0); // dynamic
	const [paddle1Dir, setPaddle1Dir] = useState<number>(0); // dynamic
	const [paddle1Speed, setPaddle1Speed] = useState(15); // dynamic
	const paddle1YRef = useRef<number>(0);
	const [abort, setAbort] = useState(false);
	const navigate = useNavigate();

	const movePaddles = () => {
		setPaddle1Y((prevY) => {
			let newY = prevY + paddle1Dir * paddle1Speed;
			// Ensure the paddle stays within the valid range
			if (newY < 0) {
				newY = 0;
			} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
				newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
			}
			paddle1YRef.current = newY;
			return newY;
		})
	}

	const handleGameUpdate = (data: GameType) => {
		setGameObj(data);
		setPaddle2Y(data.paddle2Y);
		setBallX(data.ballX);
		setBallY(data.ballY);
		setBoostX(data.boostX);
		setBoostY(data.boostY);
		setPlayer1Score(data.score1);
		setPlayer2Score(data.score2);
		setIsBoost(data.isBoost);
		if (data.status == 'finished') {
			setIsGameOver(true);
			socket.emit('saveGame', {
				id: data.id,
				player1: data.player1,
				player2: data.player2,
				difficulty: data.difficulty,
				score1: data.score1,
				score2: data.score2,
				includeBoost: data.includeBoost,
			});
			console.log("Game has ended. It was ", data.status);
		} else if (data.status == 'aborted') {
			console.log("Aborting game event read!");
			setIsGameOver(true);
			navigate("/profile");
		}
		else {
			const response = {
				player: data.player1,
				paddlePos: paddle1YRef.current,
				playerActive: isActive,
				pause: isPause,
			}
			socket.emit(`ackResponse-G${data.id}P${data.player1}`, response);
		}
	};

	useEffect(() => {
		console.log("isPause: ", isPause);
		setTimeout(() => {
			setIsPause(false);
		  }, 5100);
	}, [isPause])

	useEffect(() => {
		if (socket && !isGameOver) {
			socket.once('gameUpdate', handleGameUpdate);
		}
	});

	useEffect(() => {
		movePaddles();
	}, [paddle1Dir, paddle1Speed])

	useEffect(() => {
		if (socket != null) {
			socket.on('matchFound', (data: GameType) => {
				console.log("Match Found!", data);
				if (userId && userId == data.player1.toString()) {
					setGameObj(data);
					setGameRef(data);
					setPlayer1Id(data.player1.toString());
					setPlayer2Id(data.player2.toString());
					setDifficulty(data.difficulty);
					setMatchFound(true);
					socket.emit('gameLoop', data);
					console.log("Sending gameLoop");
				}
			});

			socket.on('updateMatch', (currentGame: GameType) => {
				if (userId == currentGame.player1.toString() || userId == currentGame.player2.toString()) {
					setGameObj(currentGame);
				}
			});
		}
		// Cleanup function
		return () => { if (socket) socket.off('matchFound'); socket.off('updateMatch'); };
	});

	// Track player key input
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'w' || event.key === 'ArrowUp') {
				event.preventDefault();
				setPaddle1Dir(-1); // Move paddle up
			} else if (event.key === 's' || event.key === 'ArrowDown') {
				event.preventDefault();
				setPaddle1Dir(1); // Move paddle down
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.key === 'w' || event.key === 'ArrowUp' || event.key === 's' || event.key === 'ArrowDown') {
				setPaddle1Dir(0); // Stop paddle movement
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	});

	useEffect(() => {
		if (socket) {
			socket.on('cancelGame', (data: GameType) => {
				setAbort(true);
			})
		}
		return () => { if (socket) socket.off('cancelGame');};
	})

	return (
		<div className="relative w-full h-full">
			<div className='flex rounded min-w-[350px] h-[600px] w-[1200px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 text-slate-200' ref={PvPRef}>
				<Paddle yPosition={paddle1Y} paddleHeight={paddleLengths[difficulty]} style={{ left: 0 }} />
				<Paddle yPosition={paddle2Y} paddleHeight={paddleLengths[difficulty]} style={{ right: 0 }} />
				<div className="relative bg-slate-900">
					<Ball xPosition={ballX} yPosition={ballY} />
				</div>
				{/* {includeBoost && !isBoost ? <Boost x={boostX} y={boostY} width={boostWidth} height={boostWidth} /> : null} */}
				{!matchFound ? <MatchMaking gameObj={gameObj} setGameObj={setGameObj} difficulty={selectedDifficulty} includeBoost={includeBoost} socket={socket} setMatchFound={setMatchFound} userId={userId} setState={setState} setOpponentId={setOpponentId} opponentId={3} setPlayer1Id={setPlayer1Id} setPlayer2Id={setPlayer2Id} /> : null}
				{isGameOver ? (
					<div className="absolute inset-0 bg-black bg-opacity-80">
						<VictoryLoss userId={userId} isVictory={gameObj ? ((gameObj?.score1 > gameObj?.score2) ? true : false) : false} difficulty={gameObj?.difficulty ? gameObj?.difficulty : 1} />
					</div>
				) : null
				}
			</div>
		</div>
	)
}

export default PvP