import { Button } from "../ui/Button"
//import { useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
}

const Home = ({userCode, loginState}: TUserState) => {

    const navigate = useNavigate();

    useEffect(
        () => {

                const urlBrowser = window.location.href;
                
                // parse the url and retrieve the query parameters
                const urlSearchParams = new URLSearchParams(urlBrowser.split('?')[1]);
                console.log(urlSearchParams);
                Array.from((urlSearchParams.entries())).map(([key, value])=> 
                {
                    if ( key === "code" ) 
                    {
                        userCode.setCode(value);
                        loginState.setIsLogin(true);
                        // send received code to the backend for further verification
                        window.history.pushState({}, '', "http://localhost:3000");
                    }
                    else
                    { navigate('/about')}
                })

            }
    ,[ userCode.code, loginState.isLogin ])
    //if ((loginState.isLogin === false)) navigate('/about');
    
//import { Button } from "../ui/Button"

	return (
		<div className='h-screen bg-gray-200 dark:bg-slate-900 w-full grid place-items-center'>
			<Button>
				Welcome Home!
			</Button>
			<div className="dark:text-slate-200">
           		{ loginState.isLogin && <h3>Received code : { userCode.code }</h3> }
            	<h3>Login state : { (loginState.isLogin && userCode.code) ? "Active" : "Inactive" }</h3>
			</div>
		</div>
	)
}

export default Home
