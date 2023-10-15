import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { ThunkAction } from "redux-thunk"
import { CHAT_ACTION_TYPE, IChatState, TAction } from "..";
import { User } from "../../types";
import axios from 'axios'



const initialState: IChatState = {
    chatSideBar:{
        open: false,
        type: CHAT_ACTION_TYPE.CHAT_CONTACT // options: 'CONTACT' 'STARRED' 'SHARED'
    },
    chatUsers: [],
    chatUserFriends: [],
    chatUserFriendRequests: [],
}

//export default (state: ISidebarData, action: TAction) : ISidebarData => {}


const chatSlice = createSlice({
    name: 'chatSidebar',
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
            return action.payload
        },
        // update list of users
        updateChatUsers: (state, action) => {
            state.chatUsers = action.payload.chatUsers
        },
        // update list of user friends
        updateChatUserFriends: (state, action) => {
            state.chatUserFriends = action.payload.chatUserFriends
        },
        // update list of user friends
        updateChatUserFriendRequests: (state, action) => {
            state.chatUserFriendRequests = action.payload.chatUserFriendRequests
        }
    }
})                                                                                                                                      


export const { 
    toggleSidebar,
    updateSidebarType,
    updateChatUsers,
    updateChatUserFriends,
    updateChatUserFriendRequests
} = chatSlice.actions;
export default chatSlice;


// implement fetch routine for userFriends and userFriendRequests
export const FetchUsers = () =>{
    const dispatch =  useDispatch()

    return async(): Promise<void> => {
        try {
            const response = await axios.get<User[]>('http://localhost:5000/pong/users/');
            if (response.status === 200) {
                dispatch(chatSlice.actions.updateChatUsers({ChatUsers: response.data}));
                console.log('Received Users Info: ', response.data)
            }
        }
        catch (error) {
            console.log('Error fetching users infos', error);
        }
    }
}

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