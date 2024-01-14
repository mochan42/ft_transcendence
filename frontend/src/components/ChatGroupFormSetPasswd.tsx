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
import { updateChatDialogSetPasswd } from '../redux/slices/chatDialogSlice';


/**
 * See vide0 12 form creation
 * See video 9 for custom textfield creation
 */
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any>; },
    ref: React.Ref<unknown>) {
    return <Slide direction="up" ref={ref} {...props} />;
}
);


const CreateGroupFormSetPasswd = () => {
    const chatStore = useSelector(selectChatStore);
    const chatDialogStore = useSelector(selectChatDialogStore)
    const dispatch = useDispatch()
    const open = chatDialogStore.chatDialogSetPasswd
    const handleClose = () => {
        dispatch(updateChatDialogSetPasswd(false))
    }


    const groupSchema = Yup.object().shape(
        {
            passwd: Yup.string().required("Password is required"),

        }
    )

    const defaultValues = {
        passwd: "",
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
        try {
            let newGroupData = chatStore.chatActiveGroup;

            // set new password to new group data
            if (newGroupData) {
                newGroupData = { ...newGroupData, password: getValues("passwd") }
                if (newGroupData.privacy != enChatPrivacy.PROTECTED)
                    newGroupData.privacy = enChatPrivacy.PROTECTED
                if (newGroupData.password == "")
                    newGroupData.privacy = enChatPrivacy.PUBLIC
            }
            socket.emit('setGroupPassword', newGroupData);
            socket.on('groupPasswordChanged', (data: any) => {
                dispatch(updateChatActiveGroup(data.new));
            })
            handleClose();
        }
        catch (error) {
            console.log("EEROR!", error);
        }
        handleClose();
    }

    return (
        <FormProvider {...methods} >
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Stack spacing={3} padding={2}>
                    <RHF_TextField name="passwd"
                        label="Password"
                        type="password"
                    />
                </Stack>
                <Stack spacing={2} direction={"row"}
                    alignItems={"center"}
                    justifyContent={"end"}
                >
                    <Button onClick={() => handleClose()}>Cancel </Button>
                    <Button type="submit" variant='contained'>Set Password</Button>
                </Stack>
            </form>
        </FormProvider>
    )
}

const ChatGroupFormSetPasswd = () => {
    const chatDialogStore = useSelector(selectChatDialogStore)
    const open = chatDialogStore.chatDialogSetPasswd
    return (
        <Dialog fullWidth maxWidth="xs"
            open={open} TransitionComponent={Transition}
            keepMounted
            sx={{ p: 4 }}
        >
            {/* Title */}
            <DialogTitle>Set Password</DialogTitle>

            {/* Dialog content */}
            <DialogContent>

                {/* Create form */}
                <CreateGroupFormSetPasswd />
            </DialogContent>
        </Dialog>
    )
}

export default ChatGroupFormSetPasswd 