import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from "../UserCard";
import Leaderboard from "../LeaderBoard";
import ChatBoard from '../ChatBoard';
import { Friend, User } from "../../types";
import ChatPageUsers from '../ChatPageUsers';
import ChatConversation from '../ChatConversation';
import About from './About';
import Cookies from 'js-cookie';

type TUserState = {
	userCode: {
		code: (string | null)
		setCode: React.Dispatch<React.SetStateAction<string | null>>
	},
	loginState: {
		isLogin: boolean
		setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
	},
	userId: string | null,
	setUserId: React.Dispatch<React.SetStateAction<string | null>>,
	// is2faEnabled: boolean,
	state: string
}

const Home = ({ userCode, loginState, userId, setUserId, state }: TUserState) => {
	const [usersInfo, setUsersInfo] = useState<User[] | null>(null);
	const id = userId;
	const urlFriends = 'http://localhost:5000/pong/users/' + id + '/friends';
	const [userFriends, setUserFriends] = useState<User[] | null>(null);
	const [friends, setFriends] = useState<Friend[] | null>(null);
	const [is2fa, setIs2fa] = useState<boolean>(false);
	const navigate = useNavigate();


	const authenticateToAPI = async (token: string, state: string) => {
		if (token.length !== 0 && state.length !== 0) {
			try {
				const resp = await axios.post('http://localhost:5000/pong/users/auth', { token, state });
				if (resp.status === 200) {
					const user = resp.data;
					if (user.is2Fa) {
						setUserId(user.id.toString());
						loginState.setIsLogin(false);
						Cookies.remove('userId');
						Cookies.remove('isAuth');
						return navigate('/login2fa');
					}
					else {
						setUserId(user.id.toString());
						Cookies.set('userId', user.id, { expires: 7 });
						Cookies.set('isAuth', 'true', { expires: 7 });
						navigate('/');
					}
				}
			}
			catch (error) {
				console.log('Error auth', error);
				loginState.setIsLogin(false);
				navigate('/login');
			}
		}

	}
	const getUsersInfo = async () => {
		try {
			const response = await axios.get<User[]>('http://localhost:5000/pong/users/');
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
			if (userId != null) {
				const response = await axios.get<Friend[]>(urlFriends);
				if (response.status === 200) {
					setFriends(response.data);
					console.log('Received Friends data', response.data);
				}
			}
		}
		catch (error) {
			console.log('Error receiving Friends information: ', error);
		}
	}

	useEffect(() => {
		(async () => {
			if (userId != null && loginState.isLogin) {
				if (friends === null) {
					await getFriends()
				}
				if (usersInfo === null) {
					await getUsersInfo()
				}
				if (userFriends === null && usersInfo) {
					const usersFriends = usersInfo?.filter((user) =>
						friends?.some((friend) => friend.sender === user.id || friend.receiver === user.id && user.id != userId)
					);
					if (userFriends != null) {
						setUserFriends(usersFriends);
					}
				}
			}
		})();
	}, [userId, loginState.isLogin]);
	useEffect(() => {
		(async () => {
			if (userCode.code !== null && !id) {
				return authenticateToAPI(userCode.code, state);
			}
		})();
	}, [userId, loginState]);

	console.log('userID und Loginstate: ', userId, ', ', loginState)
	if (!userId && !loginState.isLogin)
		return <><About isAuth={loginState.isLogin}></About></>
	// else if (userId && loginState)
	else
		return (
			<>
				<div className='h-5/6'>
					<div className="flex flex-wrap h-full">
						<div className="w-1/3 bg-slate-200 p-4 h-1/2">
							<UserCard userId={userId} foundMatch={false} info={'profile'}></UserCard>
						</div>
						<div className="w-2/3 bg-slate-200 p-4">
							<div className='bg-slate-900 rounded-lg h-full w-full'>
								<Leaderboard userId={userId} />
							</div>
						</div>
						<div className="w-1/3 bg-slate-200 p-4 h-1/2">
							<div className="overflow-y-auto flex-cols text-center h-full space-y-4 rounded-lg flex items-center justify-center">
								<div className="space-y-2 flex flex-col justify-between gap-4 rounded-lg">
									<div className="flex flex-row justify-between items-center min-w-[200px] min-h-[200px] bg-slate-900 text-center rounded-lg">
										{userFriends != null ? userFriends.map((user, index) => (
											<div key={index}>
												<img
													className="h-6 w-6 dark:bg-slate-200 rounded-full"
													src={user.avatar}
													alt="Achievement badge"
													/>
												{user.userNameLoc}
											</div>
										)) : <img className='h-full w-full rounded-lg' src='https://media0.giphy.com/media/KG4ST0tXOrt1yQRsv0/200.webp?cid=ecf05e4732is65t7ah6nvhvwst9hkjqv0c52bhfnilk0b9g0&ep=v1_stickers_search&rid=200.webp&ct=s' />}
									</div>
								</div>
							</div>
						</div>
						<div className="h-1/2 w-2/3 bg-slate-200 p-4">
							<div className="flex h-full w-full bg-slate-900 p-4 text-center rounded-lg">
								<ChatBoard/>
								<ChatPageUsers/>
								<ChatConversation userId={userId}/>
							</div>
						</div>
					</div>
				</div>
			</>
		)
}

export default Home