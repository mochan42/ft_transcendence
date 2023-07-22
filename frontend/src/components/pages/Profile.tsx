import { useEffect, useState } from 'react';
import { Button } from '../ui/Button'
//import SmallHeading from '../ui/SmallHeading'
import axios from 'axios';

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

const Profile = () => {
	
	const [userInfo, setUserInfo] = useState<User|null>(null);
	useEffect(() => {
		getUserInfo('1');
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
	<div className='bg-slate-200 dark:bg-slate-900 h-screen  flex flex-col flex-wrap justify-start text-slate-900 dark:text-slate-200 border-8 dark:border-slate-900'>
		<div className='h-1/2 flex flex-wrap justify-around items-center'>
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
		<div className='h-1/2 flex flex-wrap justify-around items-center'>
			<div className=''>
				<h3 className='text-lg font-bold mb-4'>Achievements</h3>
				<ul className='space-y-2'>
					<li>Completed Project X</li>
					<li>Received Award Y</li>
					<li>Published Paper Z</li>
				</ul> 
			</div>
			<div className=''>
				<h3 className='text-lg font-bold mb-4'>Friends</h3>
				<ul className='space-y-2'>
					<li>Friend 1</li>
					<li>Friend 2</li>
					<li>Friend 3</li>
				</ul>
			</div>
		</div>
	</div>
  );
}
	
export default Profile