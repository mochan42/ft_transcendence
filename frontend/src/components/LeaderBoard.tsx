import React, { useEffect, useState } from "react";
import { Friend, User } from "../types";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectChatStore } from "../redux/store";
import { getSocket } from '../utils/socketService';
import { BACKEND_URL } from "../data/Global";
import UserCard from "./UserCard";
import { Button } from "./ui/Button";
import robot from "../img/robot.svg";


interface LeaderboardProps {
	userId: string | null;
}

const Leaderboard:React.FC<LeaderboardProps> =({ userId }) => {
	
	const chatStore = useSelector(selectChatStore);
	const [usersInfo, setUsersInfo] = useState<User[]>([]);
	const [showScreen, setShowScreen] = useState<number>(-1);
	const [topUsers, setTopUsers] = useState< User[] >([]);
	const [friends, setFriends] = useState< Friend [] | null>(null)
	const urlFriends = `${BACKEND_URL}/pong/users/` + userId + '/friends';
	const socket = getSocket(userId);
	
	const getUsersInfo = async () => { 
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		try {
			const response = await axios.get< User[] >(`${BACKEND_URL}/pong/users/`, { headers });
			if (response.status === 200) {
				setUsersInfo(response.data);
				// console.log('Received Users Info: ', response.data)
			}
		}
		catch (error) {
			console.log('Error fetching users infos', error);
		}
	}

	const getFriends = async () => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		try {
			const response = await axios.get< Friend [] >(urlFriends, { headers });
			if (response.status === 200) {
				setFriends(response.data);
			}
		}
		catch (error) {
			console.log('Error receiving Friends information: ', error);
		}
	}

	const addFriend = async (receiver: string) => {
		try {
			socket.emit('inviteFriend', receiver);
		}
		catch (error) {
			console.log('Error requesting friendship with user: ', receiver, error);
		}
	}

	useEffect(() => {
		if (friends === null)
			getFriends();
	})

	useEffect(() => {
		const intervalId = setInterval(getUsersInfo, 500);
		return () => clearInterval(intervalId);
	}, [getUsersInfo])

	useEffect(() => {
		const sortedUsers = usersInfo.sort((a, b) => b.xp - a.xp);
		const top10Users = sortedUsers.slice(0, 10);
		setTopUsers(top10Users);
	}, [usersInfo]);

	return (
		<div className="h-full w-full bg-slate-900 p-4 text-center rounded-lg">
			{(showScreen > -1) ?
			<div>
				<UserCard userId={showScreen.toString()} />
				<Button onClick={() => setShowScreen(-1)} variant='outline' children='Close' className='dark:text-slate-900' />
			</div> :
			<div>
				<h2 className="text-2xl text-amber-400 font-semibold mb-4">Leaderboard</h2>
				<div className="overflow-y-auto max-h-80 text-slate-200">
					{topUsers.map((user) => (
					<div
						key={user.id}
						className="flex items-center justify-around py-2 border-b border-slate-900"
					>
						<div className='flex justify-between gap-x-6 items-center'>
							<img className='h-6 w-6 rounded-full' src={user.avatar != "" ? user.avatar : robot}/>
								<button className="text-lg mr-2 hover:underline" onClick={() => {setShowScreen(+user.id) }} >{user.userNameLoc}</button>
						</div>
						<span className="text-slate-300">{user.xp} points</span>
						<div className="text-amber-400">
							Rank: {topUsers.indexOf(user) + 1}
						</div>
					</div>
					))}
				</div>
			</div> }
		</div>
	);
};

export default Leaderboard;