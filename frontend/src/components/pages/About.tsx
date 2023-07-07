import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

const About = () => {
	const navigate = useNavigate()
	return (
		<div className='h-screen bg-gray-200 w-full grid place-items-center'>
			<h1>Transcendence Project of the 42 Core Curriculum</h1>
			<p>The 42 Core Curriculum is a unique learning opportunity for everyone. Get involved and dive into the world of C programming. On this long
				journey you'll make your way to the final boss of the first year: Transcendence ... 
				Come on in and transcend with us onto new adventures!
				Come on in and start adventuring!
			</p>
			<Button
				className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
				onClick={() => navigate('/login')}>
				Login!
			</Button>
		</div>
	)
}

export default About