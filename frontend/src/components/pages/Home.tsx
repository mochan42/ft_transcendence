import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from "../UserCard";
import Leaderboard from "../LeaderBoard";
import { Friend, User } from "../../types";
import ChatPageUsers from '../ChatPageUsers';
import ChatPageGroups from '../ChatPageGroups';
import About from './About';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { selectChatStore } from "../../redux/store";
import { HOME_SECTION } from "../../enums";
import HomeBoard from '../HomeBoard';
import EditProfile from '../EditProfile';
import { getSocket } from '../../utils/socketService';
import { BACKEND_URL } from '../../data/Global';

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
	state: string,
	token2fa: string,
	setToken2fa: React.Dispatch<React.SetStateAction<string>>,
	section: Number,
}



const Home = ({
	userCode,
	loginState,
	userId, setUserId,
	state,
	token2fa,
	setToken2fa,
	section
}: TUserState) => {

	const enum AuthResp {
		DEFAULT,
		IS2FA,
		ISNOT2FA
	}

	const [usersInfo, setUsersInfo] = useState<User[] | null>(null);
	const [authCount, setAuthCount] = useState<number>(0);
	const id = userId;
	const urlFriends = `${BACKEND_URL}/pong/users/` + id + '/friends';
	const [friends, setFriends] = useState<Friend[] | null>(null);
	const [userFriends, setUserFriends] = useState<User[] | null>(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [selectSection, setSelectSection] = useState<Number>(section);
	const [firstLogin, setFirstLogin] = useState<boolean>(false);
	const [showScreen, setShowScreen] = useState<'default' | 'achievements' | 'friends' | 'stats' | 'userProfile'>('default');
	const socket = getSocket(userId);
	const chatStore = useSelector(selectChatStore);

	const verifyToken = async (token: string): Promise<any> => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		const resp = await axios.post(`${BACKEND_URL}/pong/users/auth/token`, { token }, { headers });
		if (resp.status === 200) {
			return resp.data;
		}
	}
	const authenticateToAPI = async (token: string, state: string): Promise<any> => {
		if (token.length != 0 && state.length !== 0) {
			try {
				const headers = {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
				};

				const resp = await axios.post(`${BACKEND_URL}/pong/users/auth`, { token, state },
					{ withCredentials: true, headers: headers }
				);
				if (resp.status === 200) {
					const userAccessToken = resp.data;
					const userData = { ...userAccessToken, user: await verifyToken(userAccessToken.access_token) };
					if (userData.is2Fa === true) {
						loginState.setIsLogin(false);
						setToken2fa(userData.token2fa);
						Cookies.remove('userId');
						Cookies.remove('isAuth');
						return AuthResp.IS2FA;
					}
					else {
						loginState.setIsLogin(true);
						console.log(userData);
						if (userData.user === null) {
							return;
						}
						setUserId(userData.user.id.toString());
						if (userData.isFirstLogin) {
							setShowScreen('userProfile');
						}
						Cookies.set('userId', userData.user.id, { expires: 7 });
						Cookies.set('isAuth', 'true', { expires: 7 });
						Cookies.set('userName', userData.user.userNameLoc, { expires: 7 });
						return AuthResp.ISNOT2FA;
					}
				}
			}
			catch (error) {
				console.log('--------------------------Error authentication--------------------------\n');
			}
		}
	}

	const getUsersInfo = async () => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		try {
			const response = await axios.get<User[]>(`${BACKEND_URL}/pong/users/`, { headers });
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
			if (userId !== null) {
				const response = await axios.get<Friend[]>(urlFriends, { headers });
				if (response.status === 200) {
					setFriends(response.data);
				}
			}
		}
		catch (error) {
			console.log('Error receiving Friends information: ', error);
		}
	}

	useEffect(() => {
		if (userCode.code !== null && loginState.isLogin && userId === null) {
			(async () => {
				const codeTok = userCode.code + '';
				const auth = await authenticateToAPI(codeTok, state);
				if (auth == AuthResp.ISNOT2FA) {
					navigate('/');
				}
				if (auth === AuthResp.IS2FA) {
					navigate('/login2fa');
				}
			})();
		}
	}, [userId]);

	useEffect(() => {
		(async () => {
			if (userId !== null && loginState.isLogin) {
				if (friends === null) {
					getFriends()
				}
				if (usersInfo === null) {
					getUsersInfo()
				}
				if (userFriends === null && usersInfo) {
					const _userFriends = usersInfo?.filter((user) =>
						friends?.some((friend) => (friend.sender == user.id || friend.receiver == user.id) && user.id != userId)
					);
					if (_userFriends !== null) {

						setUserFriends(_userFriends);
					}
				}
			}
		})();
	}, [userId, loginState.isLogin, friends]);

	if (socket) {
		// ---new channel created---------------
		socket.on('newChannel', (channel: any) => {
			console.log('channel created successfully');
			console.log(channel);
		});
		// --friend invitation sent ------
		socket.on('invitedByFriend', (receiver: any) => {

			console.log('friend invited successfully', receiver);
		});

		// ------------disconnexion-----------------------------
		socket.on('disconnected', (user: any) => {
			console.log(user.userNameLoc, 'is disconnected\n');
		});
		/******************************* */
	}

	if (!userId && !loginState.isLogin) {
		return (
			<>
				<About isAuth={loginState.isLogin}></About>
			</>
		);
	}
	else {
		return (
			<>
				<div className='h-5/6 w-full relative'>
					<div className="flex h-full w-30 p-1 bg-gray-200 justify-between">
						<div className="space-y-8 min-w-[70px]">
							<HomeBoard section={selectSection} setSection={setSelectSection} />
						</div>
						<div className="flex w-full">
							{selectSection === HOME_SECTION.PROFILE && (
								<div className="flex justify-evenly space-y-8 items-center h-full w-full">
									<div className="flex flex-col space-y-2 h-4/5">
										<UserCard userId={userId} />
										<div className='space-y-2 flex flex-col items-center gap-4 bg-slate-900 rounded-lg text-slate-200 justify-around gap-y-8 h-2/3'>
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
											)) : null }
										</div>
									</div>
									<div className='w-2/3 h-5/6'>
										{socket !== null && <Leaderboard userId={userId} />}
									</div>
								</div>
							)}
							{selectSection === HOME_SECTION.CHAT_USER && <ChatPageUsers userId={userId} />}
							{selectSection === HOME_SECTION.CHAT_GROUP && <ChatPageGroups userId={userId} />}
						</div>
					</div>
				</div>
				{showScreen === 'userProfile' && <EditProfile setShowScreen={setShowScreen} userId={userId} />}
			</>
		);
	}
}

export default Home