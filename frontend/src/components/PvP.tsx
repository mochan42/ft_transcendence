import React, { useState, useRef, useEffect } from 'react'
import VictoryLoss from './VictoryLoss';
import Boost from './Boost';
import Ball from './Ball';
import Paddle from './Paddle';
import { GameType, User, paddle1Type } from '../types';
import MatchMaking from './MatchMaking';
import { getSocket } from '../utils/socketService';


interface PvPProps {
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

const PvP: React.FC<PvPProps> = ({ playerPoint, opponentPoint, setReset, userId, player1Score, player2Score, isGameActive, isReset, isGameOver, selectedDifficulty, setIsGameOver, setState, setPlayer1Id, setPlayer2Id, setPlayer1Score, setPlayer2Score, setPlayer1Info, setPlayer2Info, game}) => {

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
		paddle1Speed: 30,
		paddle2Speed: 30,
		paddle1Dir: 1,
		paddle2Dir: 1,
		speedX: 5,
		speedY: 5,
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
	const [speedX, setSpeedX] = useState(-20); // dynamic
	const [speedY, setSpeedY] = useState(-20); // dynamic
	const [paddle1Speed, setPaddle1Speed] = useState((difficulty + 1) * 2); // dynamic
	const [paddle2Speed, setPaddle2Speed] = useState((difficulty + 1) * 2); // dynamic
	const [boostStartX, setBoostStartX] = useState(200);
	const [boostStartY, setBoostStartY] = useState(200);

	// useEffect(() => {
	socket.on('updatePaddle2', (data: paddle1Type) => {
		if (data.gameId == gameObj.id) {
			setPaddle2Y(data.paddlePos);
		}
	})
	// });

	const checkCollision = () => {
		var margin = (((difficulty + 2) * 2) * 3)
		if (isBoost && includeBoost) {
			margin = margin * 2.5
		}
		// Ball boundaries
		const ballLeft = ballX;
		const ballRight = ballX + 8; // Ball width is 8 pixels
		const ballCenter = ballY + 4; // half the diameter = radius
	  
		// Left Paddle boundaries
		const leftPaddleRight = 10; // Paddle width is 10 pixels
		const leftPaddleTop = paddle1Y;
		const leftPaddleBottom = paddle1Y + paddleLengths[difficulty];
	  
		// Container boundaries
		const containerTop = 0;
		var containerBottom = 800;

		// Right Paddle boundaries
		var rightPaddleLeft = 500;
		if (PvPRef.current) {
			rightPaddleLeft = PvPRef.current?.clientWidth - 30;// Paddle width is 10 pixels
			containerBottom = PvPRef.current?.clientHeight - 30;
		}
		const rightPaddleTop = paddle2Y;
		const rightPaddleBottom = paddle2Y + paddleLengths[difficulty];

		// Calculate relative position of ball within the left paddle
		const relativePosition = (ballCenter - leftPaddleTop) / (paddleLengths[difficulty]);

		// Map relative position to an angle between -45 and +45 degrees
		const mappedAngle = (relativePosition * 45) / 2;
	  
		// Calculate the new Y-velocity component based on the mapped angle
		const newSpeedY = speedX < 0 ? -((difficulty + 2) * 2) * Math.sin((mappedAngle * Math.PI) / 180) : ((difficulty + 2) * 2) * Math.sin((mappedAngle * Math.PI) / 180);
	
		const randomnessFactor = (difficulty / 4); // You can adjust this value to control the amount of randomness
    	const randomSpeedY = newSpeedY * (1 + Math.random() * randomnessFactor);

		// Check collision with left paddle
		// Check whether Bot made a point
		if (ballLeft <= (leftPaddleRight + margin) &&
			ballLeft >= (leftPaddleRight - margin) &&
			speedX < 0 &&
			ballCenter >= leftPaddleTop - ((difficulty + 2) * 2) &&
			ballCenter <= leftPaddleBottom + ((difficulty + 2) * 2)
		) {
			if (isBoost) {
				setSpeedX(prevSpeedX => prevSpeedX * 0.66);
				setIsBoost(false);
			}
			setSpeedX(-speedX * 1.2)
			setSpeedY(randomSpeedY * 1.2);
		} else if (ballRight < leftPaddleRight && !isReset) {
			opponentPoint();
			setReset(true);
			if (isBoost) {
				setSpeedX(prevSpeedX => prevSpeedX * 0.66);
				setIsBoost(false);
			}
			setSpeedX(-speedX)
		}

		// Check collision with right paddle
		// Check whether Player made a point
		if (ballRight >= (rightPaddleLeft - margin) &&
			ballRight <= (rightPaddleLeft + margin) &&
			speedX > 0 &&
			ballCenter >= rightPaddleTop - ((difficulty + 2) * 2) && 
			ballCenter <= rightPaddleBottom + ((difficulty + 2) * 2)
		) {
			if (isBoost) {
				setSpeedX(prevSpeedX => prevSpeedX * 0.66);
				setIsBoost(false);
			}
			setSpeedX(-speedX * 0.82)
			setSpeedY(newSpeedY * 0.82);
		} else if (ballLeft > (rightPaddleLeft) && !isReset) {
			playerPoint();
			setPlayer2Score(player2Score + 1);
			setReset(true);
			if (isBoost) {
				setSpeedX(prevSpeedX => prevSpeedX * 0.66);
				setIsBoost(false);
			}
			setSpeedX(-speedX)
		}
		
		// collision with container top
		if (ballY < 0 && speedY < 0){
			setSpeedY(-speedY)
		}
		
		// collision with container bottom
		if (ballY > containerBottom && speedY > 0) {
			setSpeedY(-speedY)
		}
	};
	
	const moveBall = () => {
		if (PvPRef.current) {
			startX = (PvPRef.current?.clientWidth - 30) / 2
			startY = (PvPRef.current?.clientHeight - 30) / 2
		}
		
		const boostEndX = boostStartX + boostWidth;
		const boostEndY = boostStartY + boostWidth;
		
		const ballCenterX = ballX + 4;
		const ballCenterY = ballY + 4;

		const isInBoostRegion =
		ballCenterX >= boostStartX &&
		ballCenterX <= boostEndX &&
		ballCenterY >= boostStartY &&
		ballCenterY <= boostEndY;

		// setIsBoost(isInBoostRegion)
		// Ball is inside the Boost region, increase speed by 50%
		if (isInBoostRegion && !isBoost && includeBoost) {
			setSpeedX(prevSpeedX => prevSpeedX * 2.5);
			setSpeedY(prevSpeedY => prevSpeedY * 2.5);
			setIsBoost(true);
		}
		setBallX((prevX) => {
			let newX = prevX + speedX;
			const updateBallX = {
				gameId: gameObj.id,
				ballPos: newX,
			}
			socket.emit('updateBallX', updateBallX)
			return newX;
		});
		setBallY((prevY) => {
			let newY = prevY + speedY;
			const updateBallY = {
				gameId: gameObj.id,
				ballPos: newY,
			}
			socket.emit('updateBallY', updateBallY)
			return newY;
		});		
	};

	const movePaddles = () => {
		setPaddle1Y((prevY) => {
			let newY = prevY + paddle1Dir * paddle1Speed;
		
			// Ensure the paddle stays within the valid range
			if (newY < 0) {
				newY = 0;
			} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
				newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
			}
			const updatePaddle = {
				gameId: gameObj.id,
				paddlePos: newY,
			}
			socket.emit('updatePaddle1', updatePaddle)
			return newY;
		})
	}

