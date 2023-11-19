import React, { useState, useRef, useEffect } from 'react'
import VictoryLoss from './VictoryLoss';
import Boost from './Boost';
import Ball from './Ball';
import Paddle from './Paddle';
import { GameType, User, ballXType, ballYType, paddle1Type, paddle2Type, update } from '../types';
import { getSocket } from '../utils/socketService';
import StartGame from './StartGame';

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

	const socket = getSocket(userId);
	const [startGame, setStartGame] = useState(false);
	const [gameObj, setGameObj] = useState<GameType | undefined>(game);
	// const [matchFound, setMatchFound] = useState< true | false | undefined >(false); // static
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
	const [paddle2Speed, setPaddle2Speed] = useState(15); // dynamic
	const paddle2YRef = useRef<number>(0);
	
	const movePaddles = () => {
		setPaddle2Y((prevY) => {
			let newY = prevY + paddle2Dir * paddle2Speed;
			if (newY < 0) {
				newY = 0;
			} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
				newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
			}
			// if (gameObj) {
			// 	const updatePaddle = {
			// 		gameId: gameObj.id,
			// 		paddlePos: newY,
			// 	}
			// 	socket.emit('updatePaddle2', updatePaddle)
			// }
			paddle2YRef.current = newY;
			return newY;
		})
	}

	useEffect(() => {
		// This function will be called whenever the 'gameUpdate' event is emitted from the server
		const handleGameUpdate = (data: GameType, ack: (responseData: any) => void) => {
			console.log("Receiving game update!\n");
			setGameObj(data);
			setPaddle1Y(data.paddle1Y);
		//   setPaddle2Y(data.paddle2Y);
			setBallX(data.ballX);
			setBallY(data.ballY);
			setBoostX(data.boostX);
			setBoostY(data.boostY);
			
			console.log("Sending back: ", 2, " ", paddle2YRef.current);
			const response = {
				player: 2,
				paddlePos: paddle2YRef.current,
			}
			console.log("\n", response.player," ", response.paddlePos);
			ack({
				player: 2,
				paddlePos: 50
			  });
		};
		// Register the event listener
		if (socket) {
			socket.on('gameUpdate', handleGameUpdate);
		}
		
		// The clean-up function to remove the event listener when the component is unmounted or dependencies change
		return () => {
			if (socket) {
				socket.off('gameUpdate', handleGameUpdate);
			}
		};
	  }, [socket]); // The effect depends on `socket` and will re-run only if `socket` changes
	  

	useEffect(() => {
			movePaddles();
	}, [paddle2Dir, paddle2Speed])

	useEffect(() => {
		if (socket != null) {
			socket.on('matchFound', (data: GameType) => {
				console.log("A matchFound event is triggered for users ", data.player1, " and ", data.player2, "\n\n Current userId: ", userId);
				if (userId && userId == data.player2.toString()) {
					console.log("That is us! :D \n")
					setGameObj(data);
					setPlayer1Id(data.player1.toString());
					setPlayer2Id(data.player2.toString());
					setDifficulty(data.difficulty);
					setIncludeBoost(data.includeBoost);
					setStartGame(false);
				}
			})
		}
		// Cleanup function
		return () => { if (socket) socket.off('matchFound'); };
	}, [socket, userId]);

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
	},);

	return (
		<div className="relative w-full h-full" ref={PvPRef}>
			<Paddle yPosition={paddle1Y} paddleHeight={paddleLengths[difficulty]} style={{ left: 0 }}/>
			<Paddle yPosition={paddle2Y} paddleHeight={paddleLengths[difficulty]} style={{ right: 0 }}/>
			<div className="relative bg-slate-900">
				<Ball  xPosition={ballX} yPosition={ballY} />
			</div>
			{includeBoost && (gameObj ? !gameObj.isBoost : false) ? <Boost x={boostX} y={boostY} width={boostWidth} height={boostWidth} /> : null}
			{isGameOver ? (
				<div className="absolute inset-0 bg-black bg-opacity-80">
						<VictoryLoss userId={userId} isVictory={player1Score == 1} difficulty={difficulty} />
					</div>
				) : null
			}
			{startGame ? null : <StartGame userId={userId} setStartGame={setStartGame} game={gameObj ? gameObj : null}/> }
		</div>
	)
}

export default PvP_2