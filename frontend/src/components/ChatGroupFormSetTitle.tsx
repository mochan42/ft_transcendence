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
import { updateChatDialogSetTitle } from '../redux/slices/chatDialogSlice';


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


const CreateGroupFormSetTitle = () => {
    const dispatch = useDispatch()
    const chatStore = useSelector(selectChatStore);
    const handleClose = () => { 
        dispatch(updateChatDialogSetTitle(false))
    } 


    const groupSchema = Yup.object().shape(
        {
            oldTitle: Yup.string(),
            newTitle: Yup.string().required("Title is required").min(6),
            // members: Yup.array().min(1, "Must at least 1 member"),

        }
    )

    const defaultValues = { 
        oldTitle: chatStore.chatActiveGroup?.title ,
        newTitle: "" ,
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
            let newGroupData = chatStore.chatActiveGroup;

            // set new title to new group data
            if (newGroupData) {
                newGroupData = {...newGroupData, title: getValues("newTitle") }
                dispatch(updateChatActiveGroup(newGroupData));
                socket.emit('setChannelTitle', newGroupData);
            }
            // // update active group data in store

            // // remove old group from group list - pop
            // const groupListPop = chatStore.chatGroupList.filter( (el) => { 
            //     if ((el) && (newGroupData))
            //     {
            //         if (el.channelId != newGroupData?.channelId )
            //             return el
            //     }
            // })

            // // add new group to new group list - push
            // const groupListPush = [...groupListPop, newGroupData]

            // // update chatGroupList in store with new group list
            // dispatch(updateChatGroups(groupListPush));

            // console.log(newGroupData);
            // console.log("-------------\n");
        }
        catch (error)
        {
            console.log("EEROR!", error);
        }
        handleClose();
    }

    return (
        <FormProvider {...methods} > 
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Stack spacing={3} padding={2}>
                    {/* channel title - old */}
                    <RHF_TextField name="oldTitle" label="oldTitle" type="text" disabled/>

                    {/* channel title - new */}
                    <RHF_TextField name="newTitle" label="newTitle" type="text" />
                </Stack>
                <Stack spacing={2} direction={"row"} 
                    alignItems={"center"}
                    justifyContent={"end"}
                >
                    <Button onClick={handleClose}>Cancel </Button>
                    <Button type="submit" variant='contained'>Apply</Button>
                </Stack>
           </form>
        </FormProvider>
    )
}

const ChatGroupFormSetTitle = () => {
    const chatDialogStore = useSelector(selectChatDialogStore)
    const open = chatDialogStore.chatDialogSetTitle
    return (
        <Dialog fullWidth maxWidth="xs" 
            open={open} TransitionComponent={Transition}
            keepMounted
            sx={{p: 4}}
        >
            {/* Title */}
            <DialogTitle>Set Channel Title</DialogTitle>

            {/* Dialog content */}
            <DialogContent>

                {/* Create form */}
                <CreateGroupFormSetTitle />
            </DialogContent>
        </Dialog>
    )
}


export default ChatGroupFormSetTitle 