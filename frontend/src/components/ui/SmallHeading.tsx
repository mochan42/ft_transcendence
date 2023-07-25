import React from 'react';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  	children: React.ReactNode;
}

export default function SmallHeading({ className, children }: Props) {
  return (
		<p className={className} children={children}></p>
  )
}
