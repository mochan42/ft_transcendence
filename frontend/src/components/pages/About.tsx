import { Button } from '../ui/Button'

type AboutProps = 
{
    isAuth: boolean
}
const About = (props: AboutProps) => {
	return (
			<div className='bg-slate-200 dark:bg-slate-900 h-5/6 flex flex-col flex-wrap justify-start text-slate-900 dark:text-slate-200 border-8 dark:border-slate-900'>
				<div className='flex flex-wrap justify-around text-center gap-8 h-200'>
					<div className='w-2/3'>
						<h1 className='text-lg'>
							Transcendence Project of the 42
							<Button variant='link' size='sm' onClick={() => window.open('https://42wolfsburg.de/42-programming-curriculum/', '_blank')} className='text-lg dark:text-amber-400'>
								Core Curriculum.
							</Button>
						</h1>
					</div>
					<div className='overflow-hidden mx-auto rounded-3xl object-scale-down w-2/3'>
						<img src='https://miro.medium.com/v2/resize:fit:828/format:webp/1*URh4D_6vn85u_-KbBwW-Cw.jpeg' alt='Whale and flower pot falling from sky. Reference to "The Hitchhikers Guide To The Galaxy"'></img>
					</div>
					<div className=''>
						<p className=''>
							The 42 Core Curriculum is a unique learning opportunity for everyone. Get involved and dive into the world of C programming. On this long
							journey you'll make your way to the final boss of the first year: Transcendence ... 
							Come on in and transcend with us onto new adventures!
							Come on in and start adventuring!
						</p>
					</div>
				</div>
			</div>
		)
}

export default About
