//  chat action type and interface definition

import { User, Friend, Group, JoinGroup } from "../types"

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
    chatUsers: User[],
    chatUserFriends: Friend[],
    chatUserFriendRequests: Friend[],
    chatGroups: Group[],
    chatActiveGroupMembers: JoinGroup[],
    chatType: String | null,
    chatRoomId: String | null,
    chatActiveUser: Friend | undefined,
    chatSocket: any,
    chatUserFriendDialogState: boolean,
    chatActiveGroup: Group | null,
    chatGroupDialogState: boolean,
}

interface IActionPayload {
    type: string,
    payload: IChatState
}

interface IActionState {
    type: string,
}


export type TAction = IActionPayload | IActionState