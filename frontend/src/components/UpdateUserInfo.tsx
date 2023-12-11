import { useEffect, useState } from "react";
import { User } from "../types";
import axios from "axios";
import { BACKEND_URL } from "../data/Global";

interface UpdateUserInfoProps {
    userId: number;
}

const UpdateUserInfo: React.FC<UpdateUserInfoProps> = ({ userId }) => {
    
    const [userInfo, setUserInfo] = useState< User | null >(null);
	const url_info = `${BACKEND_URL}/pong/users/` + userId;
    
	const getUserInfo = async () => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.REACT_APP_SECRET}`
		};
		try {
			const response = await axios.get<User>(url_info, { headers });
			if (response.status === 200) {
				setUserInfo(response.data);
				// console.log('Received User Info: ', response.data)
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