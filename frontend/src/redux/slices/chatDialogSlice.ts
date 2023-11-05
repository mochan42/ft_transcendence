import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IChatDialogState {
  chatDialogSetPasswd: boolean,
  chatDialogSetTitle: boolean,
  chatDialogAddUser: boolean,
  chatDialogShwProfile: boolean,
  chatDialogProfileUserId : string | number | null
}
const initialState: IChatDialogState = {
  chatDialogSetPasswd: false,
  chatDialogSetTitle: false,
  chatDialogAddUser: false,
  chatDialogShwProfile: false,
  chatDialogProfileUserId: null
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
    updateChatDialogShwProfile: (state, action: PayloadAction<boolean>) => {
      state.chatDialogShwProfile = action.payload;
    },
    updateChatDialogProfileUserId: (state, action: PayloadAction<string | number | null>) => {
      state.chatDialogProfileUserId = action.payload;
    },
  },
});

export const {
  updateChatDialogSetPasswd,
  updateChatDialogSetTitle,
  updateChatDialogAddUser,
  updateChatDialogShwProfile,
  updateChatDialogProfileUserId
} = chatDialogSlice.actions;

export default chatDialogSlice;
