import React, { useState, useRef, useEffect } from 'react'
import VictoryLoss from './VictoryLoss';
import Boost from './Boost';
import Ball from './Ball';
import Paddle from './Paddle';
import { GameType, User } from '../types';
import MatchMaking from './MatchMaking';
import { getSocket } from '../utils/socketService';
import throttle from 'lodash/throttle';



interface PvPProps {
	userId: string | null | undefined;
	player1Score: number;
	player2Score: number;
	isGameOver: boolean;
	selectedDifficulty: number;
	isGameActive: boolean;
	setIsGameOver: (boolean: boolean) => void;
	setState?: React.Dispatch<React.SetStateAction<'select' | 'bot' | 'player'>>;
	setPlayer1Id: (string: string) => void;
	setPlayer2Id: (string: string) => void;
	setPlayer1Info: (User: User) => void;
	setPlayer2Info: (User: User) => void;
	setPlayer1Score: (number: number) => void;
	setPlayer2Score: (number: number) => void;
	game?: GameType;
}

const PvP: React.FC<PvPProps> = ({ userId, player1Score, player2Score, isGameActive, isGameOver, selectedDifficulty, setIsGameOver, setState, setPlayer1Id, setPlayer2Id, setPlayer1Score, setPlayer2Score, setPlayer1Info, setPlayer2Info, game}) => {

	
	const GameTmp: GameType = {
		id: -1,
		player1: -1,
		player2: -1,
		difficulty: selectedDifficulty,
		includeBoost: false,
		status: 'aborted',
		score1: 0,
		score2: 0,
		paddle1Y: 200,
		paddle2Y: 200,
		boostX: 200,
		boostY: 200,
		ballX: 300,
		ballY: 300,		
		gameMaker: -1,
		paddle1Speed: 1,
		paddle2Speed: 1,
		paddle1Dir: 1,
		paddle2Dir: 1,
		speedX: 1,
		speedY: 1,
	};
	
	
	const socket = getSocket(userId);
	const [gameObj, setGameObj] = useState<GameType>(GameTmp);
	
	const [gameMaker, setGameMaker] = useState(false);
	const [opponentId, setOpponentId] = useState(-1);
	const [difficulty, setDifficulty] = useState(0);
	const [itsDifficult, setItsDifficult] = useState(4);
	const [matchFound, setMatchFound] = useState< true | false | undefined >(false); // static
	const PvPRef = useRef<HTMLDivElement>(null);
	const paddleLengths = [200, 150, 100, 80, 50] // static
	const [includeBoost, setIncludeBoost] = useState(false);
	const boostWidth = 80; //static
	var startX = 50; // static
	var startY = 50; // static
	if (PvPRef.current) { // static
		startX = (PvPRef.current?.clientWidth - 30) / 2 // The 30 here is somewhat a random value, but seems to be neccessary to calculate the exact location the screen ends.
		startY = (PvPRef.current?.clientHeight - 30) / 2
	}
	const [ballX, setBallX] = useState<number>(400); // dynamic
	const [ballY, setBallY] = useState<number>(400); // dynamic
	const [isBoost, setIsBoost] = useState(false); // dynamic
	const [boostX, setBoostX] = useState(200); // dynamic
	const [boostY, setBoostY] = useState(200); // dynamic
	const [paddle1Y, setPaddle1Y] = useState(0); // dynamic
	const [paddle2Y, setPaddle2Y] = useState(0); // dynamic
	const [paddle1Dir, setPaddle1Dir] = useState<number>(0); // dynamic
	const [paddle2Dir, setPaddle2Dir] = useState<number>(0); // dynamic
	const [speedX, setSpeedX] = useState(-(itsDifficult)); // dynamic
	const [speedY, setSpeedY] = useState(-(itsDifficult)); // dynamic
	const [paddle1Speed, setPaddle1Speed] = useState((difficulty + 1) * 2); // dynamic
	const [paddle2Speed, setPaddle2Speed] = useState((difficulty + 1) * 2); // dynamic

	const calculateNewPaddLePos = (paddle: number, speed: number, paddleDir: number): number => {
		const  newPos = paddle + (paddleDir * speed);
		if (newPos < 0) {
			return 0;
		}
		if (newPos > (startY * 2) + 30 - paddleLengths[difficulty]) {
			return (startY * 2) + 30 - paddleLengths[difficulty]; 
		}
		return newPos;
	}

	const movePaddlePlayer1 = (event: KeyboardEvent) => {
		if (userId != gameObj.player1.toString()) {
			return ;
		}
		if (event.key !== 'w' && event.key !== 'ArrowUp' && event.key !== 's' && event.key !== 'ArrowDown') {
			return ;
		}
		let moveDirection = 1;
		let paddle1Y = gameObj.paddle1Y;
		
		if (event.key === 'w' || event.key === 'ArrowUp') {
			moveDirection = -1;
		}

		paddle1Y = calculateNewPaddLePos(paddle1Y, 5, moveDirection);
		
		const updateGame : GameType = {
			...gameObj,
			paddle1Y: paddle1Y,
		}
		socket.timeout(200).emit('updateMatchClient', updateGame);
	};

	const movePaddlePlayer2 = (event: KeyboardEvent) => {
		if (userId != gameObj.player2.toString()) {
			return ;
		}
		if (event.key !== 'w' && event.key !== 'ArrowUp' && event.key !== 's' && event.key !== 'ArrowDown') {
			return ;
		}
		
		let moveDirection = 1;
		let paddle2Y = gameObj.paddle2Y;
		
		if (event.key === 'w' || event.key === 'ArrowUp') {
			moveDirection = -1;
		}

		paddle2Y = calculateNewPaddLePos(paddle2Y, 2, moveDirection);

		const updateGame : GameType = {
			...gameObj,
			paddle2Y: paddle2Y,
		}
		socket.timeout(200).emit('updateMatchClient', updateGame);
	};
		
	const throttledMovePaddlePlayer1 = throttle(movePaddlePlayer1, 16);
	const throttledMovePaddlePlayer2 = throttle(movePaddlePlayer2, 16);

	// -------------------------- GAME SETUP ------------------------------------------------------

	useEffect(() => {
		document.addEventListener('keydown', throttledMovePaddlePlayer1);

		return () => {
			document.removeEventListener('keydown', throttledMovePaddlePlayer1);
		};
	}, [gameObj]);

	useEffect(() => {
		document.addEventListener('keydown', throttledMovePaddlePlayer2);

		return () => {
			document.removeEventListener('keydown', throttledMovePaddlePlayer2);
		};
	}, [gameObj]);
	
	useEffect(() => {
		if (socket != null) {
			socket.on('matchFound', (data: GameType) => {
				console.log("A matchFound event is triggered for users ", data.player1, " and ", data.player2, "\n\n Current userId: ", userId);
				if (userId && userId == data.player1.toString()) {
					setPlayer1Id(data.player1.toString());
					setPlayer2Id(data.player2.toString());
					setMatchFound(true);
					setGameMaker(true);
					
					const tmp: GameType = {
						...data,
						score1: player1Score,
						score2: player2Score,
						gameMaker: +userId,
						status: 'playing',
					}
					socket.emit('updateMatchClient', tmp);
				} else if (userId && userId == data.player2.toString()) {
					setPlayer1Id(data.player1.toString());
					setPlayer2Id(data.player2.toString());
					setMatchFound(true);
				}
			});

			socket.on('updateMatch', (currentGame: GameType) => {
				if (userId == currentGame.player1.toString() || userId == currentGame.player2.toString()) {
					setGameObj(currentGame);
				}
			});
		}
	});

	// // GAME LOGIC STARTS HERE

	return (
		<div className="relative w-full h-full" ref={PvPRef}>
			<Paddle yPosition={gameObj.paddle1Y} paddleHeight={paddleLengths[difficulty]} style={{ left: 0 }}/>
			<Paddle yPosition={gameObj.paddle2Y} paddleHeight={paddleLengths[difficulty]} style={{ right: 0 }}/>
			<div className="relative bg-slate-900">
				<Ball  xPosition={ballX} yPosition={ballY} />
			</div>
			{includeBoost && !isBoost ? <Boost x={boostX} y={boostY} width={boostWidth} height={boostWidth} /> : null}
			{isGameOver ? (
				<div className="absolute inset-0 bg-black bg-opacity-80">
						<VictoryLoss userId={userId} isVictory={player1Score == 1} difficulty={difficulty} />
					</div>
				) : null
			}
			{!matchFound ? <MatchMaking setGameObj={setGameObj} difficulty={difficulty} includeBoost={includeBoost} socket={socket} setMatchFound={setMatchFound} userId={userId} setState={setState} setOpponentId={setOpponentId} /> : null }
		</div>
	)
}

export default PvP