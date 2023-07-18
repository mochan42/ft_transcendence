import { Button } from "../ui/Button"
import SmallHeading from "../ui/SmallHeading"
import { Fetcher } from "react-router-dom";

const Profile = () => {
	var name = 'Bill';
	// var userImage = sendRequestImage;
	return (
	<div className='bg-slate-400 h-screen flex flex-col flex-wrap justify-start'>
		<div className='h-1/2 bg-red-300 flex flex-wrap justify-around items-center'>
			<div className='bg-blue-500 flex flex-col flex-wrap items-center gap-6'>
				<img
					className="min-w-[250px] min-h-[250px] w-1/2 h-1/2 rounded-full mx-auto"
					src="https://fastly.picsum.photos/id/294/200/200.jpg?hmac=tSuqBbGGNYqgxQ-6KO7-wxq8B4m3GbZqQAbr7tNApz8"
					alt="User Image"
				/>
				<h1 className="text-2xl text-white/75 font-extrabold dark:text-amber-300 drop-shadow-lg">
					{name}
				</h1>
				<div className='flex gap-4'>
					<Button>
						Update
					</Button>
					<Button>
						Delete
					</Button>
				</div>
			</div>
			<div className='bg-yellow-500 flex flex-col justify-around gap-6'>
				<h3>Personal Information</h3>
				<div>
					<span className="font-bold">Email: </span>
					<span>john.doe@example.com</span>
				</div>
				<div>
					<span className="font-bold">Location: </span>
					<span>New York, USA</span>
				</div>
				<div>
					<span className="font-bold">Occupation: </span>
					<span>Software Engineer</span>
				</div>
			</div>
		</div>
		<div className='h-1/2 bg-green-500 flex flex-wrap justify-around items-center'>
			<div className='bg-pink-400'>
				<h3 className="text-lg font-bold mb-4">Achievements</h3>
				<ul className="space-y-2">
					<li>Completed Project X</li>
					<li>Received Award Y</li>
					<li>Published Paper Z</li>
				</ul> 
			</div>
			<div className='bg-violet-400'>
				<h3 className="text-lg font-bold mb-4">Friends</h3>
				<ul className="space-y-2">
					<li>Friend 1</li>
					<li>Friend 2</li>
					<li>Friend 3</li>
				</ul>
			</div>
		</div>
	</div>
  );
	}
	
	export default Profile
	
	
	
	// <div className="h-screen grid grid-flow-col grid-cols-4 min-w-[50px] bg-white/75 dark:bg-slate-800 border-8 border-white/75 text-center">
	// 	<div className="col-span-1 col-start-1 row-start-1 border-8 border-white/75 dark:border-slate-800  space-x-4 space-y-4">
	// 		<div className='space-y-5'>
	// 			<img className="w-1/2 h-1/2 rounded-full mx-auto" src="https://fastly.picsum.photos/id/294/200/200.jpg?hmac=tSuqBbGGNYqgxQ-6KO7-wxq8B4m3GbZqQAbr7tNApz8" alt="User Image" />
	// 			<h1 className="text-2xl text-white/75 font-extrabold dark:text-amber-300 drop-shadow-lg">{name}</h1>
	// 		</div>
	// 		<div className="space-x-8">
	// 			<button className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100 rounded">Update</button>
	// 			<button className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100 rounded">Delete</button>
	// 		</div>
	// 	</div>
	// 	<div className="col-span-1 row-start-1 col-start-2">
	// 		<h3 className="text-lg font-bold mb-4">Personal Information</h3>
	// 		<div>
	// 		<span className="font-bold">Email:</span>
	// 		<span>john.doe@example.com</span>
	// 		</div>
	// 		<div>
	// 		<span className="font-bold">Location:</span>
	// 		<span>New York, USA</span>
	// 		</div>
	// 		<div>
	// 		<span className="font-bold">Occupation:</span>
	// 		<span>Software Engineer</span>
	// 		</div>
	// 	</div>
	// 	<div className="col-span-2 col-start-3 row-start-1">
	// 		<h3 className="text-lg font-bold mb-4">Achievements</h3>
	// 		<ul className="space-y-2">
	// 		<li>Completed Project X</li>
	// 		<li>Received Award Y</li>
	// 		<li>Published Paper Z</li>
	// 		</ul>
	// 	</div>
	// 	<div className="col-span-2 col-start-1 row-start-2">
	// 		<h3 className="text-lg font-bold mb-4">Friends</h3>
	// 		<ul className="space-y-2">
	// 		<li>Friend 1</li>
	// 		<li>Friend 2</li>
	// 		<li>Friend 3</li>
	// 		</ul>
	// 	</div>
	// </div>