import Button from "../ui/Button"

const Profile = () => {
	return (
		<div className='h-screen grid grid-cols-2 gap-5'>
			<div className='bg-slate-200 flex flex-col items-center justify-evenly gap-2'>
				<div className='rounded-full overflow-hidden'>
					<img src='https://fastly.picsum.photos/id/490/200/300.jpg?hmac=8hYDsOwzzMCthBMYMN9bM6POtrJfVAmsvamM2oOEiF4' alt='User Picture' className='w-full h-full object-cover' />
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
			<div className='gap-5'>
				<Button className=''>
					Stats/achievements
				</Button>
			</div>
			<div className='gap-5'>
				<Button className=''>
					Info / name
				</Button>
			</div>
			<div>
				<Button className='gap-5'>
					Friends
				</Button>
			</div>
		</div>
	)
}

export default Profile


