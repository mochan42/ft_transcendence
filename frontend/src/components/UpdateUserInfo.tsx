import { useEffect, useState } from "react";
import { User } from "../types";
import axios from "axios";

interface UpdateUserInfoProps {
    userId: number;
}

const UpdateUserInfo: React.FC<UpdateUserInfoProps> = ({ userId }) => {
    
    const [userInfo, setUserInfo] = useState< User | null >(null);
	const url_info = 'https://literate-space-garbanzo-vjvjp6xjpvvfp57j-5000.app.github.dev/pong/users/' + userId;
    
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

    useEffect(() => {
		if (userInfo === null) {
			getUserInfo();
		}
	});
    
    return (
        <>
			<div>
			</div>
        </>
    )
}

export default UpdateUserInfo;