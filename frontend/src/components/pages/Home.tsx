import { Button } from "../ui/Button"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from "../UserCard";
import Friends from "../Friends";
import Leaderboard from "../LeaderBoard";

type TUserState = {
    userCode : {
        code: (string | null )
        setCode: React.Dispatch<React.SetStateAction<string | null>>
    },
    loginState : {
        isLogin: boolean
        setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
    }
	userId: number,
}

const Home = ({ userCode, loginState, userId }: TUserState) => {

    const navigate = useNavigate();
        const authenticateToAPI = async (token: string) => {
        const resp = await axios.post('http://localhost:5000/pong/users/auth', { token });
        if (resp.status === 200) {
            alert(resp.data);
            sessionStorage.setItem('userId', resp.data);
        }
    }
    useEffect(
        () => {

            const urlBrowser = window.location.href;
            // parse the url and retrieve the query parameters
            const urlSearchParams = new URLSearchParams(urlBrowser.split('?')[1]);
            console.log(urlSearchParams);
            Array.from((urlSearchParams.entries())).map(([key, value]) => {
                if (key === "code") {
                    userCode.setCode(value);
                    loginState.setIsLogin(true);
                    // send received code to the backend for further verification
                    window.history.pushState({}, '', "http://localhost:3000/profile");
                }
                else { navigate('/about') }
            })
        }
        , [userCode.code, loginState.isLogin]);
    
    if (userCode.code) {
        authenticateToAPI(userCode.code);
    }

	return (
		<>
            <div className="flex flex-wrap h-screen">
				<div className="w-1/3 bg-slate-200 p-4 h-1/2">
					<UserCard userId={userId} foundMatch={false} info={'profile'}></UserCard>
				</div>
				<div className="w-2/3 bg-slate-200 p-4">
					<div className='bg-slate-900 rounded-lg h-full w-full'>
						<Leaderboard />
					</div>
				</div>
				<div className="w-1/3 bg-slate-200 p-4 h-1/2">
					<div className="h-full overflow-y-auto flex-cols text-center justify-between space-y-4">
						<div className='space-y-2 border-t-8 border-slate-900 bg-slate-900 text-amber-400 rounded-lg flex-cols justify-evenly items-baseline'>
							<div className='flex items-center justify-around '>
								<img className='h-16 w-16 bg-slate-200 dark:bg-slate-200 rounded-full' src='https://www.svgrepo.com/show/529148/question-circle.svg'/>
								<p>
									Friend
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="w-2/3 bg-slate-200 p-4 h-1/2">
					<div className='bg-slate-900 rounded-lg h-full w-full'>
						{/* Chat window content goes here */}
					</div>
				</div>
			</div>
			<div className="dark:text-slate-200">
           		{ loginState.isLogin && <h3>Received code : { userCode.code }</h3> }
            	<h3>Login state : { (loginState.isLogin && userCode.code) ? "Active" : "Inactive" }</h3>
			</div>
		</>
	)
}

export default Home
