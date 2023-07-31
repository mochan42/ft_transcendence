import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Login from './components/pages/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import LandingPage from './components/pages/LandingPage';
import About from './components/pages/About';
import PageNotFound from './components/pages/PageNotFound';
import Footer from './components/Footer';
import Layout from './components/pages/Layout';
import GameSelection from './components/pages/GameSelection';
import { utils__isAPICodeAvailable } from './utils/utils__isAPICodeAvailable'

const App: React.FC = () => {

	const [isAuth, setIsAuth] = useState<boolean>(false)
	const [code, setCode] = useState<string | null>( null )

	const getUserId = (): number => {
		const id = sessionStorage.getItem('userId');
		if (id?.length) {
			return +id;
		}
		return 2;
	}

    // check if code available for backend to exchange for token
    utils__isAPICodeAvailable({setIsAuth, isAuth, setCode, code });

	return (
		<div className='grid gap-2 font-mono dark:bg-white/75 bg-slate-900 bg-opacity-80'>
			<Router>
				<div className='shadow-xl flex backdrop-blur-sm bg-white/75 dark:bg-slate-900 z-50 top-0 left-0 right-0 h-20 border border-white/75 dark:border-slate-700 item-center justify-between'>
					<Navbar setIsAuth={setIsAuth} isAuth={isAuth} setCode={setCode}/>
				</div>
				<div className='rounded-2xl shadow-xl h-screen min-h-[50px]'>
					<div>
						<Routes>
							<Route path='about' element={<About isAuth = {isAuth}/>} />
							<Route path='/' element={ <Home userCode ={ {code:code, setCode:setCode} } loginState={ {isLogin:isAuth, setIsLogin:setIsAuth } } userId={ getUserId()} />}/> 
							<Route path='/login' element={<Login isAuth={isAuth} setIsAuth={setIsAuth} />} />
							<Route path='/game' element={<ProtectedRoute isAuth={isAuth} path='/game' element={<GameSelection userId={getUserId()}/>} />} />
							<Route path='/profile' element={<ProtectedRoute isAuth={isAuth} path='/profile/' element={<Profile userId={getUserId()}/>} />} />
							<Route path='/landingpage' element={<ProtectedRoute isAuth={isAuth} path='/landingpage' element={<LandingPage />} />} />
							<Route path='/layout' element={<Layout />} />
							<Route path='/*' element={<PageNotFound />}/>
						</Routes>
					</div>
				</div>	
					<div className=' shadow-xl flex backdrop-blur-sm bg-white/75 dark:bg-slate-900 z-50 top-0 left-0 right-0 h-20 border-b border-slate-300 dark:border-slate-700 items-center justify-evenly'>
						<Footer/>
					</div>
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
