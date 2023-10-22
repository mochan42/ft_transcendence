import { Tabs, Dialog, Stack, Tab } from '@mui/material';
import { useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { FetchUsers } from '../redux/slices/chatSlice';
import { useSelector } from 'react-redux';
import { selectChatStore } from "../redux/store";
import { ChatUserComp, ChatUserFriendComp, ChatUserFriendRequestComp } from './ChatUserComp';


const ChatUsersList = ()=> {
    const dispatch = useDispatch();
    
    // useEffect(()=>{
    //     dispatch({type: FetchUsers()});
    // }, []);

    const chatStore = useSelector(selectChatStore)
    return (
        <>
            { chatStore.chatUsers.map((el) => {
                return <ChatUserComp key={el.id} {...el}/>
            })};
        </>
    );
}

const ChatUserFriendsList = ()=> {
    const dispatch = useDispatch();
    
    // useEffect(()=>{
    //     dispatch({type: FetchUsers()});
    // }, []);

    const chatStore = useSelector(selectChatStore)
    return (
        <>
            { chatStore.chatUserFriends.map((el) => {
                return <ChatUserFriendComp key={el.id} {...el}/>
            })};
        </>
    );
}

const ChatUserFriendRequestsList = ()=> {
    const dispatch = useDispatch();
    
    // useEffect(()=>{
    //     dispatch({type: FetchUsers()});
    // }, []);

    const chatStore = useSelector(selectChatStore)
    return (
        <>
            { chatStore.chatUserFriendRequests.map((el) => {
                return <ChatUserFriendRequestComp key={el.userId} {...el}/>
            })};
        </>
    );
}


const ChatFriends = ({ open, handleClose } : any )=>{

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