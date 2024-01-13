import React from 'react';
import { useState } from 'react';
import { FormProvider, useForm, SubmitHandler, UseFormHandleSubmit } from 'react-hook-form';
import { Dialog, Slide, DialogTitle, DialogContent, RadioGroup, FormLabel } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack } from "@mui/material";
import RHF_TextField from './ui/RHF_TextField';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { selectChatDialogStore, selectChatStore } from "../redux/store";
import { getSocket } from '../utils/socketService';
import { enChatPrivacy } from '../enums';
import { updateChatGroupChkPassInpState, updateChatGroupUsrPassInp, updateChatGroups } from '../redux/slices/chatSlice';
import { updateChatDialogInpPasswd } from '../redux/slices/chatDialogSlice';
import { Group } from '../types';


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


const CreateGroupFormInputPasswd = () => {
    const chatStore = useSelector(selectChatStore);
    const chatDialogStore = useSelector(selectChatDialogStore)
    const dispatch = useDispatch()
    const handleClose = () => {
        dispatch(updateChatDialogInpPasswd(false))     // close the form
    }

    const groupSchema = Yup.object().shape(
        {
            passwd: Yup.string().required("Password is required")

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


    const OnSubmit = async (data: any) => {
        dispatch(updateChatGroupUsrPassInp(getValues("passwd")));
        dispatch(updateChatGroupChkPassInpState({ check: true, group: chatStore.tmpGroup }));
        handleClose();
    }

    return (
        <FormProvider {...methods} >
            <form onSubmit={methods.handleSubmit(OnSubmit)}>
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
                    <Button onClick={handleClose}>Cancel </Button>
                    <Button type="submit" variant='contained'>Enter</Button>
                </Stack>
            </form>
        </FormProvider>
    )
}

const ChatGroupFormInputPasswd = () => {
    const chatDialogStore = useSelector(selectChatDialogStore)
    const open = chatDialogStore.chatDialogInpPasswd
    return (
        <Dialog fullWidth maxWidth="xs"
            open={open} TransitionComponent={Transition}
            keepMounted
            sx={{ p: 4 }}
        >
            {/* Title */}
            <DialogTitle> Input Access Password</DialogTitle>

            {/* Dialog content */}
            <DialogContent>

                {/* Create form */}
                <CreateGroupFormInputPasswd />
            </DialogContent>
        </Dialog>
    )
}

export default ChatGroupFormInputPasswd 