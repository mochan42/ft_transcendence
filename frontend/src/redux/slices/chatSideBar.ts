import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//import { dispatch } from "../store";
import { ThunkAction } from "redux-thunk"
import { CHAT_ACTION_TYPE, IChatState, TAction } from "..";




const initialState: IChatState = {
    chatSideBar:{
        open: false,
        type: CHAT_ACTION_TYPE.CHAT_CONTACT // options: 'CONTACT' 'STARRED' 'SHARED'
    }
}

//export default (state: ISidebarData, action: TAction) : ISidebarData => {}


const chatSidebarSlice = createSlice({
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
        }
    }
})                                                                                                                                      

export const { toggleSidebar, updateSidebarType } = chatSidebarSlice.actions;


export default chatSidebarSlice;


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