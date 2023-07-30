import { Button } from "../ui/Button"
//import { useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from "../UserCard";
//import queryString from "query-string"

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
            setTimeout(()=> alert(resp.data), 1000);
            sessionStorage.setItem('userId', resp.data);
        }
    }

    useEffect( () => {
        if (userCode.code === null || loginState.isLogin === false){ navigate('/about') }

    },
    [])

    if (userCode.code != null)
    {
        //console.log(userCode.code);
        authenticateToAPI(userCode.code);
    }
            
            
	return (
		<>
            <div className="flex flex-wrap h-screen">
				<div className="w-1/4 bg-slate-200 dark:bg-slate-900 p-4">
					<UserCard userId={userId} foundMatch={false} info={'profile'}></UserCard>
				</div>
				<div className="w-3/4 bg-gray-200 p-4">
				{/* Leaderboard content goes here */}
				</div>
				<div className="w-1/4 bg-gray-200 p-4">
				{/* Friends list content goes here */}
				</div>
				<div className="w-3/4 bg-gray-200 p-4">
				{/* Chat window content goes here */}
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
