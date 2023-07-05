import React from 'react'
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/pages/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import LandingPage from './components/pages/LandingPage';
import About from './components/pages/About'

const App: React.FC = () => {
	const [isAuth, setIsAuth] = useState(false)

		return (
			<Router>
				<div>
					<Navbar setIsAuth={setIsAuth} isAuth={isAuth}/>
					<div className='h-screen bg-gray-200 w-full grid place-items-center'>
						<Routes>
							<Route path='/' element={<ProtectedRoute isAuth={isAuth} path='/' element={<Home />} />} />
							<Route path='/login' element={<Login setIsAuth={setIsAuth} />} />
							{/* <Route path='game' element={<ProtectedRoute isAuth={isAuth} path='/game' element={<Game />} />} /> */}
							<Route path='/profile' element={<ProtectedRoute isAuth={isAuth} path='/profile' element={<Profile />} />} />
							<Route path='/landingpage' element={<ProtectedRoute isAuth={isAuth} path='/landingpage' element={<LandingPage />} />} />
							<Route path='about' element={<About />} />
						</Routes>
					</div>
				</div>
			</Router>
		)
}

export default App;
