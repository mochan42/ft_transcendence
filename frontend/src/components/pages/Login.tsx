import React from 'react'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import icon_42 from '../../img/icon_42-blank.png'
import icon_gmail from '../../img/google-icon-blank.png'
import '../../css/login.css'

interface Props {
    isAuth: boolean
	setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
}
//    const   client_id_google = "770314806688-o3cr2rn0mcnh6hvb7p0dtlabpg0p0f8n.apps.googleusercontent.com"
    

const Login: React.FC<Props> = ({setIsAuth, isAuth}) => {
	const handleLogin = () => 
    {
      const generatedState = 'this must be very secure but lazy dev put just a string';
      const client_id_42 = "u-s4t2ud-9c04e10e264f25f8b3cb9bef48ae57df091de510f43e87c7647da4b885b6210b";
      const url_auth_42 = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id_42}&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&state=${generatedState}`;
      window.location.href = url_auth_42;
    }
  
	return (
        <div className="login">
            <div > 
                <div> 
                    <h3 className="login__form_title"> Login </h3>
                </div>
        		{ /*<div className='h-screen bg-gray-200 w-full grid place-items-center'> */ }
        		<div className='login__form_item'>
        			<button type='submit' onClick={handleLogin} className="login__form_btn btn-42 ">
        			    <img src={icon_42}/>
        			</button>
        		</div>
                {/* login with google account is not required. clean up this section later */}
        		{/*<div className="">*/}
        			{ /*<Button type='submit' onClick={handleLogin} className='text-black bg-transparent
                     hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 data-[state=open]:bg-transparent
                      dark:data-[state=open]:bg-transparent'> */ }
                {/*
        			<button type='submit' onClick={handleLogin} className="login__form_btn">
        			    <img src={icon_gmail}/>
        			</button>
        		</div>
                */}
            </div>
        </div>
	)
}

export default Login
