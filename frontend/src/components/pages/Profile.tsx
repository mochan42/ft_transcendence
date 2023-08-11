import { useEffect, useState } from 'react';
import { Button } from '../ui/Button'
import axios, { AxiosResponse } from 'axios';
import Achievements from '../Achievements';
import Friends from '../Friends';
import Stats from '../Stats';
import { User, ProfileProps, UserStats, UserAchievements, Goal, Friend } from '../../types';
import '../../css/profile.css';

    const Profile:React.FC<ProfileProps> =({ userId, is2faEnable }) => {
	
	const [userInfo, setUserInfo] = useState< User | null >(null);
	const [usersInfo, setUsersInfo] = useState< User[] | null >(null);
	const [userStats, setUserStats] = useState< UserStats | null >(null);
	const [showScreen, setShowScreen] = useState< 'default' | 'achievements' | 'friends' | 'stats' >('default');
	const [userAchievements, setUserAchievements] = useState< UserAchievements[] | null >(null);
	const [allGoals, setAllGoals] = useState< Goal[] | null >(null);
	const [friends, setFriends] = useState< Friend [] | null>(null)
	const id = userId;
	const urlFriends = 'http://localhost:5000/pong/users/' + id + '/friends';
	const url_info = 'http://localhost:5000/pong/users/' + id;
	const url_stats = 'http://localhost:5000/pong/users/' + id + '/stats'
	const url_achievements = 'http://localhost:5000/pong/users/' + id + '/achievements';
	const url_goals = 'http://localhost:5000/pong/goals';
	const [achievedGoals, setAchievedGoals] = useState<Goal[]>();
	const [notAchievedGoals, setNotAchievedGoals] = useState<Goal[]>();
	const [userFriends, setUserFriends] = useState<User [] | null >(null)
    const [state2fa, setState2fa] = useState<boolean>(false);
    const [btnTxt2fa, setBtnTxt2fa] = useState<string>("2FA: disabled");
    const [btnStyle, setBtnStyle] = useState<string>('default');

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
	
	const getAllGoals = async () => {
		try {
			const response: AxiosResponse<Goal[] | null> = await axios.get(url_goals);
			if (response.status === 200) {
				setAllGoals(response.data);
				console.log('Received Goals: ', response.data);
			}
		} catch (error) {
			console.log('Error fetching Goals:', error);
		}
	};

	const getUserInfo = async () => {
		try {
			const response = await axios.get<User>(url_info);
			if (response.status === 200) {
				setUserInfo(response.data);
				console.log('Received User Info: ', response.data)
			}
		}
		catch (error) {
			console.log('Error fetching user infos', error);
		}
	}

	const getUsersInfo = async () => {
		try {
			const response = await axios.get< User[] >('http://localhost:5000/pong/users/');
			if (response.status === 200) {
				setUsersInfo(response.data);
				console.log('Received Users Info: ', response.data)
			}
		}
		catch (error) {
			console.log('Error fetching users infos', error);
		}
	}

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

	const getFriends = async () => {
		try {
			const response = await axios.get< Friend [] >(urlFriends);
			if (response.status === 200) {
				setFriends(response.data);
				console.log('Received Friends data', response.data);
			}
		}
		catch (error) {
			console.log('Error receiving Friends information: ', error);
		}
	}
    const ConfigureBtn2fa = () => {
        if (state2fa)
        {
            setBtnTxt2fa(" 2FA: disabled ");
            //setBtnStyle('profile_btn disabled');
        }
        else
        {
            setBtnTxt2fa(" 2FA: active ");
            //setBtnStyle('profile_btn active');
        }

    }

    const Handle2faBtnClick = () => {
        if (state2fa)
        {
            setState2fa(false) 
        }
        else
        {
            setState2fa(true);
        }
        ConfigureBtn2fa();
        console.log(state2fa);
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
			console.log('achieved goals: ', achievedGoals)
			console.log('not achieved goals: ', notAchievedGoals)
			setAchievedGoals(achievedGoals);
			setNotAchievedGoals(notAchievedGoals);
		}
	  }, [userAchievements, allGoals]);
	
	useEffect(() => {
		if (userInfo === null) {
			getUserInfo();
		}
		if (userStats === null) {
			getUserStats();
		}
		if (userAchievements === null) {
			getUserAchievements();
		}
		if (allGoals === null) {
			getAllGoals();
		}
		if (friends === null) {
			getFriends()
		}
		if (usersInfo === null) {
			getUsersInfo()
		}
		if (userFriends === null && usersInfo) {
			const usersFriends = usersInfo?.filter((user) =>
				friends?.some((friend) => friend.sender === user.id || friend.receiver === user.id && user.id != userId)
			);
			setUserFriends(usersFriends);
		}
        setState2fa(is2faEnable); // should be substituted with getuserinfo for latest 2fa status
        ConfigureBtn2fa();
	}, []);


	return (
		<div className='absolute h-full w-full'>
			<div className='bg-slate-200 dark:bg-slate-900 h-screen flex flex-col flex-wrap justify-start text-slate-900 dark:text-slate-200 border-8 dark:border-slate-900 z-0'>
				<div className='h-1/2 flex justify-around items-center z-0'>
					<div className='flex flex-col flex-wrap items-center gap-6 border-4 dark:border-slate-900'>
						<img
							className='h-Achievements[200px] w-[200px] rounded-full mx-auto'
							src={(userInfo?.avatar) ?? 'https://www.svgrepo.com/show/170615/robot.svg'}
							alt='Your Profile Picture'
							/>
						<h1 className='text-2xl text-slate-900 font-extrabold dark:text-amber-300 drop-shadow-lg'>
							{userInfo?.userNameLoc ?? 'unknown'}
						</h1>
						<div className='flex gap-4'>
							<Button>
								Update
							</Button>
							<Button>
								Delete
							</Button>
						</div>
                        <div>
							<Button onClick={ Handle2faBtnClick } variant={ state2fa ? "default" : "subtle"} >
								{ btnTxt2fa }
							</Button>
                        </div>
					</div>
					<div className='w-auto text-center space-y-8'>
						<h3 className='w-[300px] bg-slate-900 text-lg font-bold mb-4 border-slate-900 border-2 rounded-lg text-white dark:bg-slate-200 dark:text-slate-900'>
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
				</div>
				<div className='h-1/2 flex flex-wrap justify-around items-center z-0'>
					<div className='w-auto text-center space-y-8'>
						<h3 className='w-min-[300px] bg-slate-900 text-lg font-bold mb-4 border-slate-900 border-2 rounded-lg text-white dark:bg-slate-200 dark:text-slate-900'>
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
					<div className='w-1/4 text-center space-y-8'>
						<h3 className='w-[300px] bg-slate-900 text-lg font-bold mb-4 border-slate-900 border-2 rounded-lg text-white dark:bg-slate-200 dark:text-slate-900'>
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
			{showScreen === 'achievements' ? 
				<Achievements userId={userId} setShowScreen={setShowScreen} />
			: null}
			{showScreen === 'friends' ? <Friends setShowScreen={setShowScreen} friends={userFriends} /> : null}
			{showScreen === 'stats' ? <Stats userId={userId} setShowScreen={setShowScreen} /> : null}
		</div>
	);
}
	
export default Profile