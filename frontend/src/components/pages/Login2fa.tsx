import React from 'react'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { encode } from 'hi-base32';
import QRCode from 'qrcode.react';
import OTPInput from 'react-otp-input';
import base32 from 'base32-encode';
import axios from 'axios';

//import speakeasy from 'speakeasy';
//import notp from 'notp';
//import queryString from "query-string"
import '../../css/login.css'

interface Props {
    is2faEnabled: boolean
    isAuth: boolean
	setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
	setCode: React.Dispatch<React.SetStateAction<string | null>>
    userId: string | null
}




const Login2fa: React.FC<Props> = ({ setIsAuth, isAuth, is2faEnabled, setCode, userId }) => {

    const [otp, setOTP] = useState<string>('');
    const [secret2FA, setSecret2FA] = useState<string>('');
    const navigate = useNavigate();


    // Generate new key for user
    const generateSecret = async () =>
    {
        try {
            const url2Fa = 'http://localhost:5000/pong/users/auth/2fa/30';
            const secret = await axios.get<string>(url2Fa);
            if (secret.status === 200) {
                return secret.data;
            }
        } catch (error) {
            console.log(error);
            //return String(process.env.REACT_APP_DEFAULT_2FA);
        }
    }
    useEffect(() => {
        const Utils_2faSetup = async () => {
            const generatedSecret = await generateSecret();
            if (generatedSecret)
               setSecret2FA(String(generatedSecret));
        }
        Utils_2faSetup();
    }, [])

	const handle2fa = async () => 
    {
        // send code to backend for verification
        try {
            const validate = await axios.post('http://localhost:5000/pong/users/auth/2fa', {token: otp, userId});
            if (validate.status === 200) {
                setIsAuth(true);
                navigate('/');
            }
        }
        catch (error) {
            console.log('Error : ', error);
        }
    }

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
