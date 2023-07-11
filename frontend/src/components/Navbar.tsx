import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
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
					variant='link'
					type='submit'
					onClick={() => navigate('/')}
				>
					Chat
				</Button>
				
				<Button
					onClick={() => handleLogout()}
				>
					{msg}
				</Button>
		</div>
	)
}

export default Navbar