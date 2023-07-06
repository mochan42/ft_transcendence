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

const App: React.FC = () => {
	const [isAuth, setIsAuth] = useState(true)

		return (
			<Router>
				<div className='flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8'>
					<Navbar setIsAuth={setIsAuth} isAuth={isAuth}/>
					<div className='h-screen bg-gray-200 w-full '>
						<Routes>
							<Route path='/' element={<ProtectedRoute isAuth={isAuth} path='/' element={<Home />} />} />
							<Route path='/login' element={<Login setIsAuth={setIsAuth} />} />
							{/* <Route path='game' element={<ProtectedRoute isAuth={isAuth} path='/game' element={<Game />} />} /> */}
							<Route path='/profile' element={<ProtectedRoute isAuth={isAuth} path='/profile' element={<Profile />} />} />
							<Route path='/landingpage' element={<ProtectedRoute isAuth={isAuth} path='/landingpage' element={<LandingPage />} />} />
							<Route path='about' element={<About />} />
							<Route path='/*' element={<PageNotFound />}/>
						</Routes>
					</div>
				</div>
			</Router>
		)
}

export default App;
