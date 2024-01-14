import { useEffect, useState } from "react";
import { Button } from "./ui/Button"
import axios, { AxiosResponse } from "axios";
import {Goal, UserAchievements} from '../types';
import { BACKEND_URL } from "../data/Global";

interface AchievementsProps {
	userId: string | null;
	setShowScreen: React.Dispatch<React.SetStateAction< 'default' | 'achievements' | 'friends' | 'stats' | 'userProfile' >>;
}

const Achievements:React.FC<AchievementsProps> =({ userId, setShowScreen }) => {
	
	const [userAchievements, setUserAchievements] = useState< UserAchievements[] | null >(null);
	const [allGoals, setAllGoals] = useState< Goal[] | null >(null);
	const url_achievements = `${BACKEND_URL}/pong/users/` + userId + '/achievements';
	const url_goals = `${BACKEND_URL}/pong/goals`;
	const [achievedGoals, setAchievedGoals] = useState<Goal[]>();
	const [notAchievedGoals, setNotAchievedGoals] = useState<Goal[]>();

	const getUserAchievements = async () => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		try {
			const response: AxiosResponse<UserAchievements[]> = await axios.get(url_achievements,{ headers });
			if (response.status === 200) {
				setUserAchievements(response.data);
			}
		} catch (error) {
			console.log('Error fetching user achievements:', error);
		}
	};

	const getAllGoals = async () => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		try {
			const response: AxiosResponse<Goal[] | null> = await axios.get(url_goals, { headers });
			if (response.status === 200) {
				setAllGoals(response.data);
			}
		} catch (error) {
			console.log('Error fetching Goals:', error);
		}
	};

	useEffect(() => {
		if (allGoals != null && userAchievements != null) {
			const achievedGoals = allGoals?.filter((goal) => {
			  return userAchievements?.some((achievement) => achievement.goalId === goal.id);
			});
			const notAchievedGoals = allGoals?.filter((goal) => {
				return !userAchievements?.some((achievement) => achievement.goalId === goal.id);
			})
			setAchievedGoals(achievedGoals);
			setNotAchievedGoals(notAchievedGoals);
		}
	  }, [userAchievements, allGoals]);

	useEffect(() => {
		if (userAchievements === null) {
			getUserAchievements();
		}
		if (allGoals === null) {
			getAllGoals();
		}
	}, []);

	return (
		<div className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 bg-opacity-70'>
			<div className='rounded min-w-[350px] h-1/2 w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 dark:bg-slate-200'>
				<div className="h-full p-4 flex-cols text-center justify-between space-y-4">
					<Button variant={'link'} onClick={() => setShowScreen('default')}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-200 dark:text-slate-900">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
						</svg>
					</Button>
					<div className="h-4/5 overflow-y-auto p-4 flex-cols text-center justify-between space-y-4">
						{achievedGoals?.map((goal) => (
							<div
							key={goal.id}
							className='space-y-2 border-t-8 dark:border-slate-900 dark:bg-slate-900 bg-slate-200 text-slate-900 dark:text-amber-400 rounded-md flex-cols justify-evenly items-baseline'
						>
							<div className='flex items-center justify-around '>
								<img className='h-16 w-16 bg-slate-200 dark:bg-slate-200 rounded-full' src={goal.image} alt="Achievement icon" />
								<p  className='w-3/5'>
									{goal.label}
								</p>
							</div>
								<p className='text-xs dark:text-slate-200'>
									{goal.description}
								</p>
						</div>
						))}
						{notAchievedGoals?.map((goal) => (
							<div
							key={goal.id}
							className='space-y-2 border-t-8 dark:border-slate-900 dark:bg-slate-900 bg-slate-200 text-slate-900 dark:text-amber-400 rounded-md flex-cols justify-evenly items-baseline'
						>
							<div className='flex items-center justify-around '>
								<img className='h-16 w-16 bg-slate-200 dark:bg-slate-200 rounded-full' src='https://www.svgrepo.com/show/529148/question-circle.svg' alt="Achievement icon" />
								<p className='w-3/5'>
									...
								</p>
							</div>
								<p className='text-xs dark:text-slate-200 '>
									{goal.description}
								</p>
						</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Achievements;

// <div className="grid grid-cols-2 gap-8">
// 							{achievedGoals?.map((goal, index) => (
// 								<div key={index}>
// 									<div className="space-y-2 flex flex-col justify-between gap-4">
// 										<div className="flex flex-row justify-between">
// 											<img
// 											className="h-6 w-6"
// 											src={goal.image} // : 'https://www.svgrepo.com/show/529148/question-circle.svg'}
// 											alt="Achievement badge"
// 											/>
// 											{goal.label}
// 										</div>
// 									</div>
// 								</div>
// 							))}
// 							{notAchievedGoals?.map((goal, index) => (
// 								<div key={index}>
// 									<div className="space-y-2 flex flex-col justify-between gap-4">
// 										<div className="flex flex-row justify-between">
// 											<img
// 											className="h-6 w-6"
// 											src='https://www.svgrepo.com/show/529148/question-circle.svg'
// 											alt="Achievement badge"
// 											/>
// 											{goal.label}
// 										</div>
// 									</div>
// 								</div>
// 							))}
// 						</div>