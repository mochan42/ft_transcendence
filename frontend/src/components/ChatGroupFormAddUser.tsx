import React from 'react';
import { useState } from 'react';
import { FormProvider, useForm, SubmitHandler, UseFormHandleSubmit } from 'react-hook-form';
import { Dialog, Slide, DialogTitle, DialogContent, RadioGroup, FormLabel } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack, Radio } from "@mui/material";  
import Checkbox from "@mui/material/Checkbox";  
import FormControlLabel from "@mui/material/FormControlLabel";  
import RHF_TextField from './ui/RHF_TextField';
import RHF_AutoCompDropDown from './ui/RHF_AutoCompDropDown';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { selectChatDialogStore, selectChatStore } from "../redux/store";
import { getSocket } from '../utils/socketService';
import { enChatPrivacy } from '../enums';
import { updateChatActiveGroup, updateChatGroupCreateFormPasswdState, updateChatGroups } from '../redux/slices/chatSlice';
import { TFormMember, User } from '../types';
import { getUserById } from './ChatConversation';
import { updateChatDialogAddUser } from '../redux/slices/chatDialogSlice';


/**
 * See vide0 12 form creation
 * See video 9 for custom textfield creation
 */
const Transition = React.forwardRef(function Transition (
    props: TransitionProps & { children: React.ReactElement<any, any>;},
    ref: React.Ref<unknown>)
    {
        return <Slide direction="up" ref={ref} {...props} />;
    }
);


const CreateGroupFormAddUser = () => {
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch()
    const handleClose = () => { 
        dispatch(updateChatDialogAddUser(false))
    } 

    // fetch user data of all group members
    let memberUsers: User[] = [];
    chatStore.chatGroupMembers.forEach((member) => {
        memberUsers.push(getUserById(chatStore.chatUsers, member.usrId))
    })

    // filter out non-members
    const nonMemberUsers = chatStore.chatUsers.filter(el => !(memberUsers.includes(el)));
    
    // create list of non members for form selection
    let  nonMembers : TFormMember[] = [];
    nonMemberUsers.map((el) => {
        nonMembers.push({ id: el.id, name: el.userName })
    })

    const groupSchema = Yup.object().shape(
        {
            members: Yup.array().min(1, "Must at least 1 member"),
            // members: Yup.array().min(1, "Must at least 1 member"),

        }
    )

    const defaultValues = { 
        members: [] ,
        // members: [], // to be replace with list of all users
        // privacy_state: enChatPrivacy.PUBLIC,
    }

    const methods = useForm({
        resolver: yupResolver(groupSchema),
        defaultValues,
    }) 

    const {
        reset,
        watch,
        setError,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
    } = methods;

    const socket = getSocket(Cookies.get('userId'));


    //const onSubmit:SubmitHandler<TFormInputs> = async (data: TFormInputs) => {
    // would be easier if data has the same names with channels colums in apis side
    const onSubmit = async (data: any) => {
        try{

            // send data to backend for update
            // API CALL - post updated data to backend
            // NOTE !!!
            const newMembers = data.members.map((elt: {id: any, name: any }) => elt.id);
            const formatedData = {
                ...data,
                members: newMembers
            };
            // new emit 'setAddUser' to be created in backend
            //socket.emit('addUser', groupListPush);
            
            // update group members in store with new member of  type JoinGroup
        }
        catch (error)
        {
            console.log("EEROR!", error);
        }
        handleClose()
    }

    return (
        <FormProvider {...methods} > 
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Stack spacing={3} padding={2}>

                    {/* channel members */}
                    <RHF_AutoCompDropDown name="members" label="Members" options={nonMembers}/>
                </Stack>
                <Stack spacing={2} direction={"row"} 
                    alignItems={"center"}
                    justifyContent={"end"}
                >
                    <Button onClick={handleClose}>Cancel </Button>
                    <Button type="submit" variant='contained'>Add Users</Button>
                </Stack>
           </form>
        </FormProvider>
    )
}

const ChatGroupFormAddUser = () => {
    const chatDialogStore = useSelector(selectChatDialogStore)
    const open = chatDialogStore.chatDialogAddUser
    return (
        <Dialog fullWidth maxWidth="xs" 
            open={open} TransitionComponent={Transition}
            keepMounted
            sx={{p: 4}}
        >
            {/* Title */}
            <DialogTitle>Add User</DialogTitle>

            {/* Dialog content */}
            <DialogContent>

                {/* Create form */}
                <CreateGroupFormAddUser />
            </DialogContent>
        </Dialog>
    )
}


export default ChatGroupFormAddUser