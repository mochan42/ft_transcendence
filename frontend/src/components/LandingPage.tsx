import Button from './ui/Button'

const LandingPage = () => {
	return (
		<div className='fixed backdrop-blur-sm bg-white/75 dark:bg-slate-900 z-50 top-0 left-0 right-0 h-20 border-m border-slate-300 dark:border-slate-700 shadow-sm flex item-center justify-between'>
			<div className='container max-w-7xl mx-auto w-full flex justify-between items-center'></div>
				<Button className='text-white '>
					<span>
						Sign In!
					</span>
				</Button>
			</div>
	)
}

export default LandingPage