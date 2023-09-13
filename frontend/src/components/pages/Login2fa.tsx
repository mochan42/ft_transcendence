import React from 'react'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios';
import Cookies from 'js-cookie';

//import speakeasy from 'speakeasy';
//import notp from 'notp';
//import queryString from "query-string"
import '../../css/login.css'

interface Props {
    isAuth: boolean
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
    setUserId: React.Dispatch<React.SetStateAction<string | null>>
    userId: string | null
}




const Login2fa: React.FC<Props> = ({ setIsAuth, isAuth, setUserId, userId }) => {

    const [otp, setOTP] = useState<string>('');
    const [secret2FA, setSecret2FA] = useState<string>('');
    const [btnValidate, setBtnValidate] = useState<number>(0);
    const [id, setId] = useState<string | null>("0");
    const navigate = useNavigate();
    const generateSecret = async () => {
        try {
            const url2Fa = 'http://localhost:5000/pong/users/auth/2fa/' + id;
            const secret = await axios.get<string>(url2Fa);
            if (secret.status === 200) {
                return secret.data;
            }
        } catch (error) {
            console.log(error);
        }
        //return String(process.env.REACT_APP_DEFAULT_2FA);
    }


	setId(userId);
    const handle2fa = async () => {
        // send code to backend for verification
        try {
            console.log(secret2FA);
            const validate = await axios.post('http://localhost:5000/pong/users/auth/2fa', { token: otp, userId: id + '' });
            if (validate.status === 200) {
                if (validate.data === 'OK') {
                    Cookies.set('userId', id + '', { expires: 7 });
                    Cookies.set('isAuth', 'true', { expires: 7 });
                    setIsAuth(true);
                    setUserId(id);
                    navigate('/');
                }
                else
                    console.log('Error 2FA');
            }
        }
        catch (error) {
            console.log('Error : ', error);
        }
        setBtnValidate(btnValidate + 1);
    }

    useEffect(() => {
        const utils_2faSetup = async (secret2FA: string | undefined) => {
			const generatedSecret = await generateSecret();
			secret2FA = generatedSecret;
			if (secret2FA)
				setSecret2FA(String(generatedSecret));
		}
		const generateSecret = async () => {
        console.log('USER ID : ', id);
        try {
            const url2Fa = 'http://localhost:5000/pong/users/auth/2fa/' + id;
            const secret = await axios.get<string>(url2Fa);
            if (secret.status === 200) {
                return secret.data;
            }
        } catch (error) {
            console.log(error);
        }
        //return String(process.env.REACT_APP_DEFAULT_2FA);
    	}
		(async () => {
            setUserId(null);
            await utils_2faSetup(secret2FA);
        })();
		
    }, [btnValidate, secret2FA, setUserId, id]);

    return (
        <div className='h-screen bg-gray-200 dark:bg-slate-900 w-full grid place-items-center'>
            <div >
                <div className='login__form_item'>
                    <Button>
                        Scan QRCode
                    </Button>
                </div>
                <div className='login__form_item'>
                    <QRCode value={secret2FA} />
                </div>

                <div className='login__form_item input'>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                        width={50}
                    />
                </div>
                <div className='login__form_item'>
                    <Button
                        type='submit'
                        onClick={handle2fa}
                    >
                        validate
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Login2fa
