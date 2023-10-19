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
    socket: any
}

type THandler = {
    close: React.Dispatch<React.SetStateAction<boolean>>
    socket: any
}

const MEMBERS = ["Name1", "Name2"];
const CreateGroupForm = ( handleFormClose: THandler ) => {

    const groupSchema = Yup.object().shape(
        {
            title: Yup.string().required("Title is required"),
            members: Yup.array().min(2, "Must at least 2 members"),
            state_private: Yup.string(),
            state_protected: Yup.string(),
            privacy_state: Yup.string().required("Privacy level is required")
        }
    )


    const defaultValues = { 
        title: "" ,
        members: [],
        state_private: 'private',
        state_protected: 'protected',
        privacy_state: 'public'
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

    const [statePasswd, setStatePasswd] = useState<boolean>(true);

    const handleRadioBtn = (e : React.ChangeEvent<HTMLInputElement>) =>{
        const state = e.target.value;
        // setPrivacy(e.target.value);
        setValue('privacy_state', state)
        console.log(state);
        setStatePasswd(prevStatePasswd => !prevStatePasswd);
    }

    //const onSubmit:SubmitHandler<TFormInputs> = async (data: TFormInputs) => {
    // would be easier if data has the same names with channels colums in apis side
    const onSubmit = async (data: any) => {
        try{
            //API CALL
            const newChannel = {
                owner: Cookies.get('userId'),
                label: data.title,
                type: data.privacy_state,
                password: data.passwd,
                createdAt: new Date().toISOString()
            };
            handleFormClose.socket.emit('create_channel', newChannel);
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
                    <RHF_TextField name="title" label="Title" type="text"/>
                    {/* Privacy */}
                    <FormLabel>Privacy</FormLabel>
                        {/* channel private */}
                        <RadioGroup name='privacy_state' onChange={handleRadioBtn}>
                            <FormControlLabel
                                name='state_private'
                                label="Private"
                                control={<Radio />}
                                value={defaultValues.state_private}
                            />
                            {/* channel protection */}
                            <FormControlLabel
                                name='state_protected'
                                label="Protected"
                                control={<Radio />}
                                value={defaultValues.state_protected}
                            />
                        </RadioGroup>
                    {/* channel password */}
                    <RHF_TextField name="passwd" 
                        label="Password" 
                        type="password" 
                        disabled={statePasswd}
                    />
                    {/* channel members */}
                    <RHF_AutoCompDropDown name="members" label="Members" options={MEMBERS}/>
                </Stack>
                <Stack spacing={2} direction={"row"} 
                    alignItems={"center"}
                    justifyContent={"end"}
                >
                    <Button onClick={()=>handleFormClose.close(true)}>Cancel </Button>
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
            sx={{p: 4}}
        >
            {/* Title */}
            <DialogTitle>Create New Channel</DialogTitle>

            {/* Dialog content */}
            <DialogContent>

                {/* Create form */}
                <CreateGroupForm close={state.handleClose} socket={state.socket} />
            </DialogContent>
         
        </Dialog>
    )
}


export default ChatPageGroupsCreate