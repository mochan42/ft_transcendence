import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage'

function App() {

	// const [signedInStatus, setSignedInStatus] = useState(false)
	// if (!signedInStatus)
	// 	return (
	// 		<div>
	// 			<LandingPage/>
	// 		</div>
	// 	)
	// if (signedInStatus)
		return (
			<div>
				<LandingPage/>
				{/* <Navbar/> */}
			</div>
		);
}

export default App;
