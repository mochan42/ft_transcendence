

interface ButtonProps {
	text: string;
	className: string;
  }
  
  const Button: React.FC<ButtonProps> = ({ text, className }) => {
	return (
	  <div>
		<button className={className}>
		  {text}
		</button>
	  </div>
	);
  };
  
  export default Button;