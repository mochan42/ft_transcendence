import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BACKEND_URL } from '../../data/Global';
import { OK } from '../../APP_CONSTS';


interface Props {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  token2fa: string;
  setToken2fa: React.Dispatch<React.SetStateAction<string>>;
}

const Login2fa: React.FC<Props> = ({ setIsAuth, isAuth, setUserId, token2fa }) => {
  const [secret, userId] = token2fa.split('_');
  const [otp, setOTP] = useState<string>('');
  const [secret2FA, setSecret2FA] = useState<string>(secret);
  const [btnValidate, setBtnValidate] = useState<number>(0);
  const [id, setId] = useState<string>(userId);
  const navigate = useNavigate();

  const generateSecret = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
      };
      const url2Fa = `${BACKEND_URL}/pong/users/auth/2fa/` + id;
      const secret = await axios.get<string>(url2Fa, { headers });
      if (secret.status === 200) {
        return secret.data;
      }
    } catch (error) {
      console.log(error);
    }
    return ''; // Return a default value or handle the error as needed.
  };

  const handle2fa = async () => {
    // send code to backend for verification
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
    };
    try {
      const validate = await axios.post(`${BACKEND_URL}/pong/users/auth/2fa`, { token: otp, userId: id + '' }, { headers });
      if (validate.status === 200) {
        if (validate.data === OK) {
          Cookies.set('userId', id + '', { expires: 7 });
          Cookies.set('isAuth', 'true', { expires: 7 });
          setIsAuth(true);
          setUserId(id);
          navigate('/');
        } else {
          const [retry, currId] = validate.data.split('_');
          setSecret2FA(retry);
        }
      }
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  useEffect(() => {
    // Avoid infinite re-renders by checking if btnValidate has changed
    if (btnValidate > 0) {
      (async () => {
        const generatedSecret = await generateSecret();
        setSecret2FA(String(generatedSecret));
      })();
    }
  }, [btnValidate, setSecret2FA, generateSecret]);

  return (
    <div className='h-screen bg-gray-200 dark:bg-slate-900 w-full grid place-items-center'>
      <div>
        <div className='login__form_item'>
          <Button>Scan QRCode</Button>
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
          <Button type='submit' onClick={handle2fa}>
            Validate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login2fa;
