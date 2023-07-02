import Button from './ui/Button'

const LandingPage = () => {
	return (
		<div className='fixed backdrop-blur-sm bg-white/75 dark:bg-slate-900 z-50 top-0 left-0 right-0 h-20 border-m border-slate-300 dark:border-slate-700 shadow-sm flex item-center justify-between'>
			<div className='container max-w-7xl mx-auto w-full flex justify-start items-center'>
				<Button className='inset-inline-end: 0px; rounded-md h-10 py-2 px-4 text-black bg-transparent dark:bg-transparent underline-offset-4 hover:underline dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent'>
					<span>
						Documentation
					</span>
				</Button>
			</div>
			<div className='container max-w-7xl mx-auto w-full flex justify-end items-center'>
				<Button className='inset-inline-end: 0px; rounded-md h-10 py-2 px-4 text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent'>
					<span>
						Sign In!
					</span>
				</Button>
			</div>
		</div>
		// <div>
		// 	<div className=''>
				
		// 	</div>
		// </div>

// {/* <>
// 		<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
// 		<div className="sm:mx-auto sm:w-full sm:max-w-sm">
// 			<img
// 			className="mx-auto h-10 w-auto"
// 			src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
// 			alt="Your Company"
// 			/>
// 			<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
// 			Sign in to your account
// 			</h2>
// 		</div>

// 		<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
// 			<form className="space-y-6" action="#" method="POST">
// 			<div>
// 				<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
// 				Email address
// 				</label>
// 				<div className="mt-2">
// 				<input
// 					id="email"
// 					name="email"
// 					type="email"
// 					autoComplete="email"
// 					required
// 					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
// 				/>
// 				</div>
// 			</div>

// 			<div>
// 				<div className="flex items-center justify-between">
// 				<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
// 					Password
// 				</label>
// 				<div className="text-sm">
// 					<a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
// 					Forgot password?
// 					</a>
// 				</div>
// 				</div>
// 				<div className="mt-2">
// 				<input
// 					id="password"
// 					name="password"
// 					type="password"
// 					autoComplete="current-password"
// 					required
// 					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
// 				/>
// 				</div>
// 			</div>

// 			<div>
// 				<button
// 				type="submit"
// 				className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
// 				>
// 				Sign in
// 				</button>
// 			</div>
// 			</form>

// 			<p className="mt-10 text-center text-sm text-gray-500">
// 			Not a member?{' '}
// 			<a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
// 				Start a 14 day free trial
// 			</a>
// 			</p>
// 		</div>
// 		</div>
// 		</> */}
	)
}

export default LandingPage


// default: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100',
// outline: 'bg-slate-900 text-white hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100 border border-slate-200 hover:bg-slate-100 dark:border-slate-700',
// ghost: 'text-black bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
// link: 'text-black bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent',
