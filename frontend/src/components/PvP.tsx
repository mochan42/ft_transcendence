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
		paddle1Speed: 10,
		paddle2Speed: 10,
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

	const movePaddles = () => {
		if (gameMaker) {
			setPaddle1Y((prevY) => {
				let newY = prevY + paddle1Dir * paddle1Speed;
				// Ensure the paddle stays within the valid range
				if (newY < 0) {
				newY = 0;
				} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
				newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
				}
				if (prevY != newY) {
					const tmp: GameType = {
						...gameObj,
						paddle1Y: newY,
					}
					console.log("changed from: ", prevY, " to ", newY);
					socket.emit('updateMatchClient', tmp);
				}
				return newY;
			})
		} else {
			setPaddle2Y((prevY) => {
				let newY = prevY + paddle2Dir * paddle2Speed;
				// Ensure the paddle stays within the valid range
				if (newY < 0) {
				  newY = 0;
				} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
				  newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
				}
				if (prevY != newY) {
					const tmp: GameType = {
						...gameObj,
						paddle2Y: newY,
					}
					console.log("changed from: ", prevY, " to ", newY);
					socket.emit('updateMatchClient', tmp);
					console.log("reaching me!\n\n");
				}
				return newY;
			})
		}
	};
	
	useEffect (() => {
		const gameLoop = setInterval(() => {
			if (socket != null) {
				socket.on('updateMatch', (game: GameType) => {
					if (userId == game.player1.toString() || userId == game.player2.toString()) {
						console.log("Match Update received", game.paddle1Y);
						setGameObj(game);
						// setBallX(game.ballX);
						// setBallY(game.ballY);
						// setBoostX(game.boostX);
						// setBoostY(game.boostY);
						setPaddle1Y(game.paddle1Y);
						setPaddle2Y(game.paddle2Y);
						// setPlayer1Score(game.score1);
					}
				})
				socket.off('updateMatch', (() => {}));
			}
		}, 1000 / 2);
		return () => clearInterval(gameLoop);
	});

	useEffect(() => {
		// const gameLoop = setInterval(() => {
			movePaddles();
			console.log("Running\n");
			// setTimeout(() => {
			// }, 200)
			// moveBall();
			// checkCollision();
			
		// }, 1000 / 200);
		// return () => clearInterval(gameLoop);
	}, [paddle1Dir, paddle2Dir]);

	useEffect(() => {
		if (socket != null) {
			socket.on('matchFound', (data: GameType) => {
				console.log("A matchFound event is triggered for users ", data.player1, " and ", data.player2, "\n\n Current userId: ", userId);
				if (userId && userId == data.player1.toString()) {
					console.log("That is us! :D \n")
					setPlayer1Id(data.player1.toString());
					setPlayer2Id(data.player2.toString());
					setPaddle1Speed(10);
					setPaddle2Speed(10);
					setMatchFound(true);
					setGameMaker(true);
					
					const tmp: GameType = {
						...data,
						score1: player1Score,
						score2: player2Score,
						gameMaker: +userId,
						status: 'playing',
						paddle2Speed: 10,
						paddle1Speed: 10,
					}
					console.log("\nFirst Player: Sending updated event info: ", tmp);
					socket.emit('updateMatchClient', tmp);
				} else if (userId && userId == data.player2.toString()) {
					console.log("That is us! :D \n")
					setPlayer1Id(data.player1.toString());
					setPlayer2Id(data.player2.toString());
					setMatchFound(true);
				}
			})
		}
	});


	// // GAME LOGIC STARTS HERE
	
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'w' || event.key === 'ArrowUp') {
			event.preventDefault();
			if (gameMaker) {
				setPaddle1Dir(-1);
			} else {
				setPaddle2Dir(-1);
			}
		} else if (event.key === 's' || event.key === 'ArrowDown') {
			event.preventDefault();
			if (gameMaker) {
				setPaddle1Dir(1);
			} else {
				setPaddle2Dir(1);
			}
		}
	};
	
	const handleKeyUp = (event: KeyboardEvent) => {
		if (event.key === 'w' || event.key === 'ArrowUp' || event.key === 's' || event.key === 'ArrowDown') {
			if (gameMaker) {
				setPaddle1Dir(0); // Stop paddle movement
			} else {
				setPaddle2Dir(0); // Stop paddle movement
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