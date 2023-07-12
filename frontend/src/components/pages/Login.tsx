import React from 'react'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'

interface Props {
	setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
}
//    const   client_id_google = "770314806688-o3cr2rn0mcnh6hvb7p0dtlabpg0p0f8n.apps.googleusercontent.com"
    
    
const Login: React.FC<Props> = ({ setIsAuth }) => 
{
	const navigate = useNavigate()
	const handleLogin = () => 
    {
        const   client_id_42 = "u-s4t2ud-d47fc78f47a2cc31da6c325194c23e4780ec811e2f6ae9d2e992346ac0ef851c";
        const   url_auth_42 = "https://api.intra.42.fr/oauth/authorize?client_id=" + client_id_42 + "&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code";
        
        setIsAuth(true)
        window.location.href =  url_auth_42;
		
		//navigate('/profile')
	}
	return (
		<div className='h-screen bg-gray-200 w-full grid place-items-center'>
			<Button type='submit' onClick={handleLogin} className='text-black bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent'>
				Log in!
			</Button>
		</div>
	)
}

export default Login
