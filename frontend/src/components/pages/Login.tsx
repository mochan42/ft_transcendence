import React from 'react';
import icon_42 from '../../img/icon_42-blank.png';
import '../../css/login.css';
import { REDIRECT_URI } from '../../data/Global';


interface Props {
    isAuth: boolean
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
    state: string
}

const Login: React.FC<Props> = ({ setIsAuth, isAuth, state }) => {
    const handleLogin = () => {
        const generatedState = state;
        const client_id_42 = process.env.REACT_APP_UID;
        const url_auth_42 = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id_42}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${generatedState}`;
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
                            <img src={icon_42} alt='42 Icon' />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
