import { useEffect, useState } from 'react';
import { Button } from '../ui/Button'
import axios, { AxiosResponse } from 'axios';
import Achievements from '../Achievements';
import Friends from '../Friends';
import Stats from '../Stats';
import { User, ProfileProps, UserStats, UserAchievements, Goal, Friend } from '../../types';
import EditProfile from '../EditProfile';

import '../../css/profile.css';

    const Profile:React.FC<ProfileProps> =({ userId, isAuth }) => {
	
	const [userInfo, setUserInfo] = useState< User | null >(null);
	const [usersInfo, setUsersInfo] = useState< User[] | null >(null);
	const [userStats, setUserStats] = useState< UserStats | null >(null);
	const [showScreen, setShowScreen] = useState< 'default' | 'achievements' | 'friends' | 'stats' | 'userProfile' >('default');
	const [userAchievements, setUserAchievements] = useState< UserAchievements[] | null >(null);
	const [allGoals, setAllGoals] = useState< Goal[] | null >(null);
	const [friends, setFriends] = useState< Friend [] | null>(null)
	const id = userId;
	const urlFriends = 'https://literate-space-garbanzo-vjvjp6xjpvvfp57j-5000.app.github.dev/pong/users/' + id + '/friends';
	const url_info = 'https://literate-space-garbanzo-vjvjp6xjpvvfp57j-5000.app.github.dev/pong/users/' + id;
	const url_stats = 'https://literate-space-garbanzo-vjvjp6xjpvvfp57j-5000.app.github.dev/pong/users/' + id + '/stats'
	const url_achievements = 'https://literate-space-garbanzo-vjvjp6xjpvvfp57j-5000.app.github.dev/pong/users/' + id + '/achievements';
	const url_goals = 'https://literate-space-garbanzo-vjvjp6xjpvvfp57j-5000.app.github.dev/pong/goals';
	const [achievedGoals, setAchievedGoals] = useState<Goal[]>();
	const [notAchievedGoals, setNotAchievedGoals] = useState<Goal[]>();
	const [userFriends, setUserFriends] = useState<User [] | null >(null)
	const [state2fa, setState2fa] = useState<boolean>(false);
	const [btnTxt2fa, setBtnTxt2fa] = useState<string>("2FA: disabled");
	const [btnStyle, setBtnStyle] = useState<string>('default');

      const ConfigureBtn2fa = (updated2faState: boolean) => {
        if (!updated2faState) {
            setBtnTxt2fa(" 2FA: disabled ");
            //setBtnStyle('profile_btn disabled');
        }
        else
        {
            setBtnTxt2fa(" 2FA: active ");
            //setBtnStyle('profile_btn active');
        }

    }

	const Handle2faBtnClick = async () => {
        const resp = await axios.patch<User>('https://literate-space-garbanzo-vjvjp6xjpvvfp57j-5000.app.github.dev/pong/users/2fa/' + id);
        if (resp.status === 200) {
			setUserInfo(resp.data);
            //window.location.reload()
            console.log('2FA options updated successfully');
        }
		// make a post request to backend to update latest 2fa settings 
		// This should not affect the current session.  
    }

	useEffect(() => {
		if (allGoals != null && userAchievements != null) {
			const achievedGoals = allGoals?.filter((goal) => {
			  return userAchievements?.some((achievement) => achievement.goalId === goal.id);
			});
			const notAchievedGoals = allGoals?.filter((goal) => {
				return !userAchievements?.some((achievement) => achievement.goalId === goal.id);
			})
			// console.log('achieved goals: ', achievedGoals)
			// console.log('not achieved goals: ', notAchievedGoals)
			setAchievedGoals(achievedGoals);
			setNotAchievedGoals(notAchievedGoals);
		}
	  }, [userAchievements, allGoals]);
	
		useEffect(() => {
			(async () => {
				if (userInfo === null) {
					try {
						const response = await axios.get<User>(url_info);
						if (response.status === 200) {
							setUserInfo(response.data);
							// console.log('Received User Info: ', response.data)
						}
					}
					catch (error) {
						console.log('Error fetching user infos', error);
					}
				}
				if (userStats === null) {
					try {
						const response = await axios.get<UserStats>(url_stats);
						if (response.status === 200) {
							setUserStats(response.data);
							// console.log('Received User Stats: ', response.data);
						}
					} catch (error) {
						console.log('Error fetching user stats:', error);
					}
				}
				if (userAchievements === null) {
					try {
						const response: AxiosResponse<UserAchievements[]> = await axios.get(url_achievements);
						if (response.status === 200) {
							setUserAchievements(response.data);
							// console.log('Received User Achievements: ', response.data);
						}
					} catch (error) {
						console.log('Error fetching user achievements:', error);
					}
				}
				if (allGoals === null) {
					try {
						const response: AxiosResponse<Goal[] | null> = await axios.get(url_goals);
						if (response.status === 200) {
							setAllGoals(response.data);
							// console.log('Received Goals: ', response.data);
						}
					} catch (error) {
						console.log('Error fetching Goals:', error);
					}
				}
				if (friends === null) {
					try {
						const response = await axios.get< Friend [] >(urlFriends);
						if (response.status === 200) {
							setFriends(response.data);
							// console.log('Received Friends data', response.data);
						}
					}
					catch (error) {
						console.log('Error receiving Friends information: ', error);
					}
				}
				if (usersInfo === null) {
					try {
						const response = await axios.get< User[] >('https://literate-space-garbanzo-vjvjp6xjpvvfp57j-5000.app.github.dev/pong/users/');
						if (response.status === 200) {
							setUsersInfo(response.data);
							// console.log('Received Users Info: ', response.data)
						}
					}
					catch (error) {
						console.log('Error fetching users infos', error);
					}
				}
				if (userFriends === null && usersInfo) {
					const usersFriends = usersInfo?.filter((user) =>
						friends?.some((friend) => (friend.sender === user.id || friend.receiver === user.id) && user.id !== userId)
					);
					setUserFriends(usersFriends);
                }
                if (userInfo) {
                    setState2fa(userInfo.is2Fa)// should be substituted with getuserinfo for latest 2fa status
                    ConfigureBtn2fa(userInfo.is2Fa);
                }
			})();
		}, [
			userInfo, ConfigureBtn2fa, allGoals,
			friends, userAchievements, userFriends,
			userId, userStats, usersInfo, url_info,
			url_stats, url_achievements, urlFriends,
			url_goals
		]
		);

	return (
		<div className='h-5/6 w-full'>
			<div className='bg-slate-200 dark:bg-slate-900 h-full flex flex-wrap justify-start text-slate-900 dark:text-slate-200 border-8 dark:border-slate-900'>
				{/* <div className='flex justify-around items-center z-0'> */}
					<div className='flex flex-col w-1/3 items-center gap-6 border-4 dark:border-slate-900'>
						<img
							className="h-2/5 w-2/5 rounded-full object-cover"
							src={(userInfo?.avatar) ?? 'https://www.svgrepo.com/show/170615/robot.svg'}
							alt='Your Profile Picture'
							/>
						<h1 className='text-2xl text-slate-900 font-extrabold dark:text-amber-300 drop-shadow-lg'>
							{userInfo?.userNameLoc ?? 'unknown'}
						</h1>
						<div>
							<Button onClick={() => setShowScreen('userProfile')}>
								Info
							</Button>
						</div>
                        <div>
							<Button onClick={ Handle2faBtnClick } variant={ state2fa ? "default" : "subtle"} >
								{ btnTxt2fa }
							</Button>
                        </div>
					</div>
					<div className='w-2/3 flex flex-col justify-around items-center text-center z-0'>
						<div className='flex flex-col items-center gap-y-4'>
							<h3 className='text-center w-[300px] bg-slate-900 text-lg font-bold mb-4 border-slate-900 border-2 rounded-lg text-white dark:bg-slate-200 dark:text-slate-900'>
								Stats and numbers
							</h3>
							<div className='flex flex-wrap items-center justify-around gap-8'>
								<div>
									<div className='space-y-2 flex flex-col justify-between gap-4'>
										<div className='flex flex-row justify-between'>
											Total Games Played: {(userStats?.wins ?? 0) + (userStats?.losses ?? 0)}
										</div>
										<div className='flex flex-row justify-between'>
											Total Victories: {(userStats?.wins) ?? 0}
										</div>
										<div className='flex flex-row justify-between'>
											Total Defeats: {(userStats?.losses) ?? 0}
										</div>
									</div>
								</div>
							</div>
							<div>
								<Button variant={'link'} onClick={() => setShowScreen('stats')}>
									more
								</Button>
							</div>
						</div>
						<div className='flex flex-wrap justify-around z-0 w-full items-baseline'>
							<div className='w-1/2 h-full text-center space-y-8 flex flex-col items-center'>
								<h3 className='w-min-[250px] w-4/5 text-center bg-slate-900 text-lg font-bold mb-4 border-slate-900 border-2 rounded-lg text-white dark:bg-slate-200 dark:text-slate-900'>
									Achievements
								</h3>
								<div className="grid grid-cols-2 gap-8">
									{achievedGoals?.map((goal, index) => (
										<div key={index}>
											<div className="space-y-2 flex flex-col justify-between gap-4">
												<div className="flex flex-row justify-between">
													<img
													className="h-6 w-6"
													src={goal.image}
													alt="Achievement badge"
													/>
													{goal.label}
												</div>
											</div>
										</div>
									))}
									{notAchievedGoals?.map((goal, index) => (
										<div key={index}>
											<div className="space-y-2 flex flex-col justify-between gap-4">
												<div className="flex flex-row justify-between min-w-[220px]">
													<img
													className="h-6 w-6 dark:bg-slate-200 rounded-full"
													src='https://www.svgrepo.com/show/529148/question-circle.svg'
													alt="Achievement badge"
													/>
													{goal.label}
												</div>
											</div>
										</div>
									))}
								</div>
								<div>
									<Button variant={'link'} onClick={() => setShowScreen('achievements')}>
										more
									</Button>
								</div>
							</div>
							<div className='w-1/2 text-center space-y-8 flex flex-col items-center'>
								<h3 className='w-min-[250px] w-4/5 bg-slate-900 text-lg font-bold mb-4 border-slate-900 border-2 rounded-lg text-white dark:bg-slate-200 dark:text-slate-900'>
									Friends of the World
								</h3>
								<div className='space-y-2 flex flex-col justify-between items-center gap-4'>
									{userFriends != null ? userFriends?.map((user, index) => (
										<div key={index}>
											<div className="space-y-2 flex flex-col justify-between gap-4">
												<div className="flex flex-row justify-between min-w-[220px]">
													<img
													className="h-6 w-6 dark:bg-slate-200 rounded-full"
													src={user.avatar}
													alt="Achievement badge"
													/>
														{user.userNameLoc}
												</div>
											</div>
										</div>
									)) : <img className='h-40 w-40 rounded-lg' src='https://media0.giphy.com/media/KG4ST0tXOrt1yQRsv0/200.webp?cid=ecf05e4732is65t7ah6nvhvwst9hkjqv0c52bhfnilk0b9g0&ep=v1_stickers_search&rid=200.webp&ct=s'/>}
									<Button variant={'link'} onClick={() => setShowScreen('friends')}>
										more
									</Button>
								</div> 
							</div>
						</div>
					</div>
			</div>
			{showScreen === 'achievements' ? 
				<Achievements userId={userId} setShowScreen={setShowScreen} />
			: null}
			{showScreen === 'friends' ? <Friends setShowScreen={setShowScreen} friends={userFriends} /> : null}
			{showScreen === 'stats' ? <Stats userId={userId} setShowScreen={setShowScreen} /> : null}
			{showScreen === 'userProfile' ? <EditProfile setShowScreen={setShowScreen} userId={userId}/> : null}
		</div>
	);
}
	
export default Profile
