import { Message } from './types';

const ChatTextMsg = (el: Message) => {

    const containerClasses = el.incoming ? "justify-start" : "justify-end";
    const backgroundColor = el.incoming ? "bg-gray-300" : "bg-blue-500";
    const textColor = el.incoming ? "text-gray-700" : "text-white";

    return (
        <div className={`flex flex-row ${containerClasses}`}>
            <div className={`p-3 ${backgroundColor} rounded-lg max-w-max`}>
                <p className={`text-sm ${textColor}`}>
                    {el.message}
                </p>
            </div>
        </div>
    );
};   

export  { ChatTextMsg };