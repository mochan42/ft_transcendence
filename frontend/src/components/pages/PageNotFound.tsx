import { useNavigate } from "react-router-dom"
import { Button } from "../ui/Button"
import SmallHeading from "../ui/SmallHeading"
import imgNotFound from "../../img/looking_for_page.png"

const PageNotFound = () => {
	const navigate = useNavigate()
	const imagePath = "./42Schools.jpg"
	return (
		<div className='h-5/6 flex flex-col flex-wrap justify-start backdrop-blur-sm bg-slate-200 bg-white/75 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700'>
			<div className='h-1/6 flex justify-around items-center'>
				<h1 className='text-2xl text-slate-800 dark:text-amber-400'>
					Error 404: Page was not found.
				</h1>
			</div>
			<div className='overflow-hidden mx-auto rounded-3xl object-scale-down w-2/3 h-2/3 bg-cover bg-center'
				>
				<img src={imgNotFound}/>
				{/* <img src='https://wallpaperaccess.com/full/2019411.jpg' alt='A cartoon character is looking for something in the dark with a torch.'></img> */}
			</div>
			<div className='h-1/6 flex flex-wrap justify-around items-center'>
				<SmallHeading className='dark:text-slate-200'>
					Wilson keeps on looking for your page.
					Why don't we let him do his thing and we go back
					<Button onClick={() => navigate('/')} size='sm' variant='link' children='Home' className='dark:text-amber-400'/>
					.
				</SmallHeading>
			</div>
		</div>
	)
}

export default PageNotFound