import React from 'react';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  	children: React.ReactNode;
}

export default function SmallHeading({ className, children }: Props) {
  return (
		<h3 className={className}>{children}</h3>
  )
}
