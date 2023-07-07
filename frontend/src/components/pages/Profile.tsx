import Button from "../ui/Button"

const Profile = () => {
	return (
		<div className='h-screen bg-gray-200 w-full flex justify-center items-center'>
			<Button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
				Welcome to your profile!
			</Button>
		</div>
	)
}

export default Profile