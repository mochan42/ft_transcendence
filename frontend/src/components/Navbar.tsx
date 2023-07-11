import { Navigate, useNavigate } from 'react-router-dom'
import Button from './ui/Button'
import React, { Children } from 'react';

interface Props {
	setIsAuth: React.Dispatch<React.SetStateAction<boolean>>,
	isAuth: boolean,
}

const Navbar: React.FC<Props> = ({ setIsAuth, isAuth}) => {
	const navigate = useNavigate();
	const handleLogout = () => {
		if (isAuth) {
			setIsAuth(false)
			navigate('/about')
		}
		else {
			setIsAuth(true)
			navigate('/')
		}
	}
	var msg: string;
	isAuth ? msg = 'Log out' : msg = 'Log in';
	return(
		<div className='w-full flex items-center justify-evenly'>
			<Button
					className='text-black bg-transparent dark:bg-transparent underline-offset-4 hover:underline dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent'
					onClick={() => navigate('/about')}
				>
					Transcendence 42
				</Button>
				
				<Button
					className='text-black bg-transparent dark:bg-transparent underline-offset-4 hover:underline dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent'
					type='submit'
					onClick={() => navigate('/')}
				>
					Home
				</Button>

				<Button
					className='text-black bg-transparent dark:bg-transparent underline-offset-4 hover:underline dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent'
					type='submit'
					onClick={() => navigate('/profile')}
				>
					Profile
				</Button>

				<Button
					className='text-black bg-transparent dark:bg-transparent underline-offset-4 hover:underline dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent'
					type='submit'
					onClick={() => navigate('/game')}
				>
					Play Pong
				</Button>

				<Button
					className='text-black bg-transparent dark:bg-transparent underline-offset-4 hover:underline dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent'
					type='submit'
					onClick={() => navigate('/')}
				>
					Chat
				</Button>
				
				<Button
					className=' bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
					type='submit'
					onClick={() => handleLogout()}
				>
					{msg}
				</Button>
		</div>
	)
}

export default Navbar