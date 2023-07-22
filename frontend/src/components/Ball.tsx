interface BallProps {
	style?: React.CSSProperties;
	yPosition: number;
	xPosition: number;
}

const Ball: React.FC<BallProps> = ({ xPosition, yPosition, style }) => {
	return (
		<div className=''>
		<div
			className="absolute w-8 h-8 rounded-full bg-white"
			style={{
				top: `${yPosition}px`,
				left: `${xPosition}px`,
				...style,
			}}
		/>
		</div>
	)
}

export default Ball