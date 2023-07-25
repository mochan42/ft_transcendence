import { Button } from "./ui/Button"

interface AchievementsProps {
	userId: number;
	setShowScreen: React.Dispatch<React.SetStateAction< 'default' | 'achievements' | 'friends' | 'stats' >>;
}

const Achievements:React.FC<AchievementsProps> =({ userId, setShowScreen }) => {
	return (
		<div className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 bg-opacity-70'>
			<div className='rounded h-1/2 w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 dark:bg-slate-200'>
				<div className="h-full overflow-y-auto p-4 flex-cols text-center justify-between space-y-4">
					<Button variant={'link'} onClick={() => setShowScreen('default')}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-200 dark:text-slate-900">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
						</svg>
					</Button>
					<div className='space-y-2 border-t-8 dark:border-slate-900 dark:bg-slate-900 bg-slate-200 text-slate-900 dark:text-amber-400 rounded-md flex-cols justify-evenly items-baseline'>
						<div className='flex items-center justify-around '>
							<img className='h-16 w-16 bg-slate-200 dark:bg-slate-200 rounded-full' src='https://www.svgrepo.com/show/529148/question-circle.svg'>
							</img>
							<p>
								Achievement
							</p>
						</div>
						<p className='text-xs dark:text-slate-200 '>
							"Won 5 battles against the Bot on easy"
						</p>
					</div>
					<div className='space-y-2 border-t-8 dark:border-slate-900 dark:bg-slate-900 bg-slate-200 text-slate-900 dark:text-amber-400 rounded-md flex-cols justify-evenly items-baseline'>
						<div className='flex items-center justify-around '>
							<img className='h-16 w-16 bg-slate-200 dark:bg-slate-200 rounded-full' src='https://www.svgrepo.com/show/529148/question-circle.svg'>
							</img>
							<p>
								Achievement
							</p>
						</div>
						<p className='text-xs dark:text-slate-200 '>
							"Won 5 battles against the Bot on easy"
						</p>
					</div>
					<div className='space-y-2 border-t-8 dark:border-slate-900 dark:bg-slate-900 bg-slate-200 text-slate-900 dark:text-amber-400 rounded-md flex-cols justify-evenly items-baseline'>
						<div className='flex items-center justify-around '>
							<img className='h-16 w-16 bg-slate-200 dark:bg-slate-200 rounded-full' src='https://www.svgrepo.com/show/529148/question-circle.svg'>
							</img>
							<p>
								Achievement
							</p>
						</div>
						<p className='text-xs dark:text-slate-200 '>
							"Won 5 battles against the Bot on easy"
						</p>
					</div>
					<div className='space-y-2 border-t-8 dark:border-slate-900 dark:bg-slate-900 bg-slate-200 text-slate-900 dark:text-amber-400 rounded-md flex-cols justify-evenly items-baseline'>
						<div className='flex items-center justify-around '>
							<img className='h-16 w-16 bg-slate-200 dark:bg-slate-200 rounded-full' src='https://www.svgrepo.com/show/529148/question-circle.svg'>
							</img>
							<p>
								Achievement
							</p>
						</div>
						<p className='text-xs dark:text-slate-200 '>
							"Won 5 battles against the Bot on easy"
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Achievements