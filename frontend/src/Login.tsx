import { useState } from "react";
import { useNavigate } from "react-router-dom"
// import {GoogleLogin, GoogleLogout } from 'react-google-login'
import icon_42 from './img/icon_42.png'
import icon_gmail from './img/icon_gmail.png'

const UserLogin = () => {
    const   [email, setEmail] = useState('');
    const   [passwd, setPasswd] = useState('');
    const   [isPending, setIsPending] = useState(false);
    const   [log42, setLog42] = useState(false);
    const   [logGoogle, setLogGoogle] = useState(false);
    const   client_id_google = "770314806688-o3cr2rn0mcnh6hvb7p0dtlabpg0p0f8n.apps.googleusercontent.com"
    const   client_id_42 = "u-s4t2ud-d47fc78f47a2cc31da6c325194c23e4780ec811e2f6ae9d2e992346ac0ef851c";
    const   url_auth_42 = "https://api.intra.42.fr/oauth/authorize?client_id=" + client_id_42 + "&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code";


    const handleClickBtn42 = (e) => { setLog42(true); }
    const handleClickBtnGoogle = (e) => { setLogGoogle(true); }
    const onLoginSuccess = (res) => { 
        setLogGoogle(true); 
        console.log("Google login: ", res.profileObj);
        console.log("Login succeeded");
    }
    const onFailureSuccess = (res) => { 
        setLogGoogle(false); 
        console.log("Google login: ", res);
        console.log("login failed");
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
//        const logger = { email, passwd };
        setIsPending(true);
       if (log42)
       {
            window.location.href =  url_auth_42;
            setLog42(false);
       }
       else if (logGoogle)
       {
            //window.location.href =  url_auth_google;
            setLogGoogle(false);
       }
    }
    return (  
       <div className="createForm">
            <h2>Create User Account or Sign in </h2>
            <form onSubmit={ handleSubmit }>
                <div>
                    <label>Login</label>
                    <div className="loginIcon">
                        <div>
                            <button onClick={ handleClickBtn42 }>
                                <img src={icon_42}/>
                            </button>
                            <GoogleLogin
                                clientId = { client_id_google }
                                buttonText="Login"
                                onSuccess={ onLoginSuccess }
                                onFailure={ onFailureSuccess }
                                cookiePolicy="single_host_origin"
                            />
                            
{/* 
                            <button onClick={ handleClickBtnGoogle }>
                                <img src={icon_gmail}/>
                            </button>
*/}
                        </div>
                    </div>
                </div>

                <label>Email </label>
                <input type="text"
                    value = { email } 
                    onChange={ (e) => setEmail(e.target.value) }/>
                <label>Password </label>
                <input 
                    type = "password"
                    value = { passwd } 
                    onChange={ (e) => setPasswd(e.target.value) }>
                </input>
                { !isPending && <button>login</button>}
                { !isPending && <button>signup</button>}
                { isPending && <button disabled>Authenticating...</button>}
            </form>
       </div>
    );
}
 
export default UserLogin;