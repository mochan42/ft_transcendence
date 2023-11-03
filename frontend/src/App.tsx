import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Login from './components/pages/Login';
import Login2fa from './components/pages/Login2fa';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import About from './components/pages/About';
import PageNotFound from './components/pages/PageNotFound';
import Footer from './components/Footer';
import Layout from './components/pages/Layout';
import GameSelection from './components/pages/GameSelection';
import Cookies from 'js-cookie';
import { Utils__isAPICodeAvailable } from './utils/utils__isAPICodeAvailable';
import { getSocket } from './utils/socketService';
import { Game, Chat } from './types';
import { updateChatUserMessages, updateChatDirectMessages } from "./redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectChatStore } from "./redux/store";
import { fetchAllMessages} from './data/ChatData';
import { fetchAllDirectMessages } from './components/ChatPageUsers';
import GameChallenge from './components/GameChallenge';



const App: React.FC = () => {

	const generateStrState = (): string  => {
		var token = '';
		const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@&#*./\\%!?_';
		for (let i = 0; i < 10; i++) {
			const min = 0;
			const max = letters.length;
			const idx = Math.floor(Math.random() * (max - min + 1)) + min;
			token += letters[idx];
		}
		return token;
	}
	const authSession: boolean = Cookies.get('isAuth') ? true : false;
	const userCookie = Cookies.get('userId');
	const idSession: string | null =  userCookie ? userCookie : null ;
	const [isAuth, setIsAuth] = useState<boolean>(authSession);
	const [userId, setUserId] = useState<string | null>(idSession);
	const [code, setCode] = useState<string | null>(null);
	const [state, setState] = useState<string>(generateStrState());
	const [token2fa, setToken2fa] = useState<string>('');
	const [challenge, setChallenge] = useState<boolean>(false);
	const [game, setGame] = useState< Game >();
	const socket = getSocket(userId);
	const dispatch = useDispatch();
    const chatStore = useSelector(selectChatStore);

    // check if code available for backend to exchange for token
	Utils__isAPICodeAvailable({ setIsAuth, isAuth, setCode, code })


	//----------------------------CHAT---------------------------
	useEffect(() => {
		if (socket != null) {
			socket.on("receiveMessage", async (data: any) => {
				if (data.sender == userId || data.receiver == chatStore.chatRoomId) {
					const allMessages: Chat[] = await fetchAllMessages();
					dispatch(updateChatUserMessages(allMessages));
					const newDirectMessages = fetchAllDirectMessages(allMessages, userId, chatStore.chatRoomId);
					dispatch(updateChatDirectMessages(newDirectMessages));
				}
			});
		}
	});

	//---------------------------GAME-----------------------------------------------
	useEffect(() => {
		if (socket != null) {
			socket.on('invitedToMatch', (data: any) => {
			console.log(userId, "   ", data.player2, "\n\n");
			if (data.player2 == userId) {
				setChallenge(true);
				console.log("I got invited to a game! \n\n");
				setGame(data);
			}
			console.log("Match invitation received! \n\n", data);
			});
		} else {
			console.log("Missing socket\n");
		}
	});
    
	return (
		<div className='flex-cols font-mono dark:bg-white/75 bg-slate-900 bg-opacity-80 h-screen'>
			<Router>
				<div className='h-20 flex backdrop-blur-sm bg-white/75 dark:bg-slate-900 border-b-4 border-white/75 dark:border-slate-600 item-center justify-between'>
					<Navbar setIsAuth={setIsAuth} isAuth={isAuth} setCode={setCode} setUserId={setUserId}/>
				</div>
				<Routes>
					<Route path='about' element={<About isAuth={isAuth} />} />
					<Route path='/' element={<Home
						userCode={{ code: code, setCode: setCode }}
						loginState={{ isLogin: isAuth, setIsLogin: setIsAuth }} setUserId={setUserId}
						userId={userId} state={state}
						token2fa={token2fa}
						setToken2fa={setToken2fa}
					/>} />
					<Route path='/login' element={<Login isAuth={isAuth} setIsAuth={setIsAuth} state={state} />} />
					<Route path='/login2fa' element= {
						<Login2fa isAuth={isAuth}
							setIsAuth={setIsAuth}
							setUserId={setUserId}
							token2fa={token2fa}
							setToken2fa={setToken2fa}
					/>} />
					<Route path='/game' element={<ProtectedRoute isAuth={isAuth} path='/game' element={<GameSelection userId={userId} />} />} />
					<Route path='/profile' element={<ProtectedRoute isAuth={isAuth} path='/profile' element={<Profile userId={userId} isAuth={isAuth} />} />} />
					<Route path='/*' element={<PageNotFound />} />
				</Routes>
				<div className='shadow-xl flex backdrop-blur-sm bg-white/75 dark:bg-slate-900 h-11 border-t-4 border-slate-300 dark:border-slate-700 items-center justify-evenly'>
					<Footer />
				</div>
				{ challenge ? <GameChallenge userId={userId} game={game} setChallenge={setChallenge} /> : null}
			</Router>
			
		</div>
	)
}
export default App;


/* CHAT-GPT:
Inside each component directory (pages, components, etc.), create an index.ts file if it doesn't already exist.

In the index.ts file, export the component from its corresponding file. For example, in components/index.ts:

jsx
Copy code
export { default as Navbar } from './Navbar';
export { default as Footer } from './Footer';
// Add other component exports as needed
Now, you can import the components using a single line in your code:
jsx
Copy code
import { Login, Navbar, ProtectedRoute, Home, Profile, LandingPage, About, PageNotFound, Footer } from './components';
By using the index.ts file, you can group and export multiple components from the same directory in a single import statement. This makes your import statements cleaner and more concise.

Make sure to adjust the file paths and directory names based on your project structure.

Note: If you have nested directories within the components directory, you can create additional index.ts files in those directories as well to export the nested components.
*/
