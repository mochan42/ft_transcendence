import { combineReducers } from "redux";
import storage  from 'redux-persist/lib/storage';
import chatSidebarSlice from './slices/chatSlice'


// slices
/* Determine how data is stored and retrieve */
const rootPersistConfig = {
    key: "root",
    storage,
    keyPrefix: 'redux-',
    // whitelist: [],
    // blacklist: [],
}


const rootReducer = combineReducers({
    chatSidebar: chatSidebarSlice.reducer,
});


export { rootPersistConfig, rootReducer };
