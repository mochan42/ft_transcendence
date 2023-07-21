import React, { useState, useEffect, useRef } from 'react'
import Ball from './Ball'
import Paddle from './Paddle'

interface PongProps {
	difficulty: number;
	isGameActive: boolean;
	isReset: boolean;
	playerPoint: () => void;
	botPoint: () => void;
	setReset: (boolean: boolean) => void;
  }

const Pong: React.FC<PongProps> = ({ difficulty, isGameActive, isReset, playerPoint, botPoint, setReset }) => {

	const itsdifficult = (difficulty + 2) * 2
	const PongRef = useRef<HTMLDivElement>(null);
	const paddleLenghts = [250, 200, 100, 80, 50]
	const [speedX, setSpeedX] = useState(-itsdifficult);
	const [speedY, setSpeedY] = useState(-itsdifficult);
	const [playerPaddleDirection, setPlayerPaddleDirection] = useState<number>(0)
	const [paddleSpeed, setPaddleSpeed] = useState(18 - (difficulty * 2));
	const [leftPaddleY, setLeftPaddleY] = useState(0);
	const [rightPaddleY, setRightPaddleY] = useState(0);
	var startX = 50;
	var startY = 50;
	if (PongRef.current) {
		startX = (PongRef.current?.clientWidth - 30) / 2 // The 30 here is somewhat a random value, but seems to be neccessary to calculate the exact location the screen ends.
		startY = (PongRef.current?.clientHeight - 30) / 2
	}
	const [ballX, setBallX] = useState(startX);
	const [ballY, setBallY] = useState(startY);

	const checkCollision = () => {
		// Ball boundaries
		const ballLeft = ballX;
		const ballRight = ballX + 8; // Ball width is 8 pixels
		const ballCenter = ballY + 4; // half the diameter = radius
	  
		// Left Paddle boundaries
		const leftPaddleRight = 10; // Paddle width is 10 pixels
		const leftPaddleTop = leftPaddleY;
		const leftPaddleBottom = leftPaddleY + paddleLenghts[difficulty];
	  
		// Container boundaries
		const containerTop = 0;
		var containerBottom = 800;

		// Right Paddle boundaries
		var rightPaddleLeft = 500;
		if (PongRef.current) {
			rightPaddleLeft = PongRef.current?.clientWidth - 30;// Paddle width is 10 pixels
			containerBottom = PongRef.current?.clientHeight - 30;
		}
		const rightPaddleTop = rightPaddleY;
		const rightPaddleBottom = rightPaddleY + paddleLenghts[difficulty];

		// Calculate relative position of ball within the left paddle
		const relativePosition = (ballCenter - leftPaddleTop) / (paddleLenghts[difficulty]);

		// Map relative position to an angle between -45 and +45 degrees
		const mappedAngle = (relativePosition * 45) / 2;
	  
		// Calculate the new Y-velocity component based on the mapped angle
		const newSpeedY = speedX < 0 ? -itsdifficult * Math.sin((mappedAngle * Math.PI) / 180) : itsdifficult * Math.sin((mappedAngle * Math.PI) / 180);
	
		const randomnessFactor = (difficulty / 4); // You can adjust this value to control the amount of randomness
    	const randomSpeedY = newSpeedY * (1 + Math.random() * randomnessFactor);

		// Check collision with left paddle
		// Check whether Bot made a point
		// I'll include a margin of 5 pixels on the outer side of the paddle
		if (ballLeft <= (leftPaddleRight + itsdifficult + 4) &&
			ballLeft >= (leftPaddleRight - (itsdifficult + 4)) &&
			speedX < 0 &&
			ballCenter >= leftPaddleTop &&
			ballCenter <= leftPaddleBottom
		) {
			console.log('Bounce condition met');
			setSpeedX(-speedX)
			setSpeedY(randomSpeedY);
		} else if (ballRight < leftPaddleRight && !isReset) {
			console.log('Point for bot');
			botPoint();
			setSpeedX(-speedX)
			setReset(true);
		}

		// Check collision with right paddle
		// Check whether Player made a point
		if (ballRight >= (rightPaddleLeft - (itsdifficult + 4)) &&
			ballRight <= (rightPaddleLeft + itsdifficult + 4) &&
			speedX > 0 &&
			ballCenter >= rightPaddleTop && 
			ballCenter <= rightPaddleBottom
		) {
			console.log('Bounce condition met');
			setSpeedX(-speedX)
			setSpeedY(newSpeedY);
		} else if (ballLeft > (rightPaddleLeft) && !isReset) {
			console.log('Point for Player');
			playerPoint();
			setReset(true);
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

	useEffect(() => {
		const gameLoop = setInterval(() => {
			if (isGameActive) {
				movePaddles();
				moveBall();
				checkCollision();
			}
			if (isReset) {
				setBallX(startX);
				setBallY(startY);
				setReset(false);
			}
			// console.log('ballLeft: ', ballX, 'ballRight: ', ballX + 8, 'SpeedX: ', speedX, 'SpeedY: ', speedY, 'isReset: ', isReset)
		}, 1000 / 60);

		return () => clearInterval(gameLoop);
	}, [isGameActive, isReset, difficulty, ballX, ballY, speedX, speedY, leftPaddleY, checkCollision]);

	// Track player key input
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'w' || event.key === 'ArrowUp') {
				setPlayerPaddleDirection(-1); // Move paddle up
			} else if (event.key === 's' || event.key === 'ArrowDown') {
				setPlayerPaddleDirection(1); // Move paddle down
			}
		};
	  
		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.key === 'w' || event.key === 'ArrowUp' || event.key === 's' || event.key === 'ArrowDown') {
				setPlayerPaddleDirection(0); // Stop paddle movement
			}
		};
	  
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
	  
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, [isGameActive, isReset, ballX, ballY, speedX, speedY, leftPaddleY]);

	const movePaddles = () => {
		setLeftPaddleY((prevY) => {
		  let newY = prevY + playerPaddleDirection * paddleSpeed;
	  
		  // Ensure the paddle stays within the valid range
		  if (newY < 0) {
			newY = 0;
		  } else if (newY > (startY * 2) + 30 - paddleLenghts[difficulty]) {
			newY = (startY * 2) + 30 - paddleLenghts[difficulty]; // Maximum paddle height is div height - paddle length
		  }
	  
		  return newY;
		});
	};

	const moveBall = () => {
		setBallX((prevX) => prevX + speedX);
		setBallY((prevY) => prevY + speedY);
	};
	
	

	return (
		<div className="relative w-full h-full" ref={PongRef}>
			<Paddle yPosition={leftPaddleY} paddleHeight={paddleLenghts[difficulty]} style={{ left: 0 }}/>
			<Paddle yPosition={rightPaddleY} paddleHeight={paddleLenghts[difficulty]} style={{ right: 0 }}/>
			<div className="relative">
    			<Ball xPosition={ballX} yPosition={ballY} />
    		</div>
		</div>
	)
}

export default Pong



