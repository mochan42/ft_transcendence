import React, { useEffect, useState } from 'react';
import { User } from '../types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../data/Global';
import robot from "../img/robot.svg"

interface UserCardProps {
  	userId: string | undefined | null;
}

const UserCard: React.FC<UserCardProps> = ({ userId }) => {
	
	const [userInfo, setUserInfo] = useState< User | null >(null);
	const url_info = `${BACKEND_URL}/pong/users/` + userId;
	const navigate = useNavigate();

	const getUserInfo = async () => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		if (userId !== null) {
			try {
				const response = await axios.get<User>(url_info, { headers });
				if (response.status === 200) {
					setUserInfo(response.data);
					console.log('Received User Info: ', response.data)
				}
			}
			catch (error) {
				console.log('Error fetching user infos', error);
			}		
		}
	}

	useEffect(() => {
		getUserInfo();
	}, [userId]);

	return (
		<div className="h-full bg-slate-900 rounded-lg p-12 flex flex-col justify-around gap-y-8">
			<div className="flex flex-col items-center justify-between flex-grow text-slate-200">
				<img
					className="h-40 w-40 rounded-full object-cover" // Nice feature would be to place a border like so: 'border-b-8 border-t-8 border-amber-400'
					src={userInfo?.avatar ? userInfo.avatar : robot}
					alt="User Avatar"
				/>
				<button
					className='font-medium text-amber-400 text-2xl bg-transparent dark:bg-transparent underline-offset-4 hover:underline hover:bg-transparent dark:hover:bg-transparent border-t-8'
				>
					{userInfo?.userNameLoc}
				</button>
				<p>XP earned: {userInfo?.xp}</p>
			</div>
		</div>
	);
};

export default UserCard;