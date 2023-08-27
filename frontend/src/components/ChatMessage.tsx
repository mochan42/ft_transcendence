import React from 'react'
import { Chat_History } from '../data/ChatData';
import { ChatTextMsg } from '../types_Chat';


const ChatMessage = () => {
    return (
        <div className="p-3">
            <div className="space-y-3">
                {Chat_History.map((el) => {
                    switch (el.type) {
                        case "msg":
                            switch (el.subtype) {
                                case "img":
                                    break;
                                case "doc":
                                    break;
                                case "link":
                                    break;
                                case "reply":
                                    break;
                                default:
                                    return <ChatTextMsg key={el.id} {...el} />;
                            }
                            break;
                        default:
                            return <React.Fragment key={el.id}></React.Fragment>;
                    }
                })}
            </div>
        </div>
    );
};

export default ChatMessage;