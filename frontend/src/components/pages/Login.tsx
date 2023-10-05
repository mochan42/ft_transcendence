import React from 'react';
import icon_42 from '../../img/icon_42-blank.png';
import '../../css/login.css';

interface Props {
    isAuth: boolean
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
    state: any
}
//    const   client_id_google = "770314806688-o3cr2rn0mcnh6hvb7p0dtlabpg0p0f8n.apps.googleusercontent.com"
    

const Login: React.FC<Props> = ({setIsAuth, isAuth, state}) => {
    const handleLogin = () => {
        const generatedState = state;
        const client_id_42 = process.env.REACT_APP_UID;
        const url_auth_42 = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id_42}&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&state=${generatedState}`;
        window.location.href = url_auth_42;
    }
  
	return (
        <>
            <div className="login">
                <div >
                    <div>
                        <h3 className="login__form_title"> Login </h3>
                    </div>
                    <div className='login__form_item'>
                        <button type='submit' onClick={handleLogin} className="login__form_btn btn-42 ">
                            <img src={icon_42} alt='42 Icon'/>
                        </button>
                    </div>
                </div>
        		{ /*<div className='h-screen bg-gray-200 w-full grid place-items-center'> */ }
        		<div className='login__form_item'>
        			<button type='submit' onClick={handleLogin} className="login__form_btn btn-42 ">
        			    <img src={icon_42}/>
        			</button>
        		</div>
            </div>
        </>
	)
}

export default Login
