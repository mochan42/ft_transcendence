import React from 'react';
import { useState } from 'react';
import { FormProvider, useForm, SubmitHandler, UseFormHandleSubmit } from 'react-hook-form';
import { Dialog, Slide, DialogTitle, DialogContent } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack, IconButton } from "@mui/material";  
import Checkbox from "@mui/material/Checkbox";  
import FormControlLabel from "@mui/material/FormControlLabel";  
import RHF_TextField from './ui/RHF_TextField';
import RHF_AutoCompDropDown from './ui/RHF_AutoCompDropDown';


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
    handleClose: React.Dispatch<React.SetStateAction<boolean>>
}

type THandler = {
    close: React.Dispatch<React.SetStateAction<boolean>>
}

const MEMBERS = ["Name1", "Name2"];
const CreateGroupForm = ( handleFormClose: THandler ) => {

    const groupSchema = Yup.object().shape(
        {
            title: Yup.string().required("Title is required"),
            members: Yup.array().min(2, "Must at least 2 members"),
        }
    )


    const defaultValues = { 
        title: "" ,
        members: [],
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
        formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
    } = methods;

    //const onSubmit:SubmitHandler<TFormInputs> = async (data: TFormInputs) => {
    const onSubmit = async (data: any) => {
        try{
            // API CALL
            console.log("DATA", data);
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
                    <RHF_TextField name="title" label="Title"/>
                    {/* channel private */}
                    <FormControlLabel
                        label="Private"
                        control={<Checkbox checked={false} onChange={()=>{}} />}
                    />
                    {/* channel protection */}
                    <FormControlLabel
                        label="Protected"
                        control={<Checkbox checked={true} onChange={()=>{}} />}
                    />
                    {/* channel password */}
                    <RHF_TextField name="name" label="Password"/>
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
                <CreateGroupForm close={state.handleClose} />
            </DialogContent>
         
        </Dialog>
    )
}


export default ChatPageGroupsCreate