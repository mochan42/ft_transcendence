import React, { useState, useRef, useEffect } from 'react'
import VictoryLoss from './VictoryLoss';
import Boost from './Boost';
import Ball from './Ball';
import Paddle from './Paddle';
import { GameType, User } from '../types';
import MatchMaking from './MatchMaking';
import { getSocket } from '../utils/socketService';


interface PvPProps {
	userId: string | null | undefined;
	player1Score: number;
	player2Score: number;
	isGameOver: boolean;
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

const PvP: React.FC<PvPProps> = ({ userId, player1Score, player2Score, isGameOver, setIsGameOver, setState, setPlayer1Id, setPlayer2Id, setPlayer1Score, setPlayer2Score, setPlayer1Info, setPlayer2Info, game}) => {

	
	const GameTmp: GameType = {
		id: -1,
		player1: -1,
		player2: -1,
		difficulty: 0,
		isBoost: false,
		status: 'aborted',
		score1: 0,
		score2: 0,
		paddle1Y: 300,
		paddle2Y: 200,
		boostX: 200,
		boostY: 200,
		ballX: 300,
		ballY: 300,
	  };


	const socket = getSocket(userId);
	const [gameObj, setGameObj] = useState<GameType>(GameTmp)
	const [difficulty, setDifficulty] = useState(0);
	const [itsDifficult, setItsDifficult] = useState(4);
	const [gameMaker, setGameMaker] = useState(false);
	const [opponentId, setOpponentId] = useState(-1);
	const [ballX, setBallX] = useState<number>(400); // dynamic
	const [ballY, setBallY] = useState<number>(400); // dynamic
	const [matchFound, setMatchFound] = useState< true | false | undefined >(false); // static
	const PvPRef = useRef<HTMLDivElement>(null);
	const paddleLengths = [200, 150, 100, 80, 50] // static
	const [isBoost, setIsBoost] = useState(false); // dynamic
	const [includeBoost, setIncludeBoost] = useState(false);
	const boostWidth = 80; //static
	const [boostX, setBoostX] = useState(200); // dynamic
	const [boostY, setBoostY] = useState(200); // dynamic
	const [leftPaddleY, setLeftPaddleY] = useState(0); // dynamic
	const [rightPaddleY, setRightPaddleY] = useState(0); // dynamic
	const [player1PaddleDirection, setPlayer1PaddleDirection] = useState<number>(0); // dynamic
	const [player2PaddleDirection, setPlayer2PaddleDirection] = useState<number>(0); // dynamic
	const [speedX, setSpeedX] = useState(-(itsDifficult)); // dynamic
	const [speedY, setSpeedY] = useState(-(itsDifficult)); // dynamic
	const [player1PaddleSpeed, setPlayerPaddleSpeed] = useState((difficulty + 1) * 2); // dynamic
	const [player2PaddleSpeed, setopponentPaddleSpeed] = useState((difficulty + 1) * 2); // dynamic
	var startX = 50; // static
	var startY = 50; // static
	if (PvPRef.current) { // static
		startX = (PvPRef.current?.clientWidth - 30) / 2 // The 30 here is somewhat a random value, but seems to be neccessary to calculate the exact location the screen ends.
		startY = (PvPRef.current?.clientHeight - 30) / 2
	}

	useEffect(() => { // Case that we accepted a Game Challenge
		if (game && game.status == 'found') {
			setGameObj(game);
			console.log("Game in game/pvp\n");
			if (socket != null) {
				socket.emit('matchFound', game);
			}
			console.log("The game can start! \n");
			setMatchFound(true);
			game.status = 'playing';
			
		}
		if (gameObj) {
			console.log("Game object in game/pvp\n")
			setDifficulty(gameObj.difficulty)
			setItsDifficult((difficulty + 2) * 2)
			if (userId && gameObj.player1.toString() == userId) {
				setGameMaker(true);
			}
			setPlayer1Id(gameObj.player1.toString());
			setPlayer2Id(gameObj.player2.toString());
			if (gameObj.isBoost) {
				setIncludeBoost(gameObj.isBoost);
			}
		}
	},[]);

	useEffect(() => { // In case we get matched by Backend queue
		if (socket != null) {
			socket.on('matchFound', (data: GameType) => {
				console.log("The game may start\n\n\n\n");
				if (userId && (+userId == data.player1 || +userId == data.player2)) {
					setPlayer1Id(data.player1.toString());
					setPlayer2Id(data.player2.toString());
					setMatchFound(true);
				}
			})
		}
	},[matchFound]);

	
	//  movePaddles]);



	// GAME LOGIC STARTS HERE
	
	const gameLoop = () => {
		if (!isGameOver) {
			if (gameMaker) {
				setLeftPaddleY((prevY) => {
					let newY = prevY + player1PaddleDirection * player1PaddleSpeed;
					// Ensure the paddle stays within the valid range
					if (newY < 0) {
						newY = 0;
					} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
						newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
					}
					gameObj.paddle1Y = newY;
					return newY;
				})
			} else {
				setRightPaddleY((prevY) => {
					let newY = prevY + player2PaddleDirection * player2PaddleSpeed;
					// Ensure the paddle stays within the valid range
					if (newY < 0) {
						newY = 0;
					} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
						newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
					}
					gameObj.paddle2Y = newY;
					return newY;
				})
			}
			// movePaddles();
			if (player1Score >= 10 || player2Score >= 10) {
				setIsGameOver(true);
			}
			requestAnimationFrame(gameLoop);
		}
		console.log(rightPaddleY, " ", player2PaddleDirection, " ", player2PaddleSpeed, "\n");
	};
	
	
	// Track player key input
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'w' || event.key === 'ArrowUp') {
			event.preventDefault();
			console.log(userId,  " is going up!\n");
			if (gameMaker) {
				setPlayer1PaddleDirection(-1); // Move paddle up
			} else {
				setPlayer2PaddleDirection(-1); // Move paddle up
			}
		} else if (event.key === 's' || event.key === 'ArrowDown') {
			event.preventDefault();
			console.log(userId,  " is going down!\n");
			if (gameMaker) {
				setPlayer1PaddleDirection(1); // Move paddle up
			} else {
				setPlayer2PaddleDirection(1); // Move paddle up
			}
		}
	};

	const handleKeyUp = (event: KeyboardEvent) => {
		if (event.key === 'w' || event.key === 'ArrowUp' || event.key === 's' || event.key === 'ArrowDown') {
			if (gameMaker) {
				setPlayer1PaddleDirection(0); // Stop paddle movement
			} else {
				setPlayer2PaddleDirection(0);
			}
		}
	};


	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
	
		return () => {
		  document.removeEventListener('keydown', handleKeyDown);
		  document.removeEventListener('keyup', handleKeyUp);
		};
	}, [gameMaker]);

	useEffect(() => {
		// Start the game loop
		if (!isGameOver) {
			requestAnimationFrame(gameLoop);
		}
	}, [isGameOver]);

	return (
		<div className="relative w-full h-full" ref={PvPRef}>
			<Paddle yPosition={leftPaddleY} paddleHeight={paddleLengths[difficulty]} style={{ left: 0 }}/>
			<Paddle yPosition={rightPaddleY} paddleHeight={paddleLengths[difficulty]} style={{ right: 0 }}/>
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
			{!matchFound ? <MatchMaking difficulty={difficulty} includeBoost={includeBoost} socket={socket} setMatchFound={setMatchFound} userId={userId} setState={setState} setOpponentId={setOpponentId} /> : null }
		</div>
	)
}

export default PvP