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
import { selectChatStore } from "../redux/store";
import { getSocket } from '../utils/socketService';
import { enChatPrivacy } from '../enums';
import { updateChatActiveGroup, updateChatGroupCreateFormPasswdState, updateChatGroups } from '../redux/slices/chatSlice';


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

type TGroupDialog = {
    openState: boolean,
    handleClose: React.Dispatch<React.SetStateAction<boolean>>,
}

type THandler = {
    close: React.Dispatch<React.SetStateAction<boolean>>
}


const CreateGroupFormSetPasswd = ( handleFormClose: THandler ) => {
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch()


    const groupSchema = Yup.object().shape(
        {
            passwd: Yup.string().required("Password is required").min(6),
            // members: Yup.array().min(1, "Must at least 1 member"),

        }
    )

    const defaultValues = { 
        passwd: "" ,
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

            // set new password to new group data
            newGroupData ? (newGroupData.password = getValues("passwd")) : null
            
            // update active group data in store
            dispatch(updateChatActiveGroup(newGroupData));

            // remove old group from group list - pop
            const groupListPop = chatStore.chatGroupList.filter( (el) => { 
                (el) && (el.channelId != newGroupData?.channelId )
            })

            // add new group to new group list - push
            const groupListPush = [...groupListPop, newGroupData]

            // update chatGroupList in store with new group list
            dispatch(updateChatGroups(groupListPush));

            // API CALL - post updated data to backend
            // NOTE !!!
            // new emit 'setPassword' to be updated in backend
            socket.emit('setPassword', newGroupData);
            handleFormClose.close(false);
        }
        catch (error)
        {
            console.log("EEROR!", error);
        }
    }

    return (
        <FormProvider {...methods} > 
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Stack spacing={3} padding={2}>
                    {/* channel title */}
                    {/* <RHF_TextField name="title" label="Title" type="text"/> */}
                    {/* channel password */}
                    <RHF_TextField name="passwd" 
                        label="Password" 
                        type="password" 
                    />
                </Stack>
                <Stack spacing={2} direction={"row"} 
                    alignItems={"center"}
                    justifyContent={"end"}
                >
                    <Button onClick={()=>handleFormClose.close(true)}>Cancel </Button>
                    <Button type="submit" variant='contained'>Set Password</Button>
                </Stack>
           </form>
        </FormProvider>
    )
}

const ChatGroupFormSetPasswd = (state: TGroupDialog) => {
    return (
        <Dialog fullWidth maxWidth="xs" 
            open={state.openState} TransitionComponent={Transition}
            keepMounted
            sx={{p: 4}}
        >
            {/* Title */}
            <DialogTitle>Set Password</DialogTitle>

            {/* Dialog content */}
            <DialogContent>

                {/* Create form */}
                <CreateGroupFormSetPasswd close={state.handleClose} />
            </DialogContent>
        </Dialog>
    )
}


export default ChatGroupFormSetPasswd 