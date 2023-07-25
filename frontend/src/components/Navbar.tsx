import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
import React, { Children } from 'react';
import axios from 'axios'
import { useEffect, useState } from 'react';

// Icons from https://heroicons.com/

interface Props {
	setIsAuth: React.Dispatch<React.SetStateAction<boolean>>,
	isAuth: boolean,
}


const Navbar: React.FC<Props> = ({ setIsAuth, isAuth}) => {
	const navigate = useNavigate();
    const [theme, setTheme] = useState('dark');
    var [loginBtnTxt, setLoginBtnTxt] = useState<string>("Log in");
 

	const authenticate = () => {
		const url42 = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-9c04e10e264f25f8b3cb9bef48ae57df091de510f43e87c7647da4b885b6210b&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code'; 
		window.location.href = url42;
		console.log(window.location.href);
		setIsAuth(true);
	}
	const handleLogout = () => {
            // contact server to delete access token
		if (isAuth) {
			setIsAuth(false)
		}
		else {
			authenticate();
			navigate('/')
		}
		navigate('/login')
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


	var msg: string;
	isAuth ? msg = 'Log out' : msg = 'Log in';

	var path: string;
	theme == 'dark' ? path = 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z' : path = 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z';

	return(
		<div className='w-full flex items-center justify-evenly'>
			<Button
					variant='link'
					onClick={() => navigate('/about')}
				>
					Transcendence 42
				</Button>
				
				<Button
					variant='link'
					type='submit'
					onClick={() => navigate('/')}
				>
					Home
				</Button>

				<Button
					variant='link'
					type='submit'
					onClick={() => navigate('/profile')}
				>
					Profile
				</Button>

				<Button
					variant='link'
					type='submit'
					onClick={() => navigate('/game')}
				>
					Play Pong
				</Button>
				
				<Button
					className=' bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
					type='submit'
					onClick={ handleLogout }
				>
					{ isAuth ? "Log Out" : "Log In" }
                </Button>
                <Button
					variant='ghost'
					onClick={handleThemeSwitch}
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  						<path strokeLinecap="round" strokeLinejoin="round" d={path}/>
					</svg>
				</Button>
		</div>
	)
}

export default Navbar
