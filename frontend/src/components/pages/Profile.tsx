import Button from "../ui/Button"
import SmallHeading from "../ui/SmallHeading"
import { Fetcher } from "react-router-dom";

const Profile = () => {
	var name = 'Bill';
	// var userImage = sendRequestImage;
	return (
		<div className='h-screen grid grid-cols-6 gap-5 shadow-xl backdrop-blur-sm bg-white/75 dark:bg-slate-700'>
			<div className='col-span-2 grid items-center justify-evenly max-h-80 min-h-50 border-3'>
				<div className='rounded-full overflow-hidden'>
					<img src='https://fastly.picsum.photos/id/294/200/200.jpg?hmac=tSuqBbGGNYqgxQ-6KO7-wxq8B4m3GbZqQAbr7tNApz8' alt='profile picture' className='w-full h-full object-cover' />
				</div>
				<div className=''>
					<Button>
						Update
					</Button>
					<Button>
						Delete
					</Button>
					
				</div>
				<div>
					<SmallHeading
						className='text-lg font-bold'
						children={name}
					/>
				</div>
			</div>
			<div className='col-span-4'>
				<Button className=''>
					Stats/achievements
				</Button>
			</div>
			<div className='col-span-3'>
				<Button className=''>
					Info / name
				</Button>
			</div>
			<div className='col-span-3'>
				<Button className=''>
					Friends
				</Button>
			</div>
			
			
		</div>
	)
}

export default Profile


