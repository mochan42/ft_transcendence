import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage'

function App() {

	const [signedInStatus, setSignedInStatus] = useState(false)
	if (!signedInStatus)
		return (
			<div>
				<LandingPage/>
			</div>
		)
	if (signedInStatus)
		return (
			<div>
				<h1 className="text-3xl font-bold underline text-white">
				Hello world!
				</h1>
				<Navbar/>
			</div>
		);
}

export default App;
