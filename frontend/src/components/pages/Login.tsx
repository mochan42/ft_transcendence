import React from 'react'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'

interface Props {
	setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
}

const Login: React.FC<Props> = ({ setIsAuth }) => {
	const navigate = useNavigate()
	const handleLogin = () => {
		setIsAuth(true)
		navigate('/profile')
	}
	return (
		<div className='h-screen bg-gray-200 dark:bg-slate-900 w-full grid place-items-center'>
			<Button type='submit' onClick={handleLogin} variant='ghost'>
				Log in!
			</Button>
		</div>
	)
}

export default Login
