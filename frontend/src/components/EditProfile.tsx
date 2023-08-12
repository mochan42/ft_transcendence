import { useState } from 'react';
import { Button } from './ui/Button'

interface EditProfileProps {
    setShowScreen: React.Dispatch<React.SetStateAction< 'default' | 'achievements' | 'friends' | 'stats' | 'userProfile' >>;
}

interface FormData {
    name: string;
    image: string;
    password: string;
  }

const EditProfile:React.FC<EditProfileProps> = ({ setShowScreen }) => {

        const [formData, setFormData] = useState<FormData>({
          name: 'test',
          image: '',
          password: '',
        });
      
    const [errors, setErrors] = useState<Partial<FormData>>({});
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate form data
        const validationErrors: Partial<FormData> = {};
    
        if (!formData.name) {
            validationErrors.name = 'Name is required';
        }
    
        if (!formData.image) {
            validationErrors.image = 'Image link is required';
        }
    
        if (!formData.password) {
            validationErrors.password = 'Password is required';
        }
    
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
        // Submit the form data
        // ...
    };

    return (
        <div className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 bg-opacity-70'>
			<div className='rounded h-2/3 w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 dark:bg-slate-200'>
				<div className="h-full p-4 flex-cols text-center justify-between space-y-4">
					<Button variant={'link'} onClick={() => {setShowScreen('default')}}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-200 dark:text-slate-900">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
						</svg>
					</Button>
					<div className="h-4/5 overflow-y-auto p-4 flex-cols text-center justify-between space-y-4">
                        <div className="container mx-auto p-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className='text-slate-200 dark:text-black'>
                                    Name
                                </div>
                                <div className='text-slate-400'>
                                   Philipp Maximilian Meisinger
                                </div>
                                <div>
                                    <label className="block text-slate-200 dark:text-black">Username</label>
                                    <input
                                        type="text"
                                        className="form-input mt-1 block w-full"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-slate-200 dark:text-black">Profile picture</label>
                                    <input
                                        type="file"
                                        className="form-input mt-1 block w-full text-slate-200 dark:text-black"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    />
                                    {errors.image && <p className="text-red-500">{errors.image}</p>}
                                </div>
                                <div className='space-x-4'>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                    >
                                        Update
                                    </button>
                                    <input
                                        type='reset'>
                                    </input>
                                    {/* <button
                                        type="submit"
                                        onClick={() => setShowScreen('default')}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button> */}
                                </div>
                            </form>
                        </div>
					</div>
				</div>
			</div>
		</div>
    )
}

export default EditProfile