import React, { useState, useEffect, useRef } from 'react'
import Ball from './Ball'
import Paddle from './Paddle'
import { Button } from './ui/Button';


const Pong: React.FC = () => {

	const speedX = -1
	const speedY = -1
	const [ballSpeedX, setBallSpeedX] = useState(speedX);
	const [ballSpeedY, setBallSpeedY] = useState(speedY);
	const [ballX, setBallX] = useState(20);
	const [ballY, setBallY] = useState(100);
	const [paddleSpeed, setPaddleSpeed] = useState(6);
	const [leftPaddleY, setLeftPaddleY] = useState(0);
	const [rightPaddleY, setRightPaddleY] = useState(0);
	const [leftScore, setLeftScore] = useState(0);
	const [rightScore, setRightScore] = useState(0);
	const PongRef = useRef<HTMLDivElement>(null);
	const [difficultyLevel, setDifficultyLevel] = useState<number>(0)
	const paddleLenghts = [180, 120, 80]
	const [changeX, setChangeX] = useState(false)

	useEffect(() => {
		const gameLoop = setInterval(() => {
			moveBall();
			checkCollision();
		}, 1000 / 60);

		return () => clearInterval(gameLoop);
	}, [ballX, ballY, ballSpeedX, ballSpeedY]);

	const moveBall = () => {
		// console.log('ballX here: ', ballX, 'ballSpeedX: ', ballSpeedX)
		setBallX((prevX) => prevX + ballSpeedX);
		setBallY((prevY) => prevY + ballSpeedY);
	  };

	const checkCollision = () => {
		// Ball boundaries
		const ballLeft = ballX;
		const ballRight = ballX + 8; // Ball width is 8 pixels
		const ballTop = ballY;
		const ballBottom = ballY + 8; // Ball height is 8 pixels
	  
		// Left Paddle boundaries
		const leftPaddleLeft = 0;
		const leftPaddleRight = 10; // Paddle width is 10 pixels
		const leftPaddleTop = leftPaddleY;
		const leftPaddleBottom = leftPaddleY + paddleLenghts[difficultyLevel];
	  
		// Check collision with left paddle
		if (ballLeft == leftPaddleRight) {
			setBallSpeedX(-speedX)
		}
	};

	return (
		<div className="relative w-full h-full">
			<Paddle yPosition={leftPaddleY} paddleHeight={paddleLenghts[difficultyLevel]} style={{ left: 0 }}/>
			<Paddle yPosition={rightPaddleY} paddleHeight={paddleLenghts[difficultyLevel]} style={{ right: 0 }}/>
			<div className="relative">
    			<Ball xPosition={ballX} yPosition={ballY} />
    		</div>
		</div>
	)
}

export default Pong



