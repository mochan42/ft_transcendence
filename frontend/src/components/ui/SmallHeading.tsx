import React from 'react';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  	children: React.ReactNode;
}

export default function SmallHeading({ children }: Props) {
  return (
		<h3>{children}</h3>
  )
}
