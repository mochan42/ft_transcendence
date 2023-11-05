import React, { useState, useRef, useEffect } from 'react'
import VictoryLoss from './VictoryLoss';
import Boost from './Boost';
import Ball from './Ball';
import Paddle from './Paddle';
import { GameType, User, ballXType, ballYType, paddle1Type, paddle2Type, update } from '../types';
import MatchMaking from './MatchMaking';
import { getSocket } from '../utils/socketService';
import { number } from 'prop-types';


interface PvP_2Props {
	userId: string | null | undefined;
	player1Score: number;
	player2Score: number;
	isGameOver: boolean;
	selectedDifficulty: number;
	isGameActive: boolean;
	isReset: boolean;
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
}

const PvP_2: React.FC<PvP_2Props> = ({ playerPoint, opponentPoint, setReset, userId, player1Score, player2Score, isGameActive, isReset, isGameOver, setIsGameOver, setState, setPlayer1Id, setPlayer2Id, setPlayer1Score, setPlayer2Score, setPlayer1Info, setPlayer2Info, game}) => {

	const GameTmp: GameType = {
		id: -1,
		player1: -1,
		player2: -1,
		difficulty: 0,
		includeBoost: false,
		status: 'aborted',
		score1: 0,
		score2: 0,
		paddle1Y: 0,
		paddle2Y: 0,
		boostX: 200,
		boostY: 200,
		ballX: 300,
		ballY: 300,		
		gameMaker: -1,
		paddle1Speed: 15,
		paddle2Speed: 15,
		paddle1Dir: 1,
		paddle2Dir: 1,
		speedX: 1,
		speedY: 1,
	};


	const socket = getSocket(userId);
	const [gameObj, setGameObj] = useState<GameType>(GameTmp);
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
	const [difficulty, setDifficulty] = useState(0);
	const [boostX, setBoostX] = useState(200); // dynamic
	const [boostY, setBoostY] = useState(200); // dynamic
	const [paddle1Y, setPaddle1Y] = useState(0); // dynamic
	const [paddle2Y, setPaddle2Y] = useState(0); // dynamic
	const [paddle2Dir, setPaddle2Dir] = useState<number>(0); // dynamic
	const [paddle2Speed, setPaddle2Speed] = useState((difficulty + 1) * 2); // dynamic
	
	const movePaddles = () => {
		setPaddle2Y((prevY) => {
			let newY = prevY + paddle2Dir * paddle2Speed;
			if (newY < 0) {
				newY = 0;
			} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
				newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
			}
			const updatePaddle = {
				gameId: gameObj.id,
				paddlePos: newY,
			}
			socket.emit('updatePaddle2', updatePaddle)
			return newY;
		})
	}

	useEffect(() => {
		const readLoop = setInterval(() => {
			socket.on('updatePaddle1', (data: paddle1Type) => {
				if (data.gameId == gameObj.id) {
					setPaddle1Y(data.paddlePos);
				}
			})
			socket.on('updateBallX', (data: ballXType) => {
				if (data.gameId == gameObj.id) {
					setBallX(data.ballPos);
				}
			})
			socket.on('updateBallY', (data: ballYType) => {
				if (data.gameId == gameObj.id) {
					setBallY(data.ballPos);
				}
			})
			socket.off('updatePaddle1');
			socket.off('updateBallX');
			socket.off('updateBallY');
		}, 10);
	return () => clearInterval(readLoop);
	})

	useEffect(() => {
		const gameLoop = setInterval(() => {
			if (isGameActive && !isGameOver) {
				movePaddles();
			}
			if (player1Score >= 10 || player2Score >= 10) {
				setIsGameOver(true);
			}
		}, 10);

		return () => clearInterval(gameLoop);
	}, [isGameActive, isGameOver, includeBoost, startX, startY, difficulty, player2Score, player1Score, ballX, ballY, paddle1Y, paddle2Y, movePaddles]);

	useEffect(() => {
		if (socket != null) {
			socket.on('matchFound', (data: GameType) => {
				console.log("A matchFound event is triggered for users ", data.player1, " and ", data.player2, "\n\n Current userId: ", userId);
				if (userId && userId == data.player2.toString()) {
					console.log("That is us! :D \n")
					setGameObj(data);
					setPlayer1Id(data.player1.toString());
					setPlayer2Id(data.player2.toString());
					setPaddle2Speed(20);
					setMatchFound(true);
					setDifficulty(data.difficulty);
					setIncludeBoost(data.includeBoost);
				}
			})
		}
	});

	// Track player key input
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'w' || event.key === 'ArrowUp') {
				event.preventDefault();
				setPaddle2Dir(-1); // Move paddle up
				console.log("Going up!\n");
			} else if (event.key === 's' || event.key === 'ArrowDown') {
				event.preventDefault();
				setPaddle2Dir(1); // Move paddle down
				console.log("Going down!\n");
			}
		};
	  
		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.key === 'w' || event.key === 'ArrowUp' || event.key === 's' || event.key === 'ArrowDown') {
				setPaddle2Dir(0); // Stop paddle movement
			}
		};
	  
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
	  
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, [isGameActive, isReset, ballX, ballY, paddle1Y]);

	return (
		<div className="relative w-full h-full" ref={PvPRef}>
			<Paddle yPosition={paddle1Y} paddleHeight={paddleLengths[difficulty]} style={{ left: 0 }}/>
			<Paddle yPosition={paddle2Y} paddleHeight={paddleLengths[difficulty]} style={{ right: 0 }}/>
			<div className="relative bg-slate-900">
				<Ball  xPosition={ballX} yPosition={ballY} />
			</div>
			{includeBoost && !gameObj.isBoost ? <Boost x={boostX} y={boostY} width={boostWidth} height={boostWidth} /> : null}
			{isGameOver ? (
				<div className="absolute inset-0 bg-black bg-opacity-80">
						<VictoryLoss userId={userId} isVictory={player1Score == 1} difficulty={difficulty} />
					</div>
				) : null
			}
			</div>
	)
}

export default PvP_2