import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { UserAchievements, UserStats } from "../types";

interface VictoryLossProps {
	isVictory: boolean;
	userId: string | null;
	difficulty: number;
}

const VictoryLoss: React.FC<VictoryLossProps> = ({ isVictory, userId, difficulty }) => {

	const [userStats, setUserStats] = useState< UserStats | null >(null);
	const [UserAchievements, setUserAchievements] = useState< UserAchievements[] | null >(null);
	const [updatedStats, setUpdatedStats] = useState(false);
	const [updatedAchievements, setUpdatedAchievements] = useState(false);
	const url_stats = 'http://localhost:5000/pong/users/' + userId + '/stats';
	const url_achievements = 'http://localhost:5000/pong/users/' + userId + '/achievements';
	
	const getUserStats = async () => {
		try {
			const response = await axios.get<UserStats>(url_stats);
			if (response.status === 200) {
				setUserStats(response.data);
				console.log('Received User Stats: ', response.data);
			}
		} catch (error) {
			console.log('Error fetching user stats:', error);
		}
	};

	const updateUserStats = async ( isVictory: boolean ) => {
		try {
			const updatedStats = {
				wins: isVictory ? (userStats?.wins ?? 0) + 1 : (userStats?.wins ?? 0),
				losses: isVictory ? (userStats?.losses ?? 0) : (userStats?.losses ?? 0) + 1,
			};
			const response = await axios.patch(url_stats, updatedStats);
			if (response.status === 200) {
				console.log('UserStats updated:', response.data);
				setUpdatedStats(true);
			}

		} catch (error) {
			console.log('Error updating userStats:', error);
		}
	};

	const getUserAchievements = async () => {
		try {
			const response: AxiosResponse<UserAchievements[]> = await axios.get(url_achievements);
			if (response.status === 200) {
				setUserAchievements(response.data);
				console.log('Received User Achievements: ', response.data);
			}
		} catch (error) {
			console.log('Error fetching user achievements:', error);
		}
	};

	const checkUserAchievements = async () => {
		if (isVictory && UserAchievements) {
			const achievementExists = UserAchievements.some((achievement) => achievement.goalId === (difficulty + 2));
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
		// const label = ['Beat that Bot', 'Artificial what now?', 'iRobot who?', 'Terminator termniated', 'Heisted the Heistotron'];
		// const description = ['Won against the Bot on easy', 'Won against the Bot on medium', 'Won against the Bot on hard', 'Won against the Bot on very hard', 'Won against the Bot on extreme'];
		// const image = ['https://www.svgrepo.com/show/470680/robot-face.svg', 'https://www.svgrepo.com/show/235195/robot-ai.svg', 'https://www.svgrepo.com/show/134/robot.svg', 'https://www.svgrepo.com/show/402624/robot-face.svg', 'https://www.svgrepo.com/show/145418/robot.svg'];
		// const Achievement = {
		// 	label: label[difficulty],
		// 	description: description[difficulty],
		// 	image: image[difficulty],
		// 	createdAt: 'Mon, 24 Jul 2023',
		// }
		// const containsLabel = UserAchievements?.some((Achievement) => Achievement.label === label[difficulty]);
		// console.log('contains label: ', containsLabel)
		// if (containsLabel === true) {
		// 	console.log('Achievement exists already.');
		// } else if (containsLabel == false || containsLabel == undefined && isVictory) {
		// 	try {
		// }
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
		if (updatedStats === false) {
			updateUserStats(isVictory);
		} else if (updatedAchievements === false) {
			checkUserAchievements();
		}
	}, [updatedStats, updatedAchievements]);

	return (
		<div className='flex items-center justify-center h-full'>
			<div className='text-4xl font-bold'>
			{isVictory ? 'Congratulations! You won!' : 'Oops! You lost!'}
			</div>
		</div>
	);
};

export default VictoryLoss