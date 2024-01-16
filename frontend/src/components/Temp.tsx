import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface TempProps {
    letsPlay: boolean;
    setLetsPlay: (boolean: boolean) => void;
}

const Temp:React.FC<TempProps> = ({ letsPlay, setLetsPlay }) => {

    const navigate = useNavigate();

    useEffect(() => {
		if (letsPlay) {
			navigate('/game/challenger');
            setLetsPlay(false);
		}
	}, [letsPlay])
    
    return (
        <>
        </>
    )
}

export default Temp