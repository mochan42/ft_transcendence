import { Navigate, useNavigate } from 'react-router-dom'
import Button from './ui/Button'
import React, { Children } from 'react';
import { useState } from 'react';
import axios from 'axios'

interface Props {
	setIsAuth: React.Dispatch<React.SetStateAction<boolean>>,
	isAuth: boolean,
}


const Navbar: React.FC<Props> = ({ setIsAuth, isAuth}) => {
	const navigate = useNavigate();
    var [loginBtnTxt, setLoginBtnTxt] = useState<string>("Log in");
    var [integer, setInteger ] = useState<number>(0);
    var [redirectState, setRedirectState ] = useState<boolean>(false);

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

    const HandlerLogin = () => 
    {
        var state = false;
        const   client_id_42 = "u-s4t2ud-d47fc78f47a2cc31da6c325194c23e4780ec811e2f6ae9d2e992346ac0ef851c";
        const   url_auth_42 = "https://api.intra.42.fr/oauth/authorize?client_id=" + client_id_42 + "&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code";

        setRedirectState(true);
        window.location.href =  url_auth_42;
        /*
        axios.get(url_auth_42).then
        ( ()=>
            {
                console.log('hello');
                setLoginBtnTxt("Log Out");
            }
        )
        */
        state = true;
        return (state);
    }

	return(
		<div className='w-full flex items-center justify-evenly'>
			<Button
					className='text-black bg-transparent dark:bg-transparent underline-offset-4 hover:underline dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent'
					onClick={() => navigate('/about')}
				>
					Transcendence Project 42
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
					onClick={ (e) => 
                              { 
                                //HandlerLogin();
                                setIsAuth( HandlerLogin());
                                console.log(integer);
                                if (isAuth)
                                {
                                    setInteger(integer++);
                                    setLoginBtnTxt("Log Out");
                                    console.log(integer);
                                    setTimeout(()=> { alert(loginBtnTxt)}, 1000);
                                    navigate('/');
                                }
                              }
                            }
				>
					{loginBtnTxt}
				</Button>
		</div>
	)
}

export default Navbar