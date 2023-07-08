import Button from "../ui/Button"
import SmallHeading from "../ui/SmallHeading"
import { Fetcher } from "react-router-dom";

const Layout = () => {
	return (
		<div className="grid grid-cols-2 gap-4 h-screen">
			<div className="col-span-1 flex items-center space-x-4">
				<img className="w-24 h-24 rounded-full" src="user-image.jpg" alt="User Image" />
				<h2 className="text-xl font-bold">John Doe</h2>
				<div className="space-x-2">
					<button className="px-4 py-2 bg-blue-500 text-white rounded">Update</button>
					<button className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
				</div>
			</div>
			<div className="col-span-1 row-start-2">
				<h3 className="text-lg font-bold mb-4">Achievements</h3>
				<ul className="space-y-2">
				<li>Completed Project X</li>
				<li>Received Award Y</li>
				<li>Published Paper Z</li>
				</ul>
			</div>
			<div className="col-span-1 row-start-2">
				<h3 className="text-lg font-bold mb-4">Friends</h3>
				<ul className="space-y-2">
				<li>Friend 1</li>
				<li>Friend 2</li>
				<li>Friend 3</li>
				</ul>
			</div>
			<div className="col-span-1 row-start-2 col-start-2">
				<h3 className="text-lg font-bold mb-4">Personal Information</h3>
				<div>
				<span className="font-bold">Email:</span>
				<span>john.doe@example.com</span>
				</div>
				<div>
				<span className="font-bold">Location:</span>
				<span>New York, USA</span>
				</div>
				<div>
				<span className="font-bold">Occupation:</span>
				<span>Software Engineer</span>
				</div>
			</div>
		</div>
	)
}

export default Layout