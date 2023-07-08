import React from 'react';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  	children: React.ReactNode;
}

export default function SmallHeading({ className, children }: Props) {
  return (
		<h5 className={className}>{children}</h5>
  )
}
