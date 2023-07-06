import { Link, useNavigate } from "react-router-dom"
import Button from "../ui/Button"
import SmallHeading from "../ui/SmallHeading"

const PageNotFound = () => {
	const navigate = useNavigate()
	return (
		<div className='h-screen bg-gray-200 w-full grid place-items-center'>
			<SmallHeading className='font-weight:700 text-black' children='404 Page not found. Go back to ' />
			<Link 
				to={'/home'}
				className="underline underline-offset-2 text-left"
			>
				home.
			</Link>
		</div>
	)
}

export default PageNotFound