import { useEffect, useState } from 'react';
import { Box, Stack, IconButton } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from "../UserCard";
import Leaderboard from "../LeaderBoard";
import ChatBoard from '../ChatBoard';
import { Friend, User } from "../../types";
import ChatPageUsers from '../ChatPageUsers';
import ChatConversation from '../ChatConversation';

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
    is2faEnabled : boolean
}

const Home = ({ userCode, loginState, userId, setUserId, is2faEnabled }: TUserState) => {
	const [usersInfo, setUsersInfo] = useState< User[] | null >(null);
	const id = userId;
	const urlFriends = 'http://localhost:5000/pong/users/' + id + '/friends';
	const [userFriends, setUserFriends] = useState<User [] | null >(null);
	const [friends, setFriends] = useState< Friend [] | null>(null);
    const navigate = useNavigate();
    

    const authenticateToAPI = async (token: string) => {
		try {
			const resp = await axios.post('http://localhost:5000/pong/users/auth', { token });
			if (resp.status === 200) {
				setUserId(resp.data);
			}
		}
		catch (error) {
			console.log("Error user authentication", error);
		}
    }

    //  useEffect(() => {
    //         const urlBrowser = window.location.href;
    //         // parse the url and retrieve the query parameters
    //         const urlSearchParams = new URLSearchParams(urlBrowser.split('?')[1]);
    //         console.log(urlSearchParams);
    //         Array.from((urlSearchParams.entries())).map(([key, value]) => {
    //             if (key === "code") {
    //                 userCode.setCode(value);
    //                 loginState.setIsLogin(true);
    //                 // send received code to the backend for further verification
    //                 window.history.pushState({}, '', "http://localhost:3000/profile");
    //             }
    //             else { navigate('/about') }
    //         })
    //     }
    //     , [userCode.code, loginState.isLogin]);
    
    // if (userCode.code) {
    //     authenticateToAPI(userCode.code);
    // }

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
			if (userFriends != null) {
				setUserFriends(usersFriends);
			}
		}
	}, []);

 
    useEffect( () => {
        if (userCode.code === null)
        { 
            navigate('/about')
        }
        else
        {
            if (is2faEnabled && loginState.isLogin === false && userCode.code != null)
            { navigate('/login2fa') }
            else
            {
                // do nothing
                // condition ok to grant access to home page
                //loginState.setIsLogin(true);
            }
        }
    },
    [])

    if (userCode.code != null) {
        authenticateToAPI(userCode.code);
        //navigate('/profile');
    }
	return (
		<>
            <div className="flex flex-wrap h-screen">
				<div className="w-1/3 bg-slate-200 p-4 h-1/2">
					<UserCard userId={userId} foundMatch={false} info={'profile'}></UserCard>
				</div>
				<div className="w-2/3 bg-slate-200 p-4">
					<div className='bg-slate-900 rounded-lg h-full w-full'>
						<Leaderboard userId={userId} />
					</div>
				</div>
				<div className="w-1/3 bg-slate-200 p-4 h-1/2">
					<div className="h-full overflow-y-auto flex-cols text-center space-y-4 rounded-lg flex items-center justify-center">
						<div className="space-y-2 flex flex-col justify-between gap-4 rounded-lg">
							<div className="flex flex-row justify-between items-center min-w-[220px] bg-slate-900 text-center rounded-lg">
								{userFriends != null ? userFriends.map((user, index) => (
									<div key={index}>
										<img
										className="h-6 w-6 dark:bg-slate-200 rounded-full"
										src={user.avatar}
										alt="Achievement badge"
										/>
											{user.userNameLoc}
									</div>
								)) : <img className='h-96 w-96 rounded-lg' src='https://media0.giphy.com/media/KG4ST0tXOrt1yQRsv0/200.webp?cid=ecf05e4732is65t7ah6nvhvwst9hkjqv0c52bhfnilk0b9g0&ep=v1_stickers_search&rid=200.webp&ct=s'/>}
							</div>
						</div>
					</div>
				</div>
				<div className="w-2/3 bg-slate-200 p-4 h-1/2">
					<div className='bg-slate-900 rounded-lg h-full w-full'>
						{/* Chat window content goes here */}
                        <Stack p={1} direction={"row"}
                            sx={{
                                //display:"grid",
                                //gridTemplateColumns: "0.1fr 0.4fr 1.5fr",
                                //gridTemplateRows: "1fr",
                                gridGap: "0px",
                                height:"100%",
                                width: "100%",
                            }}
                        >
                            <ChatBoard/>
                            <ChatPageUsers/>
                            <ChatConversation/>
                        </Stack>
					</div>
				</div>
			</div>
			<div className="dark:text-slate-200">

           		{ loginState.isLogin && <h3>Received code : { userCode.code }</h3> }
            	<h3>Login state : { (loginState.isLogin && userCode.code) ? "Active" : "Inactive" }</h3>
			</div>
		</>
	)
}

export default Home
