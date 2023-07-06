import Button from "../ui/Button"

const Profile = () => {
	return (
		<div className='h-screen grid grid-cols-6 gap-5'>
			<div className='col-span-2 bg-slate-200 flex flex-col items-center justify-evenly max-h-80 min-h-50'>
				<div className='rounded-full overflow-hidden'>
					<img src='https://fastly.picsum.photos/id/294/200/200.jpg?hmac=tSuqBbGGNYqgxQ-6KO7-wxq8B4m3GbZqQAbr7tNApz8' alt='User Picture' className='w-full h-full object-cover' />
				</div>
				<div className='place-items-center gap-2'>
					<Button>
						Update
					</Button>
					<Button>
						Delete
					</Button>
					
				</div>
			</div>
			<div className='col-span-4'>
				<Button className=''>
					Stats/achievements
				</Button>
			</div>
			<div className='col-span3'>
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


