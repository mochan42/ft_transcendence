import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IChatDialogState {
  chatDialogSetPasswd: boolean,
  chatDialogSetTitle: boolean,
  chatDialogAddUser: boolean,
}
const initialState: IChatDialogState = {
  chatDialogSetPasswd: false,
  chatDialogSetTitle: false,
  chatDialogAddUser: false,
};


const chatDialogSlice = createSlice({
  name: "chatStoreDialogSlice",
  initialState,
  reducers: {
    updateChatDialogSetPasswd: (state, action: PayloadAction<boolean>) => {
      state.chatDialogSetPasswd = action.payload;
    },
    updateChatDialogSetTitle: (state, action: PayloadAction<boolean>) => {
      state.chatDialogSetTitle = action.payload;
    },
    updateChatDialogAddUser: (state, action: PayloadAction<boolean>) => {
      state.chatDialogAddUser = action.payload;
    },
  },
});

export const {
  updateChatDialogSetPasswd,
  updateChatDialogSetTitle,
  updateChatDialogAddUser,
} = chatDialogSlice.actions;

export default chatDialogSlice;
