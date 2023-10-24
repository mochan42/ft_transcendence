//  chat action type and interface definition

import { TChatUserData, TUserFriendRequest, User, Friend } from "../types"

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
    allUsers: User[],
    allFriends: Friend[],
    chatUserFriends: User[],
    chatUserFriendRequests: User[],
    chatType: String | null,
    chatRoomId: String | null,
    chatActiveUser: TChatUserData | null,
    chatSocket: any,
}

interface IActionPayload {
    type: string,
    payload: IChatState
}

interface IActionState {
    type: string,
}


export type TAction = IActionPayload | IActionState