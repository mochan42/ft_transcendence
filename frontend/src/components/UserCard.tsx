import React, { useEffect, useState } from 'react';
import { User } from '../types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface UserCardProps {
	userId: number;
	setState?: React.Dispatch<React.SetStateAction<'select' | 'bot' | 'player'>>;
	info: string;
	foundMatch: boolean | undefined;
}

const UserCard: React.FC<UserCardProps> = ({ userId, info, setState, foundMatch}) => {
	
	const [userInfo, setUserInfo] = useState< User | null >(null);
	const url_info = 'http://localhost:5000/pong/users/' + userId.toString();
	const navigate = useNavigate();

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

	const handleCardClick = () => {
		if (info != 'MatchMaking' || (info === 'MatchMaking' && foundMatch != true)) {
			// More actions like dropping from MatchMaking list and stuff
			navigate('/profile');
		}
	}

	return (
		<div className="h-full bg-slate-900 rounded-lg p-12 flex flex-col justify-around gap-y-8">
			<div className="flex flex-col items-center justify-between flex-grow text-slate-200">
				<img
					className="h-48 w-48 rounded-full object-cover"
					src={userInfo?.avatar ? userInfo.avatar : 'https://www.svgrepo.com/show/170615/robot.svg'}
					alt="User Avatar"
				/>
				<button
					className='font-medium text-amber-400 text-2xl bg-transparent dark:bg-transparent underline-offset-4 hover:underline hover:bg-transparent dark:hover:bg-transparent'
					onClick={() => handleCardClick()}>
					{userInfo?.userNameLoc}
				</button>
				<p>XP earned: {userInfo?.xp}</p>
				{/* <p>Rank: {userInfo?.rank}</p> */}
			</div>
		</div>
	);
};

export default UserCard;