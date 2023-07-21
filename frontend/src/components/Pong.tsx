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

	
	const PongRef = useRef<HTMLDivElement>(null);
	const [difficultyLevel, setDifficultyLevel] = useState<number>(difficulty)
	const paddleLenghts = [180, 120, 80, 40, 20, 10]
	const [speedX, setSpeedX] = useState((difficulty + 1) * 3);
	const [speedY, setSpeedY] = useState((difficulty + 1) * 3);
	const [ballSpeedX, setBallSpeedX] = useState(speedX);
	const [ballSpeedY, setBallSpeedY] = useState(speedY);
	const [playerPaddleDirection, setPlayerPaddleDirection] = useState<number>(0)
	const [paddleSpeed, setPaddleSpeed] = useState(6);
	const [leftPaddleY, setLeftPaddleY] = useState(0);
	const [rightPaddleY, setRightPaddleY] = useState(0);
	var startX = 0;
	var startY = 0;
	if (PongRef.current) {
		startX = (PongRef.current?.clientWidth - 30) / 2
		startY = (PongRef.current?.clientHeight - 30) / 2
	}
	const [ballX, setBallX] = useState(startX);
	const [ballY, setBallY] = useState(startY);
	
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
		}, 1000 / 60);

		return () => clearInterval(gameLoop);
	}, [isGameActive, isReset, ballX, ballY, ballSpeedX, ballSpeedY, speedX, speedY, leftPaddleY]);

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
	  }, [isGameActive, isReset, ballX, ballY, ballSpeedX, ballSpeedY, speedX, speedY, leftPaddleY]);

	const movePaddles = () => {
		setLeftPaddleY((prevY) => {
		  // Calculate the new paddle position
		  let newY = prevY + playerPaddleDirection * paddleSpeed;
	  
		  // Ensure the paddle stays within the valid range
		  if (newY < 0) {
			newY = 0; // Minimum paddle height is 0
		  } else if (newY > (startY * 2) + 30 - paddleLenghts[difficultyLevel]) {
			newY = (startY * 2) + 30 - paddleLenghts[difficultyLevel]; // Maximum paddle height is div height - paddle length
		  }
	  
		  return newY;
		});
	};

	const moveBall = () => {
		setBallX((prevX) => prevX + ballSpeedX);
		setBallY((prevY) => prevY + ballSpeedY);
	  };

	const checkCollision = () => {
		// Ball boundaries
		const ballLeft = ballX;
		const ballRight = ballX + 8; // Ball width is 8 pixels
		const ballCenter = ballY + 4; // half the diameter = radius
	  
		// Left Paddle boundaries
		const leftPaddleRight = 10; // Paddle width is 10 pixels
		const leftPaddleTop = leftPaddleY;
		const leftPaddleBottom = leftPaddleY + paddleLenghts[difficultyLevel];
	  
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
		const rightPaddleBottom = rightPaddleY + paddleLenghts[difficultyLevel];


		// Check collision with left paddle
		// Check whether Bot made a point
		if (ballLeft < leftPaddleRight &&
			speedX < 0 &&
			ballCenter >= leftPaddleTop &&
			ballCenter <= leftPaddleBottom
			) {
				setBallSpeedX(-speedX)
				setSpeedX(ballSpeedX)
			} else if (ballLeft < (leftPaddleRight - 50)) {
				botPoint();
				setReset(true);
				setBallSpeedX(-speedX)
				setSpeedX(ballSpeedX)
		}

		// Check collision with right paddle
		// Check whether Player made a point
		if (ballRight > rightPaddleLeft &&
			speedX > 0 &&
			ballCenter >= rightPaddleTop && 
			ballCenter <= rightPaddleBottom
		) {
			setBallSpeedX(-speedX)
			setSpeedX(ballSpeedX)
		} else if (ballRight > (rightPaddleLeft + 50)) {
			playerPoint();
			setReset(true);
			setBallSpeedX(-speedX)
			setSpeedX(ballSpeedX)
		}
		
		if (ballY <= containerTop && speedY < 0){
			setBallSpeedY(-speedY)
			setSpeedY(ballSpeedY)
		}

		if (ballY >= containerBottom && speedY > 0) {
			setBallSpeedY(-speedY)
			setSpeedY(ballSpeedY)
		}
	};

	return (
		<div className="relative w-full h-full" ref={PongRef}>
			<Paddle yPosition={leftPaddleY} paddleHeight={paddleLenghts[difficultyLevel]} style={{ left: 0 }}/>
			<Paddle yPosition={rightPaddleY} paddleHeight={paddleLenghts[difficultyLevel]} style={{ right: 0 }}/>
			<div className="relative">
    			<Ball xPosition={ballX} yPosition={ballY} />
    		</div>
		</div>
	)
}

export default Pong



