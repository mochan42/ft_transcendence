import  PropTypes  from "prop-types";
import {useFormContext, Controller } from 'react-hook-form'
import { TextField } from "@mui/material"

/*
RHF_TextField.propTypes = {
    name: PropTypes.string,
    helperText: PropTypes.node
}
*/

interface IRHF_TextFieldProps {
    name: string;
    label: string;
    type: string;
    helperText?: string;
  }


export default function RHF_TextField({ name, helperText, ...other }: any)
{   
    const {control} = useFormContext();
    return(
        <Controller 
            name={name} 
            control={control}
            render={({field, fieldState: {error} }) => (
                <TextField 
                    {...field} 
                    fullWidth
                    value={
                        typeof field.value === "number" && field.value === 0
                            ? ""
                            : field.value   
                    }
                    error={!!error}
                    helperText={error ? error.message : helperText}
                    {...other}
                />
            )}
        />
    )
}

