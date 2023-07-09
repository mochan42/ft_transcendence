import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Game from './components/pages/Game';
import Layout from './components/pages/Layout';

const App: React.FC = () => {
	const [isAuth, setIsAuth] = useState(true)

		return (
			<div className='grid grid-rows-8 gap-2'>
				<Router>
					<div className='shadow-xl flex backdrop-blur-sm bg-white/75 dark:bg-slate-900 z-50 top-0 left-0 right-0 h-20 border-b border-slate-300 dark:border-slate-700 item-center justify-between'>
						<Navbar setIsAuth={setIsAuth} isAuth={isAuth}/>
					</div>
					<div className='bg-green-500 rounded-lg shadow-xl min-h-[50px]'>
						<div>
							<Routes>
								<Route path='/' element={<ProtectedRoute isAuth={isAuth} path='/' element={<Home />} />} />
								<Route path='/login' element={<Login setIsAuth={setIsAuth} />} />
								<Route path='game' element={<ProtectedRoute isAuth={isAuth} path='/game' element={<Game />} />} />
								<Route path='/profile' element={<ProtectedRoute isAuth={isAuth} path='/profile' element={<Profile />} />} />
								<Route path='/landingpage' element={<ProtectedRoute isAuth={isAuth} path='/landingpage' element={<LandingPage />} />} />
								<Route path='/about' element={<About />} />
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