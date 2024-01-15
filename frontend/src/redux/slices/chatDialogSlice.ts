import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IChatDialogState {
  chatDialogSetPasswd: boolean,
  chatDialogSetTitle: boolean,
  chatDialogAddUser: boolean,
  chatDialogShwProfile: boolean,
  chatDialogProfileUserId : string | number | null
  chatDialogShwPasswd: boolean,
  chatDialogGroupInvite: boolean,
  chatDialogInpPasswd: boolean,
  chatDialogShwMsg: boolean,
}
const initialState: IChatDialogState = {
  chatDialogSetPasswd: false,
  chatDialogSetTitle: false,
  chatDialogAddUser: false,
  chatDialogShwProfile: false,
  chatDialogProfileUserId: null,
  chatDialogShwPasswd: false,
  chatDialogGroupInvite: false,
  chatDialogInpPasswd: false,
  chatDialogShwMsg: false,
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
    updateChatDialogShwPasswd: (state, action: PayloadAction<boolean>) => {
      state.chatDialogShwPasswd = action.payload;
    },
    updateChatDialogGroupInvite: (state, action: PayloadAction<boolean>) => {
      state.chatDialogGroupInvite = action.payload;
    },
    updateChatDialogInpPasswd: (state, action: PayloadAction<boolean>) => {
      state.chatDialogInpPasswd = action.payload;
    },
    updateChatDialogShwMsg: (state, action: PayloadAction<boolean>) => {
      state.chatDialogShwMsg = action.payload;
    },
  },
});

export const {
  updateChatDialogSetPasswd,
  updateChatDialogSetTitle,
  updateChatDialogAddUser,
  updateChatDialogShwProfile,
  updateChatDialogProfileUserId,
  updateChatDialogShwPasswd,
  updateChatDialogGroupInvite,
  updateChatDialogInpPasswd,
  updateChatDialogShwMsg
} = chatDialogSlice.actions;

export default chatDialogSlice;
