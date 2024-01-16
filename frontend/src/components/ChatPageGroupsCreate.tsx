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
import { updateChatGroupCreateFormPasswdState, updateChatGroupMembers, updateChatGroups, updateChatAllJoinReq, updateNewGrpId } from '../redux/slices/chatSlice';
import { TFormMember } from '../types';
import { element } from 'prop-types';


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

type TGroupDialog = {
    openState: boolean,
    handleClose: React.Dispatch<React.SetStateAction<boolean>>,
}

type THandler = {
    close: React.Dispatch<React.SetStateAction<boolean>>
}


// const MEMBERS = [
//     {id: "2", name: "Cudoh"},
//     {id: "3", name: "Philip"},
//     {id: "4", name: "Monine"},
// ];
const CreateGroupForm = (handleFormClose: THandler) => {
    const chatStore = useSelector(selectChatStore);
    const dispatch = useDispatch();
    const userId = Cookies.get('userId');

    let MEMBERS: TFormMember[] = [];
    chatStore.chatUsers.forEach((el) => {
        if (el.id != userId) {
            MEMBERS.push({ id: el.id, name: el.userName });
        }
    });

    const groupSchema = Yup.object().shape(
        {
            title: Yup.string().required("Title is required"),
            members: Yup.array().min(1, "Must at least 1 member"),
            privacy_state: Yup.string(),
        }
    )

    const defaultValues = {
        title: "",
        members: [], // to be replace with list of all users
        privacy_state: enChatPrivacy.PUBLIC,
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

    const handleRadioBtn = (e: React.ChangeEvent<HTMLInputElement>) => {
        const state = e.target.value;
        // setPrivacy(e.target.value);
        //setValue("privacy_state", state)
        //console.log(state);
        (state == enChatPrivacy.PROTECTED)
            ? dispatch(updateChatGroupCreateFormPasswdState(false))
            : dispatch(updateChatGroupCreateFormPasswdState(true))
    }

    //const onSubmit:SubmitHandler<TFormInputs> = async (data: TFormInputs) => {
    // would be easier if data has the same names with channels colums in apis side
    const onSubmit = async (data: any) => {
        dispatch(updateChatGroupCreateFormPasswdState(true))
        try {
            //API CALL
            const newMembers = data.members.map((elt: any) => {
                if (elt)
                    return elt.id;
            });
            const formatedData = {
                ...data,
                members: newMembers
            };
            if (formatedData.privacy_state == enChatPrivacy.PROTECTED && !formatedData.passwd) {
                alert('password is required');
            }
            else {
                socket.emit('createChannel', formatedData);
            }
            socket.on('newChannel', (data: any) => {
                console.log(data.members);
                dispatch(updateChatGroups(data.groups));
                dispatch(updateChatGroupMembers(data.members));
                if (data.owner == userId) {
                    dispatch(updateNewGrpId(formatedData.channelId));
                }
                dispatch(updateChatAllJoinReq(data.members));
            });
            handleFormClose.close(false);
        }
        catch (error) {
            console.log("EEROR!", error);
        }
    }

    return (
        <FormProvider {...methods} >
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Stack spacing={3} padding={2}>
                    {/* channel title */}
                    <RHF_TextField name="title" label="Title" type="text" />
                    {/* Privacy */}
                    <FormLabel>Privacy</FormLabel>
                    <RadioGroup name='privacy_state'
                        onChange={handleRadioBtn}
                        defaultValue={defaultValues.privacy_state}
                    >
                        {/* channel public */}
                        <FormControlLabel
                            name='state_public'
                            label="Public"
                            control={<Radio />}
                            value={enChatPrivacy.PUBLIC}
                        />
                        {/* channel private */}
                        <FormControlLabel
                            name='state_private'
                            label="Private"
                            control={<Radio />}
                            value={enChatPrivacy.PRIVATE}
                        />
                        {/* channel protection */}
                        <FormControlLabel
                            name='state_protected'
                            label="Protected"
                            control={<Radio />}
                            value={enChatPrivacy.PROTECTED}
                        />
                    </RadioGroup>
                    {/* channel password */}
                    <RHF_TextField name="passwd"
                        label="Password"
                        type="password"
                        disabled={chatStore.chatGroupCreateFormPasswdState}
                    />
                    {/* channel members */}
                    <RHF_AutoCompDropDown name="members" label="Members" options={MEMBERS} />
                </Stack>
                <Stack spacing={2} direction={"row"}
                    alignItems={"center"}
                    justifyContent={"end"}
                >
                    <Button onClick={() => handleFormClose.close(true)}>Cancel </Button>
                    <Button type="submit" variant='contained'>Create</Button>
                </Stack>
            </form>

        </FormProvider>
    )
}

const ChatPageGroupsCreate = (state: TGroupDialog) => {
    return (
        <Dialog fullWidth maxWidth="xs"
            open={state.openState} TransitionComponent={Transition}
            keepMounted
            sx={{ p: 4 }}
        >
            {/* Title */}
            <DialogTitle>Create New Channel</DialogTitle>

            {/* Dialog content */}
            <DialogContent>

                {/* Create form */}
                <CreateGroupForm close={state.handleClose} />
            </DialogContent>

        </Dialog>
    )
}


export default ChatPageGroupsCreate