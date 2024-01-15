import React from "react";
import { cn } from "../lib/utils";
import { ChatMessageProps } from "../types";

const ChatMessage: React.FC<ChatMessageProps> = ({ incoming, user, message }) => {

   	const containerClasses = incoming ? "justify-start" : "justify-end";
    const backgroundColor = incoming ? "bg-gray-300" : "bg-slate-900";
    const textColor = incoming ? "text-gray-700" : "text-white";

    return (
		<div className={cn('flex', containerClasses)}>
			<div className={'p-3 rounded-lg max-w-max bg-slate-200'}>
				{incoming ? 
				<p className={'text-sm text-slate-600'}>
					{user}:
				</p> : <p>Me</p>}
			</div>
			<div className={cn('p-3 rounded-lg max-w-max', backgroundColor)}>
				<p className={cn('text-sm', textColor)}>
					{message}
				</p>
			</div>
		</div>
    );
};

export default ChatMessage;