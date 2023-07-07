import Button from '../ui/Button'

const Game = () => {
	return (
		<div className='h-screen bg-gray-200 w-full grid place-items-center'>
			
			<Button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
				Play Pong!
			</Button>
		</div>
	)

}

export default Game