import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from "../UserCard";
import Leaderboard from "../LeaderBoard";
import ChatBoard from '../HomeBoard';
import { Friend, User } from "../../types";
import ChatPageUsers from '../ChatPageUsers';
import ChatPageGroups from '../ChatPageGroups';
import About from './About';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from "react-redux";
import { selectChatStore } from "../../redux/store";
import { Stack } from "@mui/material";
import { HOME_SECTION, logStatus } from "../../enums";
import HomeBoard from '../HomeBoard';
import EditProfile from '../EditProfile';
import { getSocket } from '../../utils/socketService';


type TUserState = {
    userCode : {
        code: (string | null )
        setCode: React.Dispatch<React.SetStateAction<string | null>>
    },
    loginState : {
        isLogin: boolean
        setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
	},
	userId: string | null,
	setUserId: React.Dispatch<React.SetStateAction<string | null>>,
	// is2faEnabled: boolean,
    state: string,
    token2fa: string,
    setToken2fa: React.Dispatch<React.SetStateAction<string>>,
}



const Home = ({
	userCode,
	loginState,
	userId, setUserId,
	state,
	token2fa,
	setToken2fa,
}: TUserState) => {

	const enum AuthResp {
		DEFAULT,
		IS2FA,
		ISNOT2FA
	}
	
	const [usersInfo, setUsersInfo] = useState<User[] | null>(null);
	const [authCount, setAuthCount] = useState<number>(0);
	const id = userId;
	const urlFriends = 'https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev/pong/users/' + id + '/friends';
	const [userFriends, setUserFriends] = useState<User[] | null>(null);
	const [friends, setFriends] = useState<Friend[] | null>(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [section, setSection] = useState<Number>(0);
	const [firstLogin, setFirstLogin] = useState<boolean>(false);
	const [showScreen, setShowScreen] = useState<'default' | 'achievements' | 'friends' | 'stats' | 'userProfile'>('default');
	const socket = getSocket(userId);

	const authenticateToAPI = async (token: string, state: string): Promise<any> => {
		if (token.length != 0 && state.length !== 0) {
			try {
				const resp = await axios.post('https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev/pong/users/auth', { token, state },
				{withCredentials: true}
				);
				if (resp.status === 200) {
					const userData = resp.data;
					if (userData.is2Fa === true) {
						loginState.setIsLogin(false);
						setToken2fa(userData.token2fa);
						Cookies.remove('userId');
						Cookies.remove('isAuth');
						return AuthResp.IS2FA;
					}
					else {
						loginState.setIsLogin(true);
						if (userData.user === null) {
							return;
						}
						setUserId(userData.user.id.toString());
						if (userData.isFirstLogin) {
							setShowScreen('userProfile');
						}
						Cookies.set('userId', userData.user.id, { expires: 7 });
						Cookies.set('isAuth', 'true', { expires: 7 });
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
		try {
			const response = await axios.get<User[]>('https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev/pong/users/');
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
			if (userId !== null) {
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
					const usersFriends = usersInfo?.filter((user) =>
						friends?.some((friend) => friend.sender === user.id || friend.receiver === user.id && user.id != userId)
					);
					if (userFriends !== null) {
						setUserFriends(usersFriends);
					}
				}
			}
		})();
	}, [userId, loginState.isLogin]);
	
	if (socket) {
		socket.on('message', (message: string) => {
			console.log(message);
		});
		// ---new channel created---------------
		socket.on('channel_created', (channel: any) => {
			console.log('channel created successfully');
			console.log(channel);
		});
		// --friend invitation sent ------
		socket.on('invite_friend_success', (friend: any) => {
			console.log('friend invited successfully', friend);
		});

		// ------------disconnexion-----------------------------
		socket.on('disconnected', (user: any) => {
			console.log(user.userNameLoc, 'is disconnected\n');
		});
		/******************************* */
	}
	// // hack for access
	// // to be removed later
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
				<div className='h-5/6'>
					<div className="flex flex-wrap h-full">
						<Stack
							direction={"row"} height={"100%"} p={1} bgcolor={"#eee"}
							justifyContent={"space-between"} alignItems={"centered"}
						>
							<Stack spacing={2} width={70}>
								<HomeBoard section={section} setSection={setSection} />
							</Stack>
							<Stack sx={{
								gridGap: "0px",
								height: "100%",
								width: "100%",
							}}
							>
								{
									(section === HOME_SECTION.PROFILE) ?
										(
											<Stack direction={"row"} justifyContent={"space-between"}
												alignItems={"centered"}
											>
												<Stack width={400} spacing={2} justifyContent={"space-between"}>
													<UserCard userId={userId}></UserCard>
													<div className="flex flex-row justify-between items-center min-w-[200px] min-h-[200px] bg-slate-900 text-center rounded-lg">
														{userFriends != null ? userFriends.map((user, index) => (
															<div key={index}>
																<img
																	className="h-6 w-6 dark:bg-slate-200 rounded-full"
																	src={user.avatar}
																	alt="Achievement badge"
																/> {user.userNameLoc}
															</div>
														)) : <img className='h-full w-full rounded-lg' src='https://media0.giphy.com/media/KG4ST0tXOrt1yQRsv0/200.webp?cid=ecf05e4732is65t7ah6nvhvwst9hkjqv0c52bhfnilk0b9g0&ep=v1_stickers_search&rid=200.webp&ct=s' />}
													</div>
												</Stack>
												<Stack width={1440} paddingLeft={1} >
													{(socket !== null) ? (<Leaderboard userId={userId}/>) : (<></>)}
												</Stack>
											</Stack>
										)
										: null
							
								}
								{section === HOME_SECTION.CHAT_USER ? <ChatPageUsers userId={userId} /> : null}
								{section === HOME_SECTION.CHAT_GROUP ? <ChatPageGroups userId={userId}  /> : null}
								{section === HOME_SECTION.GAME_REQUEST ? <ChatPageUsers userId={userId}  /> : null}

							</Stack>
						</Stack>
					</div>
				</div>
				{showScreen === 'userProfile' ? <EditProfile setShowScreen={setShowScreen} userId={userId}/> : null}
			</>
		);
	}
}

export default Home