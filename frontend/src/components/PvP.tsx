import React, { useState, useEffect, useRef } from 'react'
import VictoryLoss from './VictoryLoss';
import Boost from './Boost';
import Ball from './Ball';
import Paddle from './Paddle';
import { User } from '../types';
import MatchMaking from './MatchMaking';


interface PvPProps {
	userId: number;
	difficulty: number;
	isGameActive: boolean;
	isReset: boolean;
	playerScore: number;
	opponentScore: number;
	isGameOver: boolean;
	includeBoost: boolean;
	setIsGameOver: (boolean: boolean) => void;
	playerPoint: () => void;
	opponentPoint: () => void;
	setReset: (boolean: boolean) => void;
	setOpponentInfo: (User: User) => void;
	setState: React.Dispatch<React.SetStateAction<'select' | 'bot' | 'player'>>;
  }

const PvP: React.FC<PvPProps> = ({ userId, difficulty, isGameOver, playerScore, isReset, opponentScore, includeBoost, playerPoint, opponentPoint, setIsGameOver, setReset, setOpponentInfo, setState }) => {

	const [matchFound, setMatchFound] = useState(false);
	// const difficulty = 2;
	const itsdifficult = (difficulty + 2) * 2
	const PvPRef = useRef<HTMLDivElement>(null);
	const paddleLengths = [200, 150, 100, 80, 50]
	const opponentLengths = [50, 60, 70, 80, 90]
	const [playerScore2, setPlayerScore2] = useState(0);
	const [speedX, setSpeedX] = useState(-(itsdifficult));
	const [speedY, setSpeedY] = useState(-(itsdifficult));
	const [isBoost, setIsBoost] = useState(false);
	const [boostWidth, setBoostWidth] = useState(80);
	const [playerPaddleDirection, setPlayerPaddleDirection] = useState<number>(0);
	const [playerPaddleSpeed, setPlayerPaddleSpeed] = useState(18 - (difficulty * 2));
	const [opponentPaddleSpeed, setopponentPaddleSpeed] = useState(0.5 + (difficulty));
	const [leftPaddleY, setLeftPaddleY] = useState(0);
	const [rightPaddleY, setRightPaddleY] = useState(0);
	var startX = 50;
	var startY = 50;
	if (PvPRef.current) {
		startX = (PvPRef.current?.clientWidth - 30) / 2 // The 30 here is somewhat a random value, but seems to be neccessary to calculate the exact location the screen ends.
		startY = (PvPRef.current?.clientHeight - 30) / 2
	}
	const [boostStartX, setBoostStartX] = useState(200);
	const [boostStartY, setBoostStartY] = useState(200);
	const [ballX, setBallX] = useState(startX);
	const [ballY, setBallY] = useState(startY);
	const [lastBoost, setLastBoost] = useState<number>(Date.now);

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
	// 	var containeropponenttom = 800;

	// 	// Right Paddle boundaries
	// 	var rightPaddleLeft = 500;
	// 	if (PvPRef.current) {
	// 		rightPaddleLeft = PvPRef.current?.clientWidth - 30;// Paddle width is 10 pixels
	// 		containeropponenttom = PvPRef.current?.clientHeight - 30;
	// 	}
	// 	const rightPaddleTop = rightPaddleY;
	// 	const rightPaddleopponenttom = rightPaddleY + paddleLengths[difficulty];

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
	// 		ballCenter <= rightPaddleopponenttom + (itsdifficult)
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

	// useEffect(() => {
	// 	const gameLoop = setInterval(() => {
	// 		if (isGameActive && !isGameOver) {
	// 			movePaddles();
	// 			moveBall();
	// 			checkCollision();
	// 		}
	// 		if (playerScore >= 1 || opponentScore >= 1) {
	// 			setIsGameOver(true);
	// 		}
	// 		if (isReset && !isGameOver) {
	// 			setBallX(startX);
	// 			setBallY(startY);
	// 			setSpeedX(Math.sign(speedX) * itsdifficult);
	// 			setSpeedY(Math.sign(speedY) * itsdifficult);
	// 			setReset(false);
	// 		}
	// 		if (isBoost && includeBoost) {
	// 			const minX = startX / 2;
	// 			const maxX = startX + minX;
	// 			const minY = startY / 2;
	// 			const maxY = startY + minY;

	// 			// Calculate the random coordinates for the Boost region
	// 			const newBoostX = minX + Math.random() * (maxX - minX);
	// 			const newBoostY = minY + Math.random() * (maxY - minY);

	// 			setBoostStartX(newBoostX);
	// 			setBoostStartY(newBoostY);
	// 		}

	// 	}, 1000 / 60);

	// 	return () => clearInterval(gameLoop);
	// }, [isGameActive, isGameOver, isReset, includeBoost, startX, startY, isBoost, boostStartX, boostStartY, difficulty, playerScore2, ballX, ballY, speedX, speedY, leftPaddleY, rightPaddleY, checkCollision, moveBall, movePaddles]);

	// // Track player key input
	// useEffect(() => {
	// 	const handleKeyDown = (event: KeyboardEvent) => {
	// 		if (event.key === 'w' || event.key === 'ArrowUp') {
	// 			event.preventDefault();
	// 			setPlayerPaddleDirection(-1); // Move paddle up
	// 		} else if (event.key === 's' || event.key === 'ArrowDown') {
	// 			event.preventDefault();
	// 			setPlayerPaddleDirection(1); // Move paddle down
	// 		}
	// 	};
	  
	// 	const handleKeyUp = (event: KeyboardEvent) => {
	// 		if (event.key === 'w' || event.key === 'ArrowUp' || event.key === 's' || event.key === 'ArrowDown') {
	// 			setPlayerPaddleDirection(0); // Stop paddle movement
	// 		}
	// 	};
	  
	// 	document.addEventListener('keydown', handleKeyDown);
	// 	document.addEventListener('keyup', handleKeyUp);
	  
	// 	return () => {
	// 		document.removeEventListener('keydown', handleKeyDown);
	// 		document.removeEventListener('keyup', handleKeyUp);
	// 	};
	// }, [isGameActive, isReset, isBoost, ballX, ballY, speedX, speedY, leftPaddleY, movePaddles]);

	return (
		<div className="relative w-full h-full" ref={PvPRef}>
			{!matchFound ? <MatchMaking setMatchFound={setMatchFound} setOpponentInfo={setOpponentInfo} userId={userId} setState={setState} /> : 
			<>
				<Paddle yPosition={leftPaddleY} paddleHeight={paddleLengths[difficulty]} style={{ left: 0 }}/>
				<Paddle yPosition={rightPaddleY} paddleHeight={opponentLengths[difficulty]} style={{ right: 0 }}/>
				<div className="relative bg-slate-900">
					<Ball xPosition={ballX} yPosition={ballY} />
				</div>
				{includeBoost && !isBoost ? <Boost x={boostStartX} y={boostStartY} width={boostWidth} height={boostWidth} /> : null}
				{isGameOver ? (
					<div className="absolute inset-0 bg-black bg-opacity-80">
							<VictoryLoss userId={userId} isVictory={playerScore === 1} difficulty={difficulty} />
						</div>
					) : null
				}
			</>
			}
		</div>
	)
}

export default PvP