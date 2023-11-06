import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from "react-redux"
import { persistStore, persistReducer } from "redux-persist"
import { rootPersistConfig, rootReducer } from "./rootReducer";
import chatSlice  from './slices/chatSlice'
import chatDialogSlice from "./slices/chatDialogSlice";


const store = configureStore({
    reducer: {
        chatStore : chatSlice.reducer,
        chatDialogStore : chatDialogSlice.reducer

    }
})

export type RootState = ReturnType<typeof store.getState>
export const selectChatStore = (state: RootState) => state.chatStore;
export const selectChatDialogStore = (state: RootState) => state.chatDialogStore;

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