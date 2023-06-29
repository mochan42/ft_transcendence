import Button from './ui/Button'


const Navbar = () => {
	return(
		<div className='fixed backdrop-blur-sm bg-white/75 dark:bg-slate-900 z-50 top-0 left-0 right-0 h-20 border-b border-slate-300 dark:border-slate-700 shadow-sm flex item-center justify-between'>
			<div className='container max-w-7xl mx-auto w-full flex justify-between items-center'>
				<h1 className="mr-2 h-4 w-4 text-white">Navbar</h1>
				<div>
					<Button text='test' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'/>
				</div>
			</div>
		</div>
	)
}

export default Navbar