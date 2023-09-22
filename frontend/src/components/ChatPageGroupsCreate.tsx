import React from 'react'
//import { useForm } from 'react-hook-form'
import { Dialog, Slide, DialogTitle, DialogContent } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";


const Transition = React.forwardRef(function Transition (
    props: TransitionProps & { children: React.ReactElement<any, any>;},
    ref: React.Ref<unknown>)
    {
        return <Slide direction="up" ref={ref} {...props} />;
    }
);

type TGroupDialog = {
    openState: boolean,
    handlerClose: React.Dispatch<React.SetStateAction<null>>
}


// const createGroupForm = ({}) => {
//     const groupSchema = Yup.object().shape(
//         {
//             title: Yup.string().required("Title is required"),
//             members: Yup.array().min(2, "Must at least 2 members"),
//         }
//     )

//     const defaultValues = { 
//         title: "" ,
//         members: [],
//     }

//     const methods = useForm({
//         resolver: yupResolver(groupSchema),
//     }) 

// }

const ChatPageGroupsCreate = (state: TGroupDialog) => {
    return (
        <Dialog fullWidth maxWidth="xs" 
            open={state.openState} TransitionComponent={Transition}
            keepMounted
            sx={{p: 4}}
        >
            {/* Title */}
            <DialogTitle>Create New Group</DialogTitle>

            {/* Dialog content */}
            <DialogContent>
                {/* Create form */}
            </DialogContent>
            


        </Dialog>
    )
}


export default ChatPageGroupsCreate