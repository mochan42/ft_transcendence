import { Tabs, Dialog, Stack, Tab } from '@mui/material';
import { useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { FetchUsers } from '../redux/slices/chatSlice';
import { useSelector } from 'react-redux';
import { selectChatStore } from "../redux/store";
import { ChatUserComp, ChatUserFriendComp, ChatUserFriendRequestComp } from './ChatUserComp';
import Cookies from 'js-cookie';
import { User } from "../types";
import { ACCEPTED, PENDING } from '../APP_CONSTS';

const ChatUsersList = ()=> {
    const dispatch = useDispatch();
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const chatStore = useSelector(selectChatStore)

    return (
        <>
            {chatStore.allUsers
                .filter((user) => user.id != userId)
                .map((el) => {
                    return <ChatUserComp key={el.id} {...el} />
                })
            };
        </>
    );
}

const ChatUserFriendsList = ()=> {
    const dispatch = useDispatch();
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const chatStore = useSelector(selectChatStore)

    return (
        <>
            {chatStore.allFriends
                .filter((req: any) => req.relation == ACCEPTED)
                .map((el: any) => {
                    const friend: User | undefined = chatStore.allUsers
                        .filter((tmpUser) => tmpUser.id != userId)
                        .find((user: any) => el.sender == user.id || el.receiver == user.id);
                    if (friend) {
                        return <ChatUserFriendComp key={friend.id} {...friend} />
                    }
                })
            };
        </>
    );
}

const ChatUserFriendRequestsList = ()=> {
    const dispatch = useDispatch();
     const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    
    const chatStore = useSelector(selectChatStore)
    return (
        <>
            {chatStore.allFriends
                .filter((req) => req.receiver == userId && req.relation === PENDING)
                .map((el) => {
                    const friendReq: User | undefined = chatStore.allUsers.find((user: any) => el.sender == user.id);
                    if (friendReq) {
                        return <ChatUserFriendRequestComp key={friendReq.id} {...friendReq}/>
                    }
                 })
            };
        </>
    );
}


const ChatFriends = ({ open, handleClose} : any )=>{

    const [value, setValue] = useState<Number>(0);

    const handleChange = (event: React.SyntheticEvent<Element, Event>,
                         newValue: Number
                         ) =>{
        setValue(newValue);

    }


    return (
        <>
        <Dialog fullWidth maxWidth="xs" open={open} keepMounted
            onClose={handleClose} sx={{p: 4}}
        >
            <Stack p={2} sx={{width: "100%"}}>
                <Tabs value={value} centered onChange={handleChange}>
                    <Tab label={"Users"} />
                    <Tab label={"Friends"} />
                    <Tab label={"Requests"} />
                </Tabs>
            </Stack>
            {/* Dialog content  */}
            <Stack sx={{heigt: "100%"}}>
                <Stack spacing={2.5}>
                    {(()=>{
                        switch (value)
                        {
                            case 0:
                                return (<>
                                    <ChatUsersList />
                                </>);
                            case 1:
                                return (<>
                                <ChatUserFriendsList />
                                </>);
                            case 2:
                                return (<>
                                <ChatUserFriendRequestsList />
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






export default ChatFriends