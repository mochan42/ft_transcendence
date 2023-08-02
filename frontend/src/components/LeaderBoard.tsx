import React, { useEffect, useState } from "react";
import { Friend, User } from "../types";
import axios from "axios";
import { Button } from "./ui/Button";


interface LeaderboardProps {
	userId: string | null;
}

const Leaderboard:React.FC<LeaderboardProps> =({ userId }) => {

	const [usersInfo, setUsersInfo] = useState< User[] >([]);
	const [topUsers, setTopUsers] = useState< User[] >([]);
	const [friends, setFriends] = useState< Friend [] | null>(null)
	const urlFriends = 'http://localhost:5000/pong/users/' + userId + '/friends';
	
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

	const addFriend = async (receiver: string) => {
		try {
			const friendRequest = {
				"sender": userId,
				"receiver": receiver,
				"relation": 'pending',
				"createdAt": Date.now().toLocaleString()
			};
			const response = await axios.post('http://localhost:5000/pong/friends', friendRequest);
			if (response.status === 200) {
				console.log('Requested Friendship');
			}
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
			const top5Users = sortedUsers.slice(0, 5);
			setTopUsers(top5Users);
	}, [usersInfo])

	return (
		<div className="h-full w-full bg-slate-900 p-4 text-center rounded-lg">
			<h2 className="text-2xl text-amber-400 font-semibold mb-4">Leaderboard</h2>
			<div className="overflow-y-auto max-h-80 text-slate-200">
				{topUsers.map((user) => (
				<div
					key={user.id}
					className="flex items-center justify-around py-2 border-b border-slate-900"
				>
					<div className='flex justify-between gap-x-6 items-center'>
						<Button variant={'ghost'} onClick={
							(() => {
								if (!(friends?.some((friend) => friend.receiver === user.id || friends?.some((friend) => friend.sender === user.id)))) {
									return addFriend(user.id);
								}
							})
						}>
							<img
								className='bg-slate-900 h-6 w-6 min-w-[24px] min-h-[24px] rounded-full'
								src={
								(() => {
									if (user.id === userId) {
										return 'https://www.svgrepo.com/show/515532/circle.svg';
									} else if (friends?.some((friend) => friend.receiver === user.id && friend.relation === 'accepted' || friends?.some((friend) => friend.sender === user.id && friend.relation === 'accepted'))) {
										return "https://www.svgrepo.com/show/157817/success.svg";
									} else if (friends?.some((friend) => friend.receiver === user.id && friend.relation === 'pending' || friends?.some((friend) => friend.sender === user.id && friend.relation === 'pending'))) {
										return "https://www.svgrepo.com/show/226028/clock-watch.svg";
									} else {
										return "https://www.svgrepo.com/show/416162/add-friend-basic-outline.svg";
									}
								  })()
								}
							/>
						</Button>
						<img className='h-6 w-6' src={user.avatar != "" ? user.avatar : 'https://www.svgrepo.com/show/170615/robot.svg'}/>
						<button className="text-lg mr-2 hover:underline">{user.userNameLoc}</button>
					</div>
					<span className="text-slate-300">{user.xp} points</span>
					<div className="text-amber-400">
						Rank: {topUsers.indexOf(user) + 1}
					</div>
				</div>
				))}
			</div>
		</div>
	);
};

export default Leaderboard;