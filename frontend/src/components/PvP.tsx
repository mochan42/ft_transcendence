import React, { useState, useRef, useEffect } from 'react'
import VictoryLoss from './VictoryLoss';
import Boost from './Boost';
import Ball from './Ball';
import Paddle from './Paddle';
import { GameType, User, paddle1Type } from '../types';
import MatchMaking from './MatchMaking';
import { getSocket } from '../utils/socketService';
import StartGame from './StartGame';


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

	const socket = getSocket(userId);
	const [gameObj, setGameObj] = useState<GameType | undefined>(undefined);
	const [startGame, setStartGame] = useState< boolean | undefined >(undefined);

	// const [gameMaker, setGameMaker] = useState(false);
	const [opponentId, setOpponentId] = useState(-1);
	const [difficulty, setDifficulty] = useState(0);
	// const [itsDifficult, setItsDifficult] = useState(4);
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
	// const [paddle2Dir, setPaddle2Dir] = useState<number>(0); // dynamic
	const [speedX, setSpeedX] = useState(-20); // dynamic
	const [speedY, setSpeedY] = useState(-20); // dynamic
	const [paddle1Speed, setPaddle1Speed] = useState((difficulty + 1) * 2); // dynamic
	// const [paddle2Speed, setPaddle2Speed] = useState((difficulty + 1) * 2); // dynamic
	// const [boostStartX, setBoostStartX] = useState(200);
	// const [boostStartY, setBoostStartY] = useState(200);

	const movePaddles = () => {
		setPaddle1Y((prevY) => {
			let newY = prevY + paddle1Dir * paddle1Speed;
		
			// Ensure the paddle stays within the valid range
			if (newY < 0) {
				newY = 0;
			} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
				newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
			}
			if (gameObj) {
				const updatePaddle = {
					gameId: gameObj.id,
					paddlePos: newY,
				}
				socket.emit('updatePaddle1', updatePaddle)
			}
			return newY;
		})
	}

	useEffect(() => {
		// This function will be called whenever the 'gameUpdate' event is emitted from the server
		const handleGameUpdate = (data: GameType) => {
		  console.log("Receiving game update!\n");
		  setPaddle1Y(data.paddle1Y);
		  setPaddle2Y(data.paddle2Y);
		  setBallX(data.ballX);
		  setBallY(data.ballY);
		  setBoostX(data.boostX);
		  setBoostY(data.boostY);
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
					setStartGame(false);
				}
			})
		}
		// Cleanup function
		return () => socket.off('matchFound');
	}, [socket]);

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
			{startGame == false ?  <StartGame userId={userId} setStartGame={setStartGame} game={gameObj ? gameObj : null}/> : null}
		</div>
	)
}

export default PvP