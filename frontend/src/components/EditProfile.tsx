import { useEffect, useState } from 'react';
import { Button } from './ui/Button'
import { User } from '../types';
import axios from 'axios';

interface EditProfileProps {
    setShowScreen: React.Dispatch<React.SetStateAction< 'default' | 'achievements' | 'friends' | 'stats' | 'userProfile' >>;
    userId: string | null;
}

interface FormDataLoc {
    name: string;
    image: any;
}

const EditProfile:React.FC<EditProfileProps> = ({ setShowScreen, userId }) => {

    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [errors, setErrors] = useState<Partial<FormDataLoc>>({});
    const url_info = 'http://localhost:5000/pong/users/' + userId;
    const [formData, setFormData] = useState<FormDataLoc>({
        name: '',
        image: null,
    });

    const getUserInfo = async () => {
        try {
            const response = await axios.get<User>(url_info);
            if (response.status === 200) {
                setUserInfo(response.data);
                console.log('Received User Info: ', response.data)
            }
        }
        catch (error) {
            console.log('Error fetching user infos', error);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors: Partial<FormDataLoc> = {};

        //---- This block is useless, doesn't it ? --------
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        //---------------------------------------------------

        if (userInfo && (formData.name || formData.image)) {
            const updatedUser = new FormData();
            updatedUser.append('id', userInfo.id);
            updatedUser.append('name', formData.name || userInfo.userNameLoc);
            updatedUser.append('avatar', formData.image);

            await updateUser(updatedUser);
        }
    };

    const updateUser = async (updatedUser: FormData) => {
		if (userInfo) {
            try {
				console.log('In try block')
                //console.log(userInfo);
                const response = await axios.patch(url_info, updatedUser, {
                     headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
				if (response.status === 200) {
                    console.log("Updated user information");
				}

			} catch (error) {
				console.log('Error updating userInfo:', error);
			}
		}
        setShowScreen('default');
	};

    useEffect(() => {
		if (userInfo === null) {
			getUserInfo();
		}
    })
    
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
                            <form onSubmit={handleSubmit} className="space-y-8 w-full" encType="multipart/form-data">
                                <div className='text-slate-200 dark:text-black'>
                                    Name
                                </div>
                                <div className='text-slate-400'>
                                   {userInfo?.firstName}
                                </div>
                                <div>
                                    <label className="block text-slate-200 dark:text-black">Username</label>
                                    <input
                                        type="text"
                                        className="form-input mt-1 text-center"
                                        defaultValue={userInfo?.userNameLoc}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-slate-200 dark:text-black">Profile picture</label>
                                    <input
                                        type="file"
                                        accept=".jpg, .jpeg, .png"
                                        name="avatar"
                                        className="form-input mt-1 w-1/2 text-slate-200 dark:text-black text-center"
                                        onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
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
                                    <button
                                        type="reset"
                                        onClick={() => setShowScreen('default')}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
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