	useEffect(() => {
		const gameLoop = setInterval(() => {
			if (isGameActive && !isGameOver) {
				movePaddles();
				moveBall();
				checkCollision();
				// const tmp = {
				// 	paddle1Pos: paddle1Y,
				// 	ballX: ballX,
				// 	ballY: ballY,
				// 	boostX: boostX,
				// 	boostY: boostY,
				// 	// score1: player1Score,
				// 	// score2: player2Score,
				// 	// isGameActive: isGameActive,
				// 	// isGameOver: isGameOver,
				// } 
				// socket.emit('updateMatchClient', tmp);
			}
			if (player1Score >= 10 || player2Score >= 10) {
				setIsGameOver(true);
			}
			if (isReset && !isGameOver) {
				setBallX(startX);
				setBallY(startY);
				setSpeedX(Math.sign(speedX) * (difficulty + 2) * 2);
				setSpeedY(Math.sign(speedY) * (difficulty + 2) * 2);
				setReset(false);
			}
			if (isBoost && includeBoost) {
				const minX = startX / 2;
				const maxX = startX + minX;
				const minY = startY / 2;
				const maxY = startY + minY;

				// Calculate the random coordinates for the Boost region
				const newBoostX = minX + Math.random() * (maxX - minX);
				const newBoostY = minY + Math.random() * (maxY - minY);

				setBoostStartX(newBoostX);
				setBoostStartY(newBoostY);
			}
		}, 10);

		return () => clearInterval(gameLoop);
	}, [isGameActive, isGameOver, includeBoost, startX, startY, isBoost, boostStartX, boostStartY, difficulty, player2Score, player1Score, ballX, ballY, speedX, speedY, paddle1Y, paddle2Y, checkCollision, moveBall, movePaddles]);

	useEffect(() => {
		if (socket != null) {
			socket.on('matchFound', (data: GameType) => {
				console.log("A matchFound event is triggered for users ", data.player1, " and ", data.player2, "\n\n Current userId: ", userId);
				if (userId && userId == data.player1.toString()) {
					console.log("That is us! :D \n")
					setGameObj(data);
					setPlayer1Id(data.player1.toString());
					setPlayer2Id(data.player2.toString());
					setMatchFound(true);
					setDifficulty(data.difficulty);
					setIncludeBoost(data.includeBoost);
					setPaddle1Speed(20);
					setSpeedX(20);
					setSpeedY(20);
				}
			})
		}
	});

	// // // GAME LOGIC STARTS HERE

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
	}, [isGameActive, isReset, isBoost, ballX, ballY, speedX, speedY, paddle1Y]);

	return (
		<div className="relative w-full h-full" ref={PvPRef}>
			<Paddle yPosition={paddle1Y} paddleHeight={paddleLengths[difficulty]} style={{ left: 0 }}/>
			<Paddle yPosition={paddle2Y} paddleHeight={paddleLengths[difficulty]} style={{ right: 0 }}/>
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