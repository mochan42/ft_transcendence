
import  PropTypes  from "prop-types";
import {useFormContext, Controller } from 'react-hook-form'
import { Autocomplete, TextField } from "@mui/material"

interface IRHF_AutoCompDropDownProps {
    name: string;
    label: string;
    helperText?: string;
    options: any[];
}



export default function RHF_AutoCompDropDown({ name, label, helperText, options, ...other }: IRHF_AutoCompDropDownProps)
{   
    const { control, setValue } = useFormContext();
    return(
        <Controller 
            name={name} 
            control={control}
            render={({field, fieldState: {error} }) => (
                <Autocomplete 
                    multiple
                    freeSolo
                    options={options}
                    getOptionLabel={(option) => option.name} 
                    {...field} 
                    fullWidth
                    value={
                        typeof field.value === "number" && field.value === 0
                            ? ""
                            : field.value   
                    }
                    onChange={(event, newValue) =>  setValue(name, newValue, {shouldValidate: true})}
                    {...other}
                    renderInput={ (params)=>(
                        <TextField 
                            {...params}
                            label={label} 
                            error={!!error} 
                            helperText={error ? error.message : helperText}
                        />
                    )}
                />
            )}
        />
    )
}

