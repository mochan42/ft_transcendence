import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'

type AboutProps = 
{
    isAuth: boolean
}
const About = (props: AboutProps) => {
	const navigate = useNavigate()
	return (
		<div className='bg-slate-200 dark:bg-slate-900 h-screen  flex flex-col flex-wrap justify-start text-slate-900 dark:text-slate-200 border-8 dark:border-slate-900'>
			<div className='flex flex-wrap justify-around text-center gap-8'>
				<div className='w-2/3'>
					<h1 className='text-lg'>
						Transcendence Project of the 42
						<Button variant='link' size='sm' onClick={() => window.open('https://42wolfsburg.de/42-programming-curriculum/', '_blank')} className='text-lg dark:text-amber-400'>
							Core Curriculum.
						</Button>
					</h1>
				</div>
				<div className='overflow-hidden mx-auto rounded-3xl object-scale-down w-2/3'>
					<img src='https://42wolfsburg.de/wp-content/uploads/2021/08/1_CyuMA9NNfSsJ7yu7rGZL_A-e1629378913780-1024x546.jpeg' alt='Whale and flower pot falling from sky. Reference to "The Hitchhikers Guide To The Galaxy"'></img>
				</div>
				<div className=''>
					<p className=''>
						The 42 Core Curriculum is a unique learning opportunity for everyone. Get involved and dive into the world of C programming. On this long
						journey you'll make your way to the final boss of the first year: Transcendence ... 
						Come on in and transcend with us onto new adventures!
						Come on in and start adventuring!
					</p>
				</div>

				{/* <div className='text-center'>
					<Button
						onClick={() => navigate('/login')}>
						Login!
					</Button>
				</div> */}
			</div>
		</div>
	)
}

export default About
