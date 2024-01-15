import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Gear } from 'phosphor-react';
import { Group } from '../types';
import { enChatPrivacy, enChatType } from '../enums';
import ChatGroupFormSetPasswd from './ChatGroupFormSetPasswd';
import chatDialogSlice, {
  updateChatDialogAddUser,
  updateChatDialogSetTitle,
  updateChatDialogShwPasswd
} from '../redux/slices/chatDialogSlice';
import { useSelector } from 'react-redux';
import { selectChatDialogStore, selectChatStore } from '../redux/store';
import { useDispatch } from 'react-redux';
import { updateChatDialogSetPasswd } from '../redux/slices/chatDialogSlice';
import { Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { getSocket } from '../utils/socketService';
import { useEffect } from 'react';
import { toggleSidebar, updateChatActiveGroup, selectConversation } from '../redux/slices/chatSlice';

export default function ChatGroupActionBtn(privacy: string, btnState: boolean) {
  const chatDialogStore = useSelector(selectChatDialogStore)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const chatStore = useSelector(selectChatStore);
  const socket = getSocket(Cookies.get('userId'));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const OnChangePasswd = () => {
    dispatch(updateChatDialogSetPasswd(true));
    handleClose()
  }
  const OnSetTitle = () => {
    dispatch(updateChatDialogSetTitle(true))
    handleClose()
  }
  const OnAddUser = () => {
    dispatch(updateChatDialogAddUser(true))
    handleClose()
  }

  const OnShwPasswd = () => {
    dispatch(updateChatDialogShwPasswd(true))
    handleClose()
  }

  const deleteGroup = () => {
    if (chatStore.chatActiveGroup) {
      socket.emit('deleteGroup', chatStore.chatActiveGroup.channelId);
      dispatch(toggleSidebar());
      dispatch(updateChatActiveGroup(null));
      dispatch(selectConversation({ chatRoomId: null, chatType: enChatType.Group }))
      handleClose();
    }
  }

  const OnUnsetPassword = () => {
    if (chatStore.chatActiveGroup != null) {
      const newGroup = { ...chatStore.chatActiveGroup, privacy: enChatPrivacy.PUBLIC, password: '' };
      socket.emit('setGroupPassword', newGroup);
      dispatch(updateChatActiveGroup(newGroup));
    }
    handleClose();
  }


  useEffect(() => {

  });
  if (btnState == false)
    return <></>;
  return (
    <div>
      <Button
        startIcon={<Gear size={25} />}
        fullWidth
        variant='outlined'
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Action
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={OnAddUser}>Add User</MenuItem>
        <MenuItem onClick={OnSetTitle}>Rename Group Title</MenuItem>
        <MenuItem onClick={deleteGroup}>Delete Group</MenuItem>
        {chatStore.chatActiveGroup && chatStore.chatActiveGroup.privacy == enChatPrivacy.PROTECTED && <MenuItem onClick={OnShwPasswd}>Show Password</MenuItem>}
        {chatStore.chatActiveGroup && chatStore.chatActiveGroup.privacy != enChatPrivacy.PROTECTED && <MenuItem onClick={OnChangePasswd}>Set Password</MenuItem>}
        {chatStore.chatActiveGroup && chatStore.chatActiveGroup.privacy == enChatPrivacy.PROTECTED && <MenuItem onClick={OnUnsetPassword}>Unset Password</MenuItem>}
        {chatStore.chatActiveGroup && chatStore.chatActiveGroup.privacy == enChatPrivacy.PROTECTED && <MenuItem onClick={OnChangePasswd}>Change Password</MenuItem>}
      </Menu>
    </div>
  );
}