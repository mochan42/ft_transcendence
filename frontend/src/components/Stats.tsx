import { useEffect, useState } from "react";
import { Button } from "./ui/Button"
import axios, { AxiosResponse } from "axios";
import { BACKEND_URL } from "../data/Global";

interface StatsProps {
	userId: string | null;
	setShowScreen: React.Dispatch<React.SetStateAction< 'default' | 'achievements' | 'friends' | 'stats' | 'userProfile' >>;
}

type UserStats = {
	'id': number;
	'userId': number;
	'wins': number,
	'losses': number,
	'draws': number,
};

type UserAchievements = {
	'id': number;
	'userId': number;
	'label': string;
	'description': string;
	'image': string;
	'createdAt': string;
}

const Stats:React.FC<StatsProps> =({ userId, setShowScreen }) => {

	const url_stats = `${BACKEND_URL}/pong/users/` + userId + '/stats';
	const [userStats, setUserStats] = useState< UserStats | null >(null);
	const [winRatio, setWinRatio] = useState<number>(0);
	const [userAchievements, setUserAchievements] = useState< UserAchievements[] | null >(null);
	const url_achievements = `${BACKEND_URL}/pong/users/` + userId + '/achievements';

	// useEffect(() => {
	// 	if (userAchievements === null) {
	// 		getUserAchievements();
	// 	}
	// }, [userAchievements]);

	const getUserAchievements = async () => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		try {
			const response: AxiosResponse<UserAchievements[]> = await axios.get(url_achievements, { headers });
			if (response.status === 200) {
				setUserAchievements(response.data);
				// console.log('Received User Achievements: ', response.data);
			}
		} catch (error) {
			console.log('Error fetching user achievements:', error);
		}
	};

	const getUserStats = async () => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		try {
			const response = await axios.get<UserStats>(url_stats, { headers });
			if (response.status === 200) {
				setUserStats(response.data);
				// console.log('Received User Stats: ', response.data);
			}
		} catch (error) {
			console.log('Error fetching user stats:', error);
		}
	};

	const calculateStats = () => {
		const victories = userStats?.wins ?? 0;
		const defeats = userStats?.losses ?? 0;
		const totalGames = victories + defeats;
		if (totalGames > 0)
			setWinRatio((victories / totalGames) * 100);
	}

	useEffect(() => {
		if (userStats === null) {
		  getUserStats();
		} else {
		  calculateStats();
		}
		if (userAchievements === null) {
			getUserAchievements();
		}
	  }, [userStats]);

	

	return (
		<div className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 bg-opacity-70'>
			<div className='rounded h-1/2 w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 dark:bg-slate-200'>
				<div className="h-full p-4 flex-cols text-center justify-between space-y-4">
					<Button variant={'link'} onClick={() => setShowScreen('default')}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-200 dark:text-slate-900">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
						</svg>
					</Button>
					<div className="overflow-y-auto bg-slate-200 dark:bg-slate-900 dark:text-slate-200 shadow-md p-4 rounded-md">
						<div className="flex justify-between mb-4">
							<span>Victories:</span>
							<span>{userStats?.wins}</span>
						</div>
						<div className="flex justify-between mb-4">
							<span>Defeats:</span>
							<span>{userStats?.losses}</span>
						</div>
						<div className="flex justify-between mb-4">
							<span>Win Ratio:</span>
							<span>{winRatio.toFixed(2)}%</span>
						</div>
						<div className="flex justify-between mb-4">
							<span>Defeat Ratio:</span>
							<span>{(100 - (winRatio ?? 0)).toFixed(2)}%</span>
						</div>
						<div className="flex justify-between mb-4">
							<span>Total Achievements unlocked:</span>
							<span>{userAchievements?.length} / 6</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Stats