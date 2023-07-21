interface VictoryLossProps {
	isVictory: boolean;
  }
  
  const VictoryLoss: React.FC<VictoryLossProps> = ({ isVictory }) => {
	return (
		<div className="flex items-center justify-center h-full">
			<div className="text-4xl font-bold">
			{isVictory ? "Congratulations! You won!" : "Oops! You lost!"}
			</div>
		</div>
	);
  };

export default VictoryLoss