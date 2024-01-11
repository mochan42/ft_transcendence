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
	includeBoost: boolean;
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

const PvP: React.FC<PvPProps> = ({ includeBoost, playerPoint, opponentPoint, setReset, userId, player1Score, player2Score, isGameActive, isReset, isGameOver, selectedDifficulty, setIsGameOver, setState, setPlayer1Id, setPlayer2Id, setPlayer1Score, setPlayer2Score, setPlayer1Info, setPlayer2Info, game }) => {

	const socket = getSocket(userId);
	const [gameObj, setGameObj] = useState<GameType | undefined>(undefined);
	const [startGame, setStartGame] = useState<boolean | undefined>(undefined);

	// const [gameMaker, setGameMaker] = useState(false);
	const [opponentId, setOpponentId] = useState(-1);
	const [difficulty, setDifficulty] = useState(0);
	// const [itsDifficult, setItsDifficult] = useState(4);
	const [matchFound, setMatchFound] = useState<true | false | undefined>(false); // static
	const PvPRef = useRef<HTMLDivElement>(null);
	const paddleLengths = [200, 150, 100, 80, 50] // static
	// const [includeBoost, setIncludeBoost] = useState(false);
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
	const [boostX, setBoostX] = useState(200); // dynamic
	const [boostY, setBoostY] = useState(200); // dynamic
	const [paddle1Y, setPaddle1Y] = useState(0); // dynamic
	const [paddle2Y, setPaddle2Y] = useState(0); // dynamic
	const [paddle1Dir, setPaddle1Dir] = useState<number>(0); // dynamic
	const [paddle1Speed, setPaddle1Speed] = useState(15); // dynamic
	const paddle1YRef = useRef<number>(0);

	const movePaddles = () => {
		setPaddle1Y((prevY) => {
			let newY = prevY + paddle1Dir * paddle1Speed;
			// Ensure the paddle stays within the valid range
			if (newY < 0) {
				newY = 0;
			} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
				newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
			}
			paddle1YRef.current = newY;
			return newY;
		})
	}

	const handleGameUpdate = (data: GameType) => {
		setGameObj(data);
		setPaddle2Y(data.paddle2Y);
		setBallX(data.ballX);
		setBallY(data.ballY);
		setBoostX(data.boostX);
		setBoostY(data.boostY);
		setPlayer1Score(data.score1);
		setPlayer2Score(data.score2);
		setIsBoost(data.isBoost);
		if (data.status == 'finished' || data.status == 'aborted')
			setIsGameOver(true);
		else {
			const response = {
				player: data.player1,
				paddlePos: paddle1YRef.current,
			}
			socket.emit(`ackResponse-G${data.id}P${data.player1}`, response);
		}
		
	};

	useEffect(() => {
		if (socket && !isGameOver) {
			socket.on('gameUpdate', handleGameUpdate);
		}

		// The clean-up function to remove the event listener when the component is unmounted or dependencies change
		return () => {
			if (socket) {
				socket.off('gameUpdate', handleGameUpdate);
			}
		};
	});


	useEffect(() => {
		movePaddles();

	}, [paddle1Dir, paddle1Speed])

	useEffect(() => {
		if (socket != null) {
			socket.on('matchFound', (data: GameType) => {
				if (userId && userId == data.player1.toString()) {
					setGameObj(data);
					setPlayer1Id(data.player1.toString());
					setPlayer2Id(data.player2.toString());
					setDifficulty(data.difficulty);
					setStartGame(false);
					setMatchFound(true);
				}
			});

			socket.on('updateMatch', (currentGame: GameType) => {
				if (userId == currentGame.player1.toString() || userId == currentGame.player2.toString()) {
					setGameObj(currentGame);
				}
			});
		}
		// Cleanup function
		return () => { if (socket) socket.off('matchFound'); };
	});

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
	});

	return (
		<div className="relative w-full h-full">
			<div className='flex rounded min-w-[350px] h-[700px] w-[1400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 text-slate-200' ref={PvPRef}>
				<Paddle yPosition={paddle1Y} paddleHeight={paddleLengths[difficulty]} style={{ left: 0 }} />
				<Paddle yPosition={paddle2Y} paddleHeight={paddleLengths[difficulty]} style={{ right: 0 }} />
				<div className="relative bg-slate-900">
					<Ball xPosition={ballX} yPosition={ballY} />
				</div>
				{includeBoost && !isBoost ? <Boost x={boostX} y={boostY} width={boostWidth} height={boostWidth} /> : null}
				{!matchFound ? <MatchMaking setGameObj={setGameObj} difficulty={selectedDifficulty} includeBoost={includeBoost} socket={socket} setMatchFound={setMatchFound} userId={userId} setState={setState} setOpponentId={setOpponentId} opponentId={3}/> : null}
				{startGame == false ? <StartGame userId={userId} setStartGame={setStartGame} game={gameObj ? gameObj : null} /> : null}
				{gameObj?.isGameOver ? (
						<div className="absolute inset-0 bg-black bg-opacity-80">
							<VictoryLoss userId={userId} isVictory={gameObj ? ((gameObj?.score1 > gameObj?.score2) ? true : false) : false} difficulty={gameObj?.difficulty ? gameObj?.difficulty : 1} />
						</div>
					) : null
				}
			</div>
		</div>
	)
}

export default PvP