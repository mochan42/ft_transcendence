import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { UserAchievements, UserStats } from "../types";

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
	const url_stats = 'https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev/pong/users/' + userId + '/stats';
	const url_achievements = 'https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev/pong/users/' + userId + '/achievements';
	
	const getUserStats = async () => {
		try {
			const response = await axios.get<UserStats>(url_stats);
			if (response.status === 200) {
				setUserStats(response.data);
				// console.log('Received User Stats: ', response.data);
			}
		} catch (error) {
			console.log('Error fetching user stats:', error);
		}
	};

	const updateUserStats = async ( isVictory: boolean ) => {
		if (userStats) {
			try {
				console.log('In try block')
				const updatedStats = {
					wins: isVictory ? userStats.wins + 1 : userStats.wins,
					losses: isVictory ? userStats.losses : userStats.losses + 1,
				}
				const response = await axios.patch(url_stats, updatedStats);
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
		try {
			const response: AxiosResponse<UserAchievements[]> = await axios.get(url_achievements);
			if (response.status === 200) {
				setUserAchievements(response.data);
				// console.log('Received User Achievements: ', response.data);
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
				try {
					const Achievement = 
					{
						"goalId": (difficulty + 2),
						"createdAt": Date.now().toLocaleString(),
					}
					const response = await axios.post(url_achievements, Achievement);
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
			</div>
		</div>
	);
};

export default VictoryLoss