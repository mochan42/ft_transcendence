import { Button } from "./ui/Button"

interface StatsProps {
	userId: number;
	setShowScreen: React.Dispatch<React.SetStateAction< 'default' | 'achievements' | 'friends' | 'stats' >>;
}

const Stats:React.FC<StatsProps> =({ userId, setShowScreen }) => {
	return (
		<div className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 bg-opacity-70'>
			<div className='h-1/2 w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-green-400'>
				<Button>
					Welcome Stats!
				</Button>
			</div>
		</div>
	)
}

export default Stats