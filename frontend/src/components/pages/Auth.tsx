// import { Button } from "../ui/Button"
// //import { useParams, useLocation } from 'react-router-dom'
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// //import queryString from "query-string"

// // type TUserState = {
// //     userCode : {
// //         code: (string | null )
// //         setCode: React.Dispatch<React.SetStateAction<string | null>>
// //     },
// //     loginState : {
// //         isLogin: boolean
// //         setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
// //     }
// // }

// const Auth = ({ setIsAuth }: any) => {

//     const navigate = useNavigate();
//     const authenticateToAPI = async (token: string | null) => {
//         alert(token);
//         const resp = await axios.post('http://localhost:5000/pong/users/auth', { token });
//         if (resp.status === 200) {
//             alert(resp.data);
//             sessionStorage.setItem('userId', resp.data);
//             setIsAuth(true);
//         }
//     }
//     useEffect(
//         () => {
//             alert('hello');
//             const urlBrowser = window.location.href;
//             // parse the url and retrieve the query parameters
//             const urlSearchParams = new URLSearchParams(urlBrowser.split('?')[1]);
//             console.log(urlSearchParams);
//             Array.from((urlSearchParams.entries())).map(([key, value]) => {
//                 if (key === "code") {
//                     sessionStorage.setItem('code', value);
//                     sessionStorage.setItem('Auth', 'connected');
//                     // send received code to the backend for further verification
//                     window.history.pushState({}, '', "http://localhost:3000");
//                 }
//                 else { navigate('/about') }
//             })
//         });
    
//     if (sessionStorage.getItem('code')?.length) {
//         const code = sessionStorage.getItem('code');
//         authenticateToAPI(code);
//     }
            
            
//     //if ((loginState.isLogin === false)) navigate('/about');
    
// //import { Button } from "../ui/Button"

// 	return (
// 		<div className='h-screen bg-gray-200 dark:bg-slate-900 w-full grid place-items-center'>
//             <Button>
// 				Welcome Home!
// 			</Button>
// 		</div>
// 	)
// }

// export default Auth;
