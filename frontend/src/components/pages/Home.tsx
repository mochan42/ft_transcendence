import Button from "../ui/Button"

const Home = () => {
	return (
		<div className="h-screen">
			<Button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
				Welcome Home!
			</Button>
		</div>
	)
}

export default Home