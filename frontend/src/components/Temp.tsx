import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface TempProps {
    letsPlay: boolean;
}

const Temp:React.FC<TempProps> = ({ letsPlay }) => {

    const navigate = useNavigate();

    useEffect(() => {
		if (letsPlay) {
			navigate('/game/challenger');
		}
	}, [letsPlay])
    
    return (
        <>
            <div>
                Redirecting to Game!
            </div>
        </>
    )
}

export default Temp