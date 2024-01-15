import { useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
import React from 'react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getSocket } from '../utils/socketService';
import { BACKEND_URL } from '../data/Global';
import axios from 'axios';
import { User } from '../types';
import { LOG_STATE } from '../enums';
// Icons from https://heroicons.com/

interface Props {
	setIsAuth: React.Dispatch<React.SetStateAction<boolean>>,
	isAuth: boolean,
	setCode: React.Dispatch<React.SetStateAction<string | null>>,
	setUserId: React.Dispatch<React.SetStateAction<string | null>>
}


const Navbar: React.FC<Props> = ({ setIsAuth, isAuth, setCode, setUserId }) => {
	const navigate = useNavigate();
	const msg = (isAuth == true) ? 'Logout' : 'Log in';
	const [theme, setTheme] = useState('dark');
	const [logBtnMsg, setLogBtnMsg] = useState(msg);
	const socket = getSocket(Cookies.get('userId'));
	const url_info_1 = `${BACKEND_URL}/pong/users/`;
	const [userInfo, setUserInfo] = useState<User>();


	const handleLogout = () => {
		// contact server to delete access token
		if (isAuth) {
			if (socket != null) {
				socket.emit('userLogout', {});
			}
			setIsAuth(false);
			setUserId(null);
			setCode(null);
			Cookies.remove('isAuth');
			Cookies.remove('userId');
			Cookies.remove('userName');
		}
		navigate('/login');
	}


	const handleThemeSwitch = () => {
		setTheme(theme == 'dark' ? 'light' : 'dark');
	};

	useEffect(() => {
		if (theme == 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [theme]);

	useEffect(() => {
		const headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		async function fetchUserInfo() {
			try {
				const userId = Cookies.get('userId');
				if (userId && +userId > -1) {
					const url_info = url_info_1 + userId;
					const response = await axios.get<User>(url_info, { headers });
					if (response.status === 200) {
					setUserInfo(response.data);
					}
				}
			} catch (error) {
				console.log('Error fetching user info', error);
			}
		}
	
		const intervalId = setInterval(fetchUserInfo, 1000); // Call every 500 milliseconds
	
		// Clear the interval when the component is unmounted
		return () => clearInterval(intervalId);
	});

	useEffect(() => {
		if (!isAuth) setLogBtnMsg('Log in');
		else setLogBtnMsg('Log out');
	}, [isAuth, logBtnMsg]);

	var path: string;
	theme == 'dark' ? path = 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z' : path = 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z';

	return (

		<div className='w-full flex items-center justify-evenly'>
			{ userInfo && userInfo.currentState != LOG_STATE.INGAME ? 
			<>
				<Button
					variant='link'
					onClick={() => {navigate('/about')}}
				>
					Transcendence 42
				</Button>

				<Button
					variant='link'
					type='submit'
					onClick={() => {navigate('/')}}
				>
					Home
				</Button>

				<Button
					variant='link'
					type='submit'
					onClick={() => {navigate('/profile')}}
				>
					Profile
				</Button>

				<Button
					variant='link'
					type='submit'
					onClick={() => {navigate('/game'); if (userInfo) {userInfo.currentState = LOG_STATE.ONLINE}}}
				>
					Play Pong
				</Button>
			</>
			 : null}
			<Button
				variant='ghost'
				onClick={handleThemeSwitch}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
					<path strokeLinecap="round" strokeLinejoin="round" d={path} />
				</svg>
			</Button>
			<Button
				onClick={handleLogout}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
				</svg>
				{logBtnMsg}
			</Button>
		</div>
	)
}

export default Navbar
