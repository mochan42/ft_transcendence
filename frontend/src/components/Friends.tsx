import { User } from "../types";
import { Button } from "./ui/Button"

interface FriendsProps {
	friends: User[] | null;
	setShowScreen: React.Dispatch<React.SetStateAction< 'default' | 'achievements' | 'friends' | 'stats' | 'userProfile' >>;
}

const Friends:React.FC<FriendsProps> =({ setShowScreen, friends}) => {
	return (
		<div className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 bg-opacity-70'>
			<div className='rounded h-1/2 w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 dark:bg-slate-200'>
				<div className="h-full p-4 flex-cols text-center justify-between space-y-4">
					<Button variant={'link'} onClick={() => {setShowScreen('default')}}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-200 dark:text-slate-900">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
						</svg>
					</Button>
					<div className="h-4/5 overflow-y-auto p-4 flex-cols text-center justify-between space-y-4">
						{friends?.map((user, index) => (
							<div key={index}>
								<div className="space-y-2 flex flex-col justify-between gap-4">
									<div className="flex flex-row justify-between min-w-[220px]">
										<img
										className="h-6 w-6 dark:bg-slate-200 rounded-full"
										src={user.avatar}
										alt="Achievement badge"
										/>
											{user.userNameLoc}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Friends