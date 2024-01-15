import React, { useState, useRef, useEffect } from 'react'
import VictoryLoss from './VictoryLoss';
import Boost from './Boost';
import Ball from './Ball';
import Paddle from './Paddle';
import { GameType, User, ballXType, ballYType, paddle1Type, paddle2Type, update } from '../types';
import { getSocket } from '../utils/socketService';
import { useNavigate } from 'react-router-dom';

interface PvP_2Props {
	isActive: boolean;
	setIsActive: (boolean: boolean) => void;
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
	setGame: (GameType: GameType) => void;
	isPause: boolean;
	setIsPause: (boolean: boolean) => void;
}

const PvP_2: React.FC<PvP_2Props> = ({ setIsPause, isPause, game, setGame, isActive, setIsActive, playerPoint, opponentPoint, setReset, userId, player1Score, player2Score, isGameActive, isReset, isGameOver, setIsGameOver, setState, setPlayer1Id, setPlayer2Id, setPlayer1Score, setPlayer2Score, setPlayer1Info, setPlayer2Info }) => {

	const socket = getSocket(userId);
	const [startGame, setStartGame] = useState(false);
	const [gameObj, setGameObj] = useState<GameType | undefined>(game);
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
	const [isBoost, setIsBoost] = useState<boolean | undefined>(false); // dynamic
	const [difficulty, setDifficulty] = useState(0);
	const [boostX, setBoostX] = useState(200); // dynamic
	const [boostY, setBoostY] = useState(200); // dynamic
	const [paddle1Y, setPaddle1Y] = useState(0); // dynamic
	const [paddle2Y, setPaddle2Y] = useState(0); // dynamic
	const [paddle2Dir, setPaddle2Dir] = useState<number>(0); // dynamic
	const [paddle2Speed, setPaddle2Speed] = useState(15); // dynamic
	const paddle2YRef = useRef<number>(0);
	const [arbitrary, setArbitrary] = useState<boolean>(false);
	const navigate = useNavigate();

	const movePaddles = () => {
		setPaddle2Y((prevY) => {
			let newY = prevY + paddle2Dir * paddle2Speed;
			if (newY < 0) {
				newY = 0;
			} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
				newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
			}
			paddle2YRef.current = newY;
			return newY;
		});
	}

	const handleGameUpdate = (data: GameType) => {
		setGameObj(data);
		setGame(data);
		setPaddle1Y(data.paddle1Y);
		setBallX(data.ballX);
		setBallY(data.ballY);
		setBoostX(data.boostStartX ? data.boostStartX : boostX);
		setBoostY(data.boostStartY ? data.boostStartY : boostY);
		setPlayer1Score(data.score1);
		setPlayer2Score(data.score2);
		setIsBoost(data.includeBoost)
		if (data.status == 'finished') {
			setIsGameOver(true);
			console.log("Game has ended. It was ", data.status);
		} else if (data.status == 'aborted') {
			console.log("Aborting game event read!");
			setIsGameOver(true);
			navigate("/profile");
		}
		else {
			const response = {
				player: data.player2,
				paddlePos: paddle2YRef.current,
				playerActive: isActive,
				pause: isPause,
			}
			socket.emit(`ackResponse-G${data.id}P${data.player2}`, response);
		}
	};

	useEffect(() => {
		if (socket && !isGameOver) {
			socket.once('gameUpdate', handleGameUpdate);
		}
	});

	useEffect(() => {
		movePaddles();
	}, [paddle2Dir, paddle2Speed])

	useEffect(() => {
		if (socket != null) {
			socket.on('matchFound', (data: GameType) => {
				console.log("Reading matchFound Event.", data.id);
				if (userId && userId == data.player2.toString()) {
					setGameObj(data);
					setGame(data);
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
	});

	useEffect(() => {
		console.log("isPause: ", isPause);
		setTimeout(() => {
			setIsPause(false);
			}, 5100);
	}, [isPause])

	useEffect(() => {
		if (socket && !arbitrary) {
			socket.once('comeJoin', (data: GameType) => {
				console.log("Received comeJoin event");
				if (userId && (data.player2 == +userId)) {
					setGameObj(data);
					setIsGameOver(false);
					setArbitrary(true);
					socket.emit('gameLoop', data);
					console.log("Sending gameLoop with data: ", data);
				}
			})
		}
		// Cleanup function
		return () => { if (socket) socket.off('comeJoin'); };
	});

	// Track player key input
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'w' || event.key === 'ArrowUp') {
				event.preventDefault();
				setPaddle2Dir(-1); // Move paddle up
			} else if (event.key === 's' || event.key === 'ArrowDown') {
				event.preventDefault();
				setPaddle2Dir(1); // Move paddle down
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
	});

	return (
		<div className="relative w-full h-full">
			<div className='flex rounded min-w-[350px] h-[600px] w-[1200px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 text-slate-200' ref={PvPRef}>
				<Paddle yPosition={paddle1Y} paddleHeight={paddleLengths[difficulty]} style={{ left: 0 }} />
				<Paddle yPosition={paddle2Y} paddleHeight={paddleLengths[difficulty]} style={{ right: 0 }} />
				<div className="relative bg-slate-900">
					<Ball xPosition={ballX} yPosition={ballY} />
				</div>
				{isGameOver ? (
						<div className="absolute inset-0 bg-black bg-opacity-80">
							<VictoryLoss userId={userId} isVictory={gameObj ? ((gameObj?.score2 > gameObj?.score1) ? true : false) : false} difficulty={gameObj?.difficulty ? gameObj?.difficulty : 1} />
						</div>
					) : null
				}
				{/* {startGame ? null : <StartGame userId={userId} setStartGame={setStartGame} game={gameObj ? gameObj : null} />} */}
			</div>
		</div>
	)
}

export default PvP_2