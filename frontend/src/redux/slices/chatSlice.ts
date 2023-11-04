// import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { useDispatch } from "react-redux";
// import { ThunkAction } from "redux-thunk";
// import { CHAT_ACTION_TYPE, IChatState } from "..";
import { CHAT_ACTION_TYPE, IChatState, TAction } from "..";
import { User, Friend, Group, JoinGroup, Chat, TGameReq } from "../../types";
// import axios from "axios";
// import { io } from "socket.io-client";

import {
  ChatUserFriendRequestList,
  ChatUserFriendsList,
  ChatUserList,
  ChatGroupList,
  ChatGroupMemberList,
  ChatUserMessages,
  ChatGameRequestList,
  dummyUsers
} from "../../data/ChatData";

const initialState: IChatState = {
  chatSideBar: {
    open: false,
    type: CHAT_ACTION_TYPE.CHAT_CONTACT, // options: 'CONTACT' 'STARRED' 'SHARED'
  },
  chatUsers: ChatUserList,
  //chatUsers: dummyUsers, // dev purpose
  chatUserFriends: ChatUserFriendsList,
  chatUserFriendRequests: ChatUserFriendRequestList,
  chatGroupList: ChatGroupList,
  chatGroupMembers: ChatGroupMemberList,
  chatType: null,
  chatRoomId: null,
  chatActiveUser: null,
  chatUserFriendDialogState: false,
  chatUserMessages: ChatUserMessages,
  chatActiveGroup: null,
  chatGroupDialogState: false,
  chatGroupCreateFormPasswdState: true,
  chatGameRequests: ChatGameRequestList,
};

//export default (state: ISidebarData, action: TAction) : ISidebarData => {}

const chatSlice = createSlice({
  name: "chatStoreSlice",
  initialState,
  reducers: {
    // toggle side bar
    toggleSidebar: (state) => {
      state.chatSideBar.open = !state.chatSideBar.open;
      //console.log(state.chatSideBar.open);
    },
    // update side bar type
    updateSidebarType: (state, action) => {
      state.chatSideBar.type = action.type;
      return action.payload;
    },
    // update list of users
    updateChatUsers: (state, action: PayloadAction<User[]>) => {
      state.chatUsers = action.payload;
    },
    // update list of user friends
    updateChatUserFriends: (state, action: PayloadAction<Friend[]>) => {
      state.chatUserFriends = action.payload;
    },
    // update list of user friend request
    updateChatUserFriendRequests: (state, action: PayloadAction<Friend[]>) => {
      state.chatUserFriendRequests = action.payload;
    },
    // selection conversion : group or one on one chat
    selectConversation: (state, action) => {
      state.chatType = action.payload.chatType;
      state.chatRoomId = action.payload.chatRoomId;
    },
    // onclick of chat item, update chatActiveUser
    updateChatActiveUser: (state, action: PayloadAction<Friend>) => {
      state.chatActiveUser = action.payload;
    },
    updateStateUserFriendDialog: (state, action: PayloadAction<boolean>) => {
      state.chatUserFriendDialogState = action.payload;
    },
    updateChatUserMessages: (state, action: PayloadAction<Chat[]>) => {
      state.chatUserMessages = action.payload;
    },
    updateChatGroups: (state, action: PayloadAction<Group[]>) => {
      state.chatGroupList = action.payload;
    },
    updateChatGroupMembers: (state, action: PayloadAction<JoinGroup[]>) => {
      state.chatGroupMembers = action.payload;
    },
    updateStateGroupDialog: (state, action: PayloadAction<boolean>) => {
      state.chatGroupDialogState = action.payload;
    },
    // onclick of chat group element, update chatActiveGroup
    updateChatActiveGroup: (state, action: PayloadAction<Group>) => {
      state.chatActiveGroup = action.payload;
    },
    // Disables and enables the password component on create group form
    updateChatGroupCreateFormPasswdState: (state, action: PayloadAction<boolean>) => {
      state.chatGroupCreateFormPasswdState = action.payload;
    },
    // update the list of game request sent via chat
    updateChatGameRequests: (state, action: PayloadAction<TGameReq[]>) => {
      state.chatGameRequests = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  updateSidebarType,
  updateChatUsers,
  updateChatUserFriends,
  updateChatUserFriendRequests,
  selectConversation,
  updateChatActiveUser,
  updateStateUserFriendDialog,
  updateChatDirectMessages,
  updateChatUserMessages,
  updateChatGroups,
  updateChatGroupMembers,
  updateStateGroupDialog,
  updateChatActiveGroup,
  updateChatGroupCreateFormPasswdState,
  updateChatGameRequests,
} = chatSlice.actions;
export default chatSlice;

// implement fetch routine for userFriends and userFriendRequests
//export const FetchUsers = () => {
//   const dispatch = useDispatch();

//   return async (): Promise<void> => {
//     try {
//       const response = await axios.get<TChatUserData[]>(
//         "https://special-dollop-r6jj956gq9xf5r9-5000.app.github.dev/pong/users/"
//       );
//       if (response.status === 200) {
//         dispatch(chatSlice.actions.updateChatUsers(response.data));
//         console.log("Received Users Info: ", response.data);
//       }
//     } catch (error) {
//       console.log("Error fetching users infos", error);
//     }
//   };
// };

//
/*
export function ToggleSidebar (){
    return  async () => {
        dispatch(slice.actions.toggleSidebar())
    }   
}

export function UpdateSidebarType(type:string) {
    return async () => {
        dispatch(slice.actions.updateSidebarType({
            type,
        }))
    }
}

*/
/*
const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        // toggle side bar
        toggleSidebar: (state) => { 
            state.sidebar.open = !state.sidebar.open;
            console.log(state.sidebar.open);
        },
        updateSidebarType(state, action:PayloadAction<TAction>){
            state.sidebar.type = action.payload.type;
        }
    }
})                                                                                                                                      

export default slice.reducer;


//
export function ToggleSidebar (){
    return  async () => {
        dispatch(slice.actions.toggleSidebar())
    }   
}

export function UpdateSidebarType(type:string) {
    return async () => {
        dispatch(slice.actions.updateSidebarType({
            type,
        }))
    }
}
*/
