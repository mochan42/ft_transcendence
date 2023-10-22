//  chat action type and interface definition

import { TChatUserData } from "../types"

export const enum CHAT_ACTION_TYPE
{
    CHAT_CONTACT = 'CHAT_CONTACT',
    CHAT_STARRED = 'CHAT_STARRED',
    CHAT_SHARED = 'CHAT_SHARED',
}

export interface IChatSidebar {
    open: boolean,
    type: string
}

export interface IChatState {
    chatSideBar: IChatSidebar,
    chatUsers: TChatUserData[],
    chatUserFriends: any[],
    chatUserFriendRequests: any[],
    chatType: String | null,
    chatRoomId: String | null,
}

interface IActionPayload {
    type: string,
    payload: IChatState
}

interface IActionState {
    type: string,
}


export type TAction = IActionPayload | IActionState