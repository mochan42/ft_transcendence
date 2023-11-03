import React, { useState, useRef, useEffect } from 'react'
import VictoryLoss from './VictoryLoss';
import Boost from './Boost';
import Ball from './Ball';
import Paddle from './Paddle';
import { Game, User } from '../types';
import MatchMaking from './MatchMaking';
import { getSocket } from '../utils/socketService';


interface PvPProps {
	userId: string | null | undefined;
	difficulty: number;
	isGameActive: boolean;
	isReset: boolean;
	player1Score: number;
	player2Score: number;
	isGameOver: boolean;
	includeBoost: boolean;
	setIsGameOver: (boolean: boolean) => void;
	setPlayer1Id: (string: string) => void;
	setPlayer2Id: (string: string) => void;
	playerPoint: () => void;
	opponentPoint: () => void;
	setReset: (boolean: boolean) => void;
	setState: React.Dispatch<React.SetStateAction<'select' | 'bot' | 'player'>>;
  }

const PvP: React.FC<PvPProps> = ({ userId, difficulty, isGameOver, player1Score, player2Score, isReset, includeBoost, playerPoint, opponentPoint, setIsGameOver, setReset, setState, setPlayer1Id, setPlayer2Id }) => {

	// const [player1PaddleDirection, setPlayer1PaddleDirection] = useState<number>(0); // dynamic
	// const [player2PaddleDirection, setPlayer2PaddleDirection] = useState<number>(0); // dynamic
	// const [speedX, setSpeedX] = useState(-(itsdifficult)); // dynamic
	// const [speedY, setSpeedY] = useState(-(itsdifficult)); // dynamic
	// const [player1PaddleSpeed, setPlayerPaddleSpeed] = useState(18 - (difficulty * 2)); // dynamic
	// const [player2PaddleSpeed, setopponentPaddleSpeed] = useState(0.5 + (difficulty)); // dynamic
	
	const socket = getSocket(userId);
	const [opponentId, setOpponentId] = useState(-1);
	const [playerScore1, setPlayerScore1] = useState(0); // dynamic
	const [playerScore2, setPlayerScore2] = useState(0); // dynamic
	const [ballX, setBallX] = useState(400); // dynamic
	const [ballY, setBallY] = useState(400); // dynamic
	const [leftPaddleY, setLeftPaddleY] = useState(10); // dynamic
	const [rightPaddleY, setRightPaddleY] = useState(0); // dynamic
	const [boostX, setBoostX] = useState(200); // dynamic
	const [boostY, setBoostY] = useState(200); // dynamic
	const [matchFound, setMatchFound] = useState< true | false | undefined >(false); // static
	const itsdifficult = (difficulty + 2) * 2 // static
	const PvPRef = useRef<HTMLDivElement>(null);
	const paddleLengths = [200, 150, 100, 80, 50] // static
	const [isBoost, setIsBoost] = useState(false); // static
	const boostWidth = 80; //static
	var startX = 50; // static
	var startY = 50; // static
	if (PvPRef.current) { // static
		startX = (PvPRef.current?.clientWidth - 30) / 2 // The 30 here is somewhat a random value, but seems to be neccessary to calculate the exact location the screen ends.
		startY = (PvPRef.current?.clientHeight - 30) / 2
	}
	
	useEffect(() => {
		if (socket !== null) {
			socket.on('matchFound', (data: Game) => {
				console.log("The game may start\n\n\n\n");
				if (userId && (+userId == data.player1 || +userId == data.player2)) {
					setPlayer2Id(data.player2.toString());
					setPlayer1Id(data.player1.toString());
					setMatchFound(true);
				}
			})
		}
	},[matchFound]);
	// 	socket.on('playerScore1', (data: number) => {
	// 		setPlayerScore1(data);
	// 	});
	// 	socket.on('playerScore2', (data: number) => {
	// 		setPlayerScore2(data);
	// 	});
	// 	socket.on('ballX', (data: number) => {
	// 		setBallX(data);
	// 	});
	// 	socket.on('ballY', (data: number) => {
	// 		setBallY(data);
	// 	});
	// 	socket.on('leftPaddleY', (data: number) => {
	// 		setLeftPaddleY(data);
	// 	});
	// 	socket.on('rightPaddleY', (data: number) => {
	// 		setRightPaddleY(data);
	// 	});
	// 	socket.on('boostX', (data: number) => {
	// 		setBoostX(data);
	// 	});
	// 	socket.on('boostY', (data: number) => {
	// 		setBoostY(data);
	// 	});
	// }

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'w' || event.key === 'ArrowUp') {
				event.preventDefault();
				if (socket !== null) {
					socket.emit("paddleMove", -1); // Move paddle up
				}
				console.log("going up\n");
			} else if (event.key === 's' || event.key === 'ArrowDown') {
				event.preventDefault();
				if (socket !== null) {
					socket.emit("paddleMove", 1); // Move paddle down
				}
				console.log("going down\n");
			}
		};
		
		document.addEventListener('keydown', handleKeyDown);
	  
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	},);


	return (
		<div className="relative w-full h-full" ref={PvPRef}>
			<Paddle yPosition={leftPaddleY} paddleHeight={paddleLengths[difficulty]} style={{ left: 0 }}/>
			<Paddle yPosition={rightPaddleY} paddleHeight={paddleLengths[difficulty]} style={{ right: 0 }}/>
			<div className="relative bg-slate-900">
				<Ball xPosition={ballX} yPosition={ballY} />
			</div>
			{includeBoost && !isBoost ? <Boost x={boostX} y={boostY} width={boostWidth} height={boostWidth} /> : null}
			{isGameOver ? (
				<div className="absolute inset-0 bg-black bg-opacity-80">
						<VictoryLoss userId={userId} isVictory={playerScore1 === 1} difficulty={difficulty} />
					</div>
				) : null
			}
			{!matchFound ? <MatchMaking difficulty={difficulty} includeBoost={includeBoost} socket={socket} setMatchFound={setMatchFound} userId={userId} setState={setState} setOpponentId={setOpponentId} /> : null }
		</div>
	)
}

export default PvP

// const [lastBoost, setLastBoost] = useState<number>(Date.now);

	// const checkCollision = () => {

	// 	var margin = (itsdifficult * 3)
	// 	if (isBoost && includeBoost) {
	// 		margin = margin * 2.5
	// 	}
	// 	// Ball boundaries
	// 	const ballLeft = ballX;
	// 	const ballRight = ballX + 8; // Ball width is 8 pixels
	// 	const ballCenter = ballY + 4; // half the diameter = radius
	  
	// 	// Left Paddle boundaries
	// 	const leftPaddleRight = 10; // Paddle width is 10 pixels
	// 	const leftPaddleTop = leftPaddleY;
	// 	const leftPaddleopponenttom = leftPaddleY + paddleLengths[difficulty];
	  
	// 	// Container boundaries
	// 	const containerTop = 0;
	// 	var containerBottom = 800;

	// 	// Right Paddle boundaries
	// 	var rightPaddleLeft = 500;
	// 	if (PvPRef.current) {
	// 		rightPaddleLeft = PvPRef.current?.clientWidth - 30;// Paddle width is 10 pixels
	// 		containerbottom = PvPRef.current?.clientHeight - 30;
	// 	}
	// 	const rightPaddleTop = rightPaddleY;
	// 	const rightPaddleOpponentBottom = rightPaddleY + paddleLengths[difficulty];

	// 	// Calculate relative position of ball within the left paddle
	// 	const relativePosition = (ballCenter - leftPaddleTop) / (paddleLengths[difficulty]);

	// 	// Map relative position to an angle between -45 and +45 degrees
	// 	const mappedAngle = (relativePosition * 45) / 2;
	  
	// 	// Calculate the new Y-velocity component based on the mapped angle
	// 	const newSpeedY = speedX < 0 ? -itsdifficult * Math.sin((mappedAngle * Math.PI) / 180) : itsdifficult * Math.sin((mappedAngle * Math.PI) / 180);
	
	// 	const randomnessFactor = (difficulty / 4); // You can adjust this value to control the amount of randomness
    // 	const randomSpeedY = newSpeedY * (1 + Math.random() * randomnessFactor);

	// 	// Check collision with left paddle
	// 	// Check whether opponent made a point
	// 	if (ballLeft <= (leftPaddleRight + margin) &&
	// 		ballLeft >= (leftPaddleRight - margin) &&
	// 		speedX < 0 &&
	// 		ballCenter >= leftPaddleTop - (itsdifficult) &&
	// 		ballCenter <= leftPaddleopponenttom + (itsdifficult)
	// 	) {
	// 		if (isBoost) {
	// 			setSpeedX(prevSpeedX => prevSpeedX * 0.66);
	// 			setIsBoost(false);
	// 		}
	// 		setSpeedX(-speedX * 1.2)
	// 		setSpeedY(randomSpeedY * 1.2);
	// 	} else if (ballRight < leftPaddleRight && !isReset) {
	// 		opponentPoint();
	// 		setReset(true);
	// 		if (isBoost) {
	// 			setSpeedX(prevSpeedX => prevSpeedX * 0.66);
	// 			setIsBoost(false);
	// 		}
	// 		setSpeedX(-speedX)
	// 	}

	// 	// Check collision with right paddle
	// 	// Check whether Player made a point
	// 	if (ballRight >= (rightPaddleLeft - margin) &&
	// 		ballRight <= (rightPaddleLeft + margin) &&
	// 		speedX > 0 &&
	// 		ballCenter >= rightPaddleTop - (itsdifficult) && 
	// 		ballCenter <= rightPaddleOpponentBottom + (itsdifficult)
	// 	) {
	// 		if (isBoost) {
	// 			setSpeedX(prevSpeedX => prevSpeedX * 0.66);
	// 			setIsBoost(false);
	// 		}
	// 		setSpeedX(-speedX * 0.82)
	// 		setSpeedY(newSpeedY * 0.82);
	// 	} else if (ballLeft > (rightPaddleLeft) && !isReset) {
	// 		playerPoint();
	// 		setPlayerScore2(playerScore2 + 1);
	// 		setReset(true);
	// 		if (isBoost) {
	// 			setSpeedX(prevSpeedX => prevSpeedX * 0.66);
	// 			setIsBoost(false);
	// 		}
	// 		setSpeedX(-speedX)
	// 	}
		
	// 	// collision with container top
	// 	if (ballY < 0 && speedY < 0){
	// 		setSpeedY(-speedY)
	// 	}
		
	// 	// collision with container opponenttom
	// 	if (ballY > containeropponenttom && speedY > 0) {
	// 		setSpeedY(-speedY)
	// 	}
	// };
	
	// const moveBall = () => {
		
	// 	if (PvPRef.current) {
	// 		startX = (PvPRef.current?.clientWidth - 30) / 2
	// 		startY = (PvPRef.current?.clientHeight - 30) / 2
	// 	}
		
	// 	const boostEndX = boostStartX + boostWidth;
	// 	const boostEndY = boostStartY + boostWidth;
		
	// 	const ballCenterX = ballX + 4;
	// 	const ballCenterY = ballY + 4;

	// 	const isInBoostRegion =
	// 	ballCenterX >= boostStartX &&
	// 	ballCenterX <= boostEndX &&
	// 	ballCenterY >= boostStartY &&
	// 	ballCenterY <= boostEndY;

	// 	// setIsBoost(isInBoostRegion)
	// 	// Ball is inside the Boost region, increase speed by 50%
	// 	if (isInBoostRegion && !isBoost && includeBoost) {
	// 		setSpeedX(prevSpeedX => prevSpeedX * 2.5);
	// 		setSpeedY(prevSpeedY => prevSpeedY * 2.5);
	// 		setIsBoost(true);
	// 	}

	// 	setBallX((prevX) => prevX + speedX);
	// 	setBallY((prevY) => prevY + speedY);
	// };

	// const movePaddles = () => {
	// 	setLeftPaddleY((prevY) => {
	// 	  let newY = prevY + playerPaddleDirection * playerPaddleSpeed;
	  
	// 	  // Ensure the paddle stays within the valid range
	// 	  if (newY < 0) {
	// 		newY = 0;
	// 	  } else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
	// 		newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
	// 	  }
	  
	// 	  return newY;
	// 	})

	// 	setRightPaddleY((prevY) => {
	// 		// Track the ball's position
	// 		const ballCenter = ballY + 4; // half the diameter = radius
		
	// 		// Calculate the difference between the current position and the target position (the ball's center)
	// 		const diff = ballCenter - (prevY + opponentLengths[difficulty] / 2);
		
	// 		// Adjust the paddle's movement speed based on difficulty (higher difficulty = faster movement)
	// 		const adjustedPaddleSpeed = opponentPaddleSpeed + difficulty;
		
	// 		// Move the paddle towards the ball's position

	// 		var newY = prevY;
	// 		if (Math.abs(diff) > (opponentLengths[difficulty] - difficulty * 18)) {
	// 			newY = prevY + Math.sign(diff) * Math.min(Math.abs(diff), adjustedPaddleSpeed);
	// 		}
		
	// 		// Ensure the paddle stays within the valid range
	// 		if (newY < 0) {
	// 		  newY = 0;
	// 		} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
	// 		  newY = (startY * 2) + 30 - paddleLengths[difficulty];
	// 		}
		
	// 		return newY;
	// 	})
	// }