import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from "react-redux"
import { persistStore, persistReducer } from "redux-persist"
import { rootPersistConfig, rootReducer } from "./rootReducer";
import chatSidebarSlice  from './slices/chatSideBar'


const store = configureStore({
    reducer: {
        chatSidebar : chatSidebarSlice.reducer  
    }
})

export type RootState = ReturnType<typeof store.getState>
export const selectChatSidebar = (state: RootState) => state.chatSidebar;

export default store;
/*
const store = configureStore({
    reducer: persistReducer(rootPersistConfig, rootReducer),
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
});


const persistor = persistStore(store);

const {dispatch} = store;

const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();

export { store, persistor, dispatch, useSelector, useDispatch }
*/