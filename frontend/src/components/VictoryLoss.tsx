import axios, { AxiosResponse } from "axios";
import { Button } from "./ui/Button"
import { useEffect, useState } from "react";
import { UserAchievements, UserStats } from "../types";
import { BACKEND_URL } from "../data/Global";
import { useNavigate } from "react-router-dom";

interface VictoryLossProps {
	isVictory: boolean;
	userId: string | null | undefined;
	difficulty: number;
}

const VictoryLoss: React.FC<VictoryLossProps> = ({ isVictory, userId, difficulty }) => {

	const [userStats, setUserStats] = useState< UserStats | null >(null);
	const [UserAchievements, setUserAchievements] = useState< UserAchievements[] | null >(null);
	const [updatedStats, setUpdatedStats] = useState(false);
	const [updatedAchievements, setUpdatedAchievements] = useState(false);
	const url_stats = `${BACKEND_URL}/pong/users/` + userId + '/stats';
	const url_achievements = `${BACKEND_URL}/pong/users/` + userId + '/achievements';
	const navigate = useNavigate()
	
	const getUserStats = async () => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		try {
			const response = await axios.get<UserStats>(url_stats, { headers });
			if (response.status === 200) {
				setUserStats(response.data);
			}
		} catch (error) {
			console.log('Error fetching user stats:', error);
		}
	};

	const updateUserStats = async ( isVictory: boolean ) => {
		if (userStats) {
			const headers = {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
			};
			try {
				console.log('In try block')
				const updatedStats = {
					wins: isVictory ? userStats.wins + 1 : userStats.wins,
					losses: isVictory ? userStats.losses : userStats.losses + 1,
				}
				const response = await axios.patch(url_stats, updatedStats, { headers });
				if (response.status === 200) {
					console.log('UserStats updated:', response.data);
					setUpdatedStats(true);
				}

			} catch (error) {
				console.log('Error updating userStats:', error);
			}
		}
	};

	const getUserAchievements = async () => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		try {
			const response: AxiosResponse<UserAchievements[]> = await axios.get(url_achievements, { headers });
			if (response.status === 200) {
				setUserAchievements(response.data);
			}
		} catch (error) {
			console.log('Error fetching user achievements:', error);
		}
	};

	const checkUserAchievements = async () => {
		if (isVictory && UserAchievements) {
			const achievementExists = UserAchievements.some((achievement) => achievement.goalId === (difficulty + 2).toString());
			console.log("Achievement exists: ", achievementExists);
			if (!achievementExists) {
				const headers = {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
				};
				try {
					const Achievement = 
					{
						"goalId": (difficulty + 2),
						"createdAt": Date.now().toLocaleString(),
					}
					const response = await axios.post(url_achievements, Achievement, { headers });
					if (response.status === 201) {
						console.log('Added Achievement Successfully');
						setUpdatedAchievements(true);
					}
				} catch (error) {
					console.log('Creating Achievement failed: ', error);
				}
			}
		}
	}

	useEffect(() => {
		if (userStats === null) {
			getUserStats();
		}
		if (UserAchievements === null) {
			getUserAchievements();
		}
	})

	useEffect(() => {
		if (updatedStats === false && userStats) {
			console.log("trying to update Wins/losses")
			updateUserStats(isVictory);
		} else if (updatedAchievements === false) {
			checkUserAchievements();
		}
	}, [updatedStats, updatedAchievements, userStats]);

	return (
		<div className='flex items-center justify-center h-full'>
			<div className='text-4xl font-bold'>
				{isVictory ? 'Congratulations! You won!' : 'Oops! You lost!'}
				{' Lets go '}
				<Button onClick={() => navigate('/')} size='lg' variant='link' children='Home' className='dark:text-amber-400'/>
			</div>
		</div>
	);
};

export default VictoryLoss