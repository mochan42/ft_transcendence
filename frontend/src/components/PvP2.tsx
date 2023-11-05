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
		paddle1Y: 0,
		paddle2Y: 0,
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
		if (game && game.status == 'request') {
			console.log("I am the receiver of a game challenge\n");
			setGameObj(game);
			gameObj.status = 'playing';
			setMatchFound(true);
			setDifficulty(gameObj.difficulty)
			setItsDifficult((gameObj.difficulty + 2) * 2)
			setPlayer1Id(gameObj.player1.toString());
			setPlayer2Id(gameObj.player2.toString());
			setIncludeBoost(true);
			if (socket != null) {
				socket.emit('matchFound', gameObj);
			}
			// gameObj.isBoost = false;
			// gameObj.gameMaker = gameObj.player1;
			// gameObj.paddle1Speed = 10;
			// gameObj.paddle2Speed = 100;
			// gameObj.paddle1Dir = 0;
			// gameObj.paddle2Dir = 0;
			// gameObj.speedX = 1;
			// gameObj.speedY = 1;

			// console.log("\n game obj: ", gameObj, "\n");
		}
	},);

	useEffect(() => { // In case we get matched by Backend queue
		if (socket != null) {
			socket.on('matchFound', (data: GameType) => {
				console.log("A matchFound event is triggered for users ", data.player1, " and ", data.player2, "\n\n Current userId: ", userId);
				if (userId && (userId == data.player1.toString() || userId == data.player2.toString())) {
					console.log("That is us! :D \n")
					setGameObj(data);
					setPlayer1Id(data.player1.toString());
					setPlayer2Id(data.player2.toString());
					setMatchFound(true);
					setGameMaker(true);
					console.log("We have a gameObj: ", data);
				}
			})
		}
	},);

	
	//  movePaddles]);



	// GAME LOGIC STARTS HERE
	
	const newY1 = (Y: number) => {
		if (gameObj.paddle1Dir && gameObj.paddle1Speed) {
			let newY = Y + gameObj.paddle1Dir * gameObj.paddle1Speed;
			// Ensure the paddle stays within the valid range
			if (newY < 0) {
				newY = 0;
			} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
				newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
			}
			return newY;
		}
		return (Y);
	}

	const newY2 = (Y: number) => {
		if (gameObj.paddle2Dir && gameObj.paddle2Speed) {
			let newY = Y + gameObj.paddle2Dir * gameObj.paddle2Speed;
			// Ensure the paddle stays within the valid range
			if (newY < 0) {
				newY = 0;
			} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
				newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
			}
			return newY;
		}
		return (Y);
	}

	const gameLoop = () => {
		setGameObj((prevGameObj) => {
			const newGameObj = { ...prevGameObj }; // Create a copy to avoid modifying the original state
			if (userId === newGameObj.gameMaker) {
			  newGameObj.paddle1Y = newY1(newGameObj.paddle1Y);
			} else {
			  newGameObj.paddle2Y = newY2(newGameObj.paddle2Y);
			}
			if (newGameObj.score1 >= 10 || newGameObj.score2 >= 10) {
			  setIsGameOver(true);
			  newGameObj.status = 'finished';
			}
			return newGameObj;
		  });
			handleKeyDown
			handleKeyUp
			requestAnimationFrame(gameLoop);
		// if (!isGameOver && gameObj) {
		// 	// console.log(gameObj);
		// 	if (userId == gameObj.gameMaker) {
		// 		gameObj.paddle1Y = newY1(gameObj.paddle1Y);
		// 	} else {
		// 		gameObj.paddle2Y = newY2(gameObj.paddle2Y);
		// 	}
		// 	if (gameObj.score1 >= 10 || gameObj.score2 >= 10) {
		// 		setIsGameOver(true);
		// 		gameObj.status = 'finished';
		// 	}
	};
	
	
	// Track player key input
	// useEffect(() => {
	// 	handleKeyDown;
	// 	handleKeyUp;
	// }, [gameObj.ballX, gameObj.ballY, gameObj.speedX, gameObj.speedY, gameObj.paddle1Y, gameObj.paddle2Y]);

	const handleKeyDown = (event: KeyboardEvent) => {
		setGameObj((prevGameObj) => {
			const newGameObj = { ...prevGameObj }; // Create a copy to avoid modifying the original state
			if (event.key === 'w' || event.key === 'ArrowUp') {
				event.preventDefault();
				if (newGameObj.gameMaker == userId) {
					newGameObj.paddle1Dir = -1; // Move paddle up
				} else {
					newGameObj.paddle2Dir = -1;; // Move paddle up
				}
				console.log(userId,  " is going up!\n", newGameObj.paddle1Dir);
			} else if (event.key === 's' || event.key === 'ArrowDown') {
				event.preventDefault();
				if (newGameObj.gameMaker == userId) {
					newGameObj.paddle1Dir = 1; // Move paddle up
				} else {
					newGameObj.paddle2Dir = 1; // Move paddle up
				}
				console.log(userId,  " is going down!\n", newGameObj.paddle1Dir);
			}
			return newGameObj;
		});
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
	},);

	useEffect(() => {
		// Start the game loop
		if (!isGameOver && gameObj.id > 0) {
			requestAnimationFrame(gameLoop);
		}
	}, [isGameOver, gameObj]);

	return (
		<div className="relative w-full h-full" ref={PvPRef}>
			<Paddle yPosition={gameObj.paddle1Y} paddleHeight={paddleLengths[difficulty]} style={{ left: 0 }}/>
			<Paddle yPosition={gameObj.paddle2Y} paddleHeight={paddleLengths[difficulty]} style={{ right: 0 }}/>
			<div className="relative bg-slate-900">
				<Ball  xPosition={gameObj.ballX} yPosition={gameObj.ballY} />
			</div>
			{gameObj.includeBoost && !gameObj.isBoost ? <Boost x={gameObj.boostX} y={gameObj.boostY} width={boostWidth} height={boostWidth} /> : null}
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