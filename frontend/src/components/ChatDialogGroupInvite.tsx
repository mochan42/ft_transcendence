import { Tabs, Dialog, Stack, Tab } from '@mui/material';
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectChatDialogStore, selectChatStore } from "../redux/store";
import { ChatUserComp, ChatUserFriendComp, ChatUserFriendRequestComp } from './ChatUserComp';
import Cookies from 'js-cookie';
import { Group, JoinGroup, User } from "../types";
import { updateChatDialogGroupInvite } from '../redux/slices/chatDialogSlice';
import { ChatGroupDialogEntryComp, ChatGroupDialogInviteEntryComp, ChatGroupDialogRequestEntryComp } from './ChatGroupComp';
import { ChatGroupMemberList } from '../data/ChatData';
import { enChatGroupInviteStatus, enChatMemberRank } from '../enums';
import { useRef } from 'react';

const ChatGroupList = () => {
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const chatStore = useSelector(selectChatStore)
    useEffect(() => {

    }, [chatStore.chatGroupList])
    return (
        <>
            {chatStore.chatGroupList.map((group) => {
                if (group)
                    return <ChatGroupDialogEntryComp key={group.channelId} {...group} />
            })
            }
        </>
    )
}

function GetJoinGroupListForLoggedUser(): JoinGroup[] {
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const chatStore = useSelector(selectChatStore);

    // api call to fetch all JoinGroup elements for filtering
    const JoinGroupList = chatStore.chatGroupMembers;

    const affiliatedJoinGroupList = JoinGroupList.filter(el => el && el.userId &&
        (userId && (el.userId.toString()) == userId))

    return affiliatedJoinGroupList
}

function GetGroupDataById(groupList: (Group | null)[], groupId: number): Group | null {
    let group = {} as Group | null
    let resultList: (Group | null)[] = []
    if (groupList) {
        resultList = groupList.filter(el => el && el.channelId == groupId)

    }
    if (resultList.length == 1) {
        group = resultList[0]
    }
    return group
}

export const FindUserMemberShip = (userId: string | undefined, channelId: number): JoinGroup | null => {
    const chatStore = useSelector(selectChatStore)
    const groupMembers = chatStore.chatGroupMembers.filter(el => el.channelId == channelId);
    const userMemberShip = groupMembers.find(el => el && el.userId && el.userId.toString() == userId);
    if (!userMemberShip) {
        return null;
    }
    return userMemberShip;
}

const ChatGroupInviteList = () => {
    const chatStore = useSelector(selectChatStore)
    const groups = chatStore.chatGroupList
    const affliatedJoinGroupList = GetJoinGroupListForLoggedUser()
    const inviteList = affliatedJoinGroupList.filter(el =>
        el.status == enChatGroupInviteStatus.INVITE
    )
    let group = {} as Group | null

    useEffect(() => {

    }, [chatStore.chatGroupList, chatStore.chatAllJoinReq, chatStore.chatGroupMembers]);

    return (
        <>
            {inviteList.map((el) => {
                if (groups) {
                    group = GetGroupDataById(groups, el.channelId)
                    if (group)
                        return <ChatGroupDialogInviteEntryComp
                            key={group.channelId} {...group}
                        />
                }
            })
            }
        </>
    )
}

const isRequestOwner = (joinGroup: JoinGroup, userId: number): boolean => {
    return joinGroup.userId === userId;
}

const isRequestResponsible = (joinGroup: JoinGroup, userId: string): boolean => {
    const memberShip = FindUserMemberShip(userId, joinGroup.channelId);
    if (!memberShip) return false;
    if (memberShip.rank === enChatMemberRank.MEMBER) return false;
    return true;
}

const ChatGroupRequestList = () => {
    const chatStore = useSelector(selectChatStore)
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';

    const groups = chatStore.chatGroupList
    let allRequests = chatStore.chatGroupMembers.filter(el => el.status == enChatGroupInviteStatus.PENDING || el.status == enChatGroupInviteStatus.INVITE);

    useEffect(() => {
        allRequests = chatStore.chatGroupMembers.filter(el => el.status == enChatGroupInviteStatus.PENDING || el.status == enChatGroupInviteStatus.INVITE);


    }, [chatStore.chatGroupList, chatStore.chatGroupMembers, chatStore.chatAllJoinReq]);

    return (
        <>
            {allRequests
                .filter((joinG) => (
                    isRequestOwner(joinG, +userId!)
                    || isRequestResponsible(joinG, userId!)
                ))
                .map((el: any) => {
                    const group = GetGroupDataById(chatStore.chatGroupList, el.channelId)
                    if (group) {
                        return <ChatGroupDialogRequestEntryComp
                            key={el.id} group={group} joinGroup={el} />
                    }
                })
            }
        </>
    )
}


const ChatDialogGroupInvite = () => {

    const [value, setValue] = useState<Number>(0);

    const handleChange = (event: React.SyntheticEvent<Element, Event>,
        newValue: Number
    ) => {
        setValue(newValue);

    }
    const chatDialogStore = useSelector(selectChatDialogStore)
    const chatStore = useSelector(selectChatStore)
    const dispatch = useDispatch()
    const open = chatDialogStore.chatDialogGroupInvite
    const handleClose = () => {
        dispatch(updateChatDialogGroupInvite(false));
    }
    useEffect(() => {


    }, [
        chatStore.chatGroupList,
        chatStore.chatGroupMembers,
        chatStore.chatAllJoinReq,
        chatStore.chatSideBar.open
    ]);

    return (
        <>
            <Dialog fullWidth open={open} keepMounted
                onClose={handleClose} sx={{ p: 4 }}
            >
                <Stack p={2} sx={{ width: "100%" }}>
                    <Tabs value={value} centered onChange={handleChange}>
                        <Tab label={"Groups"} />
                        <Tab label={"Invites"} />
                        <Tab label={"Requests"} />
                    </Tabs>
                </Stack>
                {/* Dialog content  */}
                <Stack sx={{ height: "100%" }} p={2}>
                    <Stack spacing={1}>
                        {(() => {
                            switch (value) {
                                case 0:
                                    return (<>
                                        <ChatGroupList />
                                    </>);
                                case 1:
                                    return (<>
                                        <ChatGroupInviteList />
                                    </>);
                                case 2:
                                    return (<>
                                        <ChatGroupRequestList />
                                    </>);
                                default: break
                            }
                        })()}
                    </Stack>
                </Stack>
            </Dialog>
        </>
    )
}






export default ChatDialogGroupInvite