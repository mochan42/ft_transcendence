import React, { useEffect, useState } from 'react';
import { User } from '../types';
import axios from 'axios';

interface UserCardProps {
  userId: number;
}

const UserCard: React.FC<UserCardProps> = ({ userId }) => {
	
	const [userInfo, setUserInfo] = useState< User | null >(null);
	const url_info = 'http://localhost:5000/pong/users/' + userId.toString();

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

	useEffect(() => {
		if (userInfo === null) {
			getUserInfo();
		}
	});

	return (
		<div className="h-full bg-slate-900 rounded-lg p-12 flex flex-col justify-around gap-y-8">
			<div className="flex flex-col items-center justify-between flex-grow">
				<img
					className="h-48 w-48 rounded-full object-cover"
					src={userInfo?.avatar ? userInfo.avatar : 'https://www.svgrepo.com/show/384669/account-avatar-profile-user-13.svg'}
					alt="User Avatar"
				/>
				<h2 className="text-2xl text-amber-400 font-semibold">{userInfo?.userNameLoc}</h2>
				<p className="">XP earned: {userInfo?.xp}</p>
				{/* <p>Rank: {userInfo?.rank}</p> */}
			</div>
		</div>
	);
};

export default UserCard;