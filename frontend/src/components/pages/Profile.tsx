import { useEffect, useState } from 'react';
import { Button } from '../ui/Button'
import axios from 'axios';
import Achievements from '../Achievements';
import Friends from '../Friends';
import Stats from '../Stats';

type User = {
	'id': number;
	'userName': string;
	'userNameLoc': string;
	'firstName': string;
	'lastName': string;
	'is2Fa': boolean;
	'authToken': string;
	'email': string;
	'secret2Fa'?: string;
	'avatar'?: string;
	'xp': number;
	'isLogged': boolean;
	'lastSeen'?: string;
};

interface ProfileProps {
	userId: number;
}

const Profile:React.FC<ProfileProps> =({ userId }) => {
	
	const [userInfo, setUserInfo] = useState< User | null >(null);
	const [showScreen, setShowScreen] = useState< 'default' | 'achievements' | 'friends' | 'stats' >('default');

	useEffect(() => {
		getUserInfo(userId.toString());
	}, []);

	const getUserInfo = async (id: string) => {
		try {
			const url = 'http://localhost:5000/pong/users/' + id;
			const response = await axios.get<User>(url);
			if (response.status === 200) {
				setUserInfo(response.data);
			}
		}
		catch (error) {
			console.log('Error fetching user infos', error);
		}
	}

	return (
		<div className='absolute h-full w-full'>
			<div className='bg-slate-200 dark:bg-slate-900 h-screen flex flex-col flex-wrap justify-start text-slate-900 dark:text-slate-200 border-8 dark:border-slate-900 z-0'>
				<div className='h-1/2 flex justify-around items-center z-0'>
					<div className='flex flex-col flex-wrap items-center gap-6 border-4 dark:border-slate-900'>
						<img
							className='min-w-[250px] min-h-[250px] w-1/2 h-1/2 rounded-full mx-auto'
							src='https://fastly.picsum.photos/id/294/200/200.jpg?hmac=tSuqBbGGNYqgxQ-6KO7-wxq8B4m3GbZqQAbr7tNApz8'
							alt='Your Profile Picture'
							/>
						<h1 className='text-2xl text-slate-900 font-extrabold dark:text-amber-300 drop-shadow-lg'>
							{userInfo ? userInfo.userNameLoc : '' }
						</h1>
						<div className='flex gap-4'>
							<Button>
								Update
							</Button>
							<Button>
								Delete
							</Button>
						</div>
					</div>
					<div className=' flex flex-col justify-around gap-6'>
						<h3>Personal Information</h3>
						<div>
							<span className='font-bold'>Full name: </span>
								<span>{ userInfo ? userInfo.firstName + ' ' + userInfo.lastName : '' }</span>
						</div>
						<div>
							<span className='font-bold'>Email: </span>
								<span>{ userInfo ? userInfo.email : '' }</span>
						</div>
						<div>
							<span className='font-bold'>Location: </span>
							<span>New York, USA</span>
						</div>
						<div>
							<span className='font-bold'>Occupation: </span>
							<span>Software Engineer</span>
						</div>
					</div>
				</div>
				<div className='h-1/2 flex flex-wrap justify-around items-center z-0'>
					<div className='w-auto text-center space-y-8'>
						<h3 className='bg-slate-900 text-lg font-bold mb-4 border-slate-900 border-2 rounded-lg text-white dark:bg-slate-200 dark:text-slate-900'>
							Achievements
						</h3>
						<div className='flex flex-wrap items-center justify-around gap-8'>
							<div>
								<div className='space-y-2 flex flex-col justify-between gap-4'>
									<div className='flex flex-row justify-between'>
										<img className='h-6 w-6' src="https://www.svgrepo.com/show/421893/achievement-challenge-medal.svg" alt="Achievement badge" />
										The first achievement
									</div>
									<div className='flex flex-row justify-between'>
										<img className='h-6 w-6' src="https://www.svgrepo.com/show/421893/achievement-challenge-medal.svg" alt="Achievement badge" />
										The second achievement
									</div>
									<div className='flex flex-row justify-between'>
										<img className='h-6 w-6' src="https://www.svgrepo.com/show/421893/achievement-challenge-medal.svg" alt="Achievement badge" />
										The third achievement
									</div>
								</div>
							</div>
							<div>
								<div className='space-y-2 flex flex-col justify-between gap-4'>
									<div className='flex flex-row justify-between'>
										<img className='h-6 w-6' src="https://www.svgrepo.com/show/421893/achievement-challenge-medal.svg" alt="Achievement badge" />
										The first achievement
									</div>
									<div className='flex flex-row justify-between'>
										<img className='h-6 w-6' src="https://www.svgrepo.com/show/421893/achievement-challenge-medal.svg" alt="Achievement badge" />
										The second achievement
									</div>
									<div className='flex flex-row justify-between'>
										<img className='h-6 w-6' src="https://www.svgrepo.com/show/421893/achievement-challenge-medal.svg" alt="Achievement badge" />
										The third achievement
									</div>
								</div>
							</div>
						</div>
						<div>
							<Button variant={'link'} onClick={() => setShowScreen('achievements')}>
								more
							</Button>
						</div>
					</div>
					<div className='text-center w-1/4'>
						<h3 className='bg-slate-900 text-lg font-bold mb-4 border-slate-900 border-2 rounded-lg text-white dark:bg-slate-200 dark:text-slate-900'>
							Friends of the World
						</h3>
						<div className='space-y-2 flex flex-col justify-between gap-4'>
							<div className='flex flex-row justify-around'>
								<img className='h-6 w-6' src="https://www.svgrepo.com/show/384673/account-avatar-profile-user-5.svg" alt="Friend Icon" />
								Friend 1
							</div>
							<div className='flex flex-row justify-around'>
								<img className='h-6 w-6' src="https://www.svgrepo.com/show/384673/account-avatar-profile-user-5.svg" alt="Friend Icon" />
								Friend 2
							</div>
							<div className='flex flex-row justify-around'>
								<img className='h-6 w-6' src="https://www.svgrepo.com/show/384673/account-avatar-profile-user-5.svg" alt="Friend Icon" />
								Friend 3
							</div>
							<div>
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
			{showScreen === 'friends' ? <Friends userId={userId} setShowScreen={setShowScreen} /> : null}
			{showScreen === 'stats' ? <Stats userId={userId} setShowScreen={setShowScreen} /> : null}
		</div>
	);
}
	
export default Profile