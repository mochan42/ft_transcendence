interface BoostProps {
	x: number;
	y: number;
	width: number;
	height: number;
}

const Boost: React.FC<BoostProps> = ({ x, y, width, height }) => {
	return (
		<div
			className={`bg-slate-200 absolute rounded-xl`}
      		style={{ 
				top: `${y + (width / 2)}px`,
				left: `${x + (width / 2)}px`,
				transform: 'translate(-50%, -50%)',
				height: height,
				width: width,
			}}>
				<img src="https://www.svgrepo.com/show/396641/high-voltage.svg"></img>
		</div>
	)
}

export default Boost