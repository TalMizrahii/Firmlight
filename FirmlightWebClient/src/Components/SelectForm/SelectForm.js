import React, {useState} from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './SelectForm.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const SelectForm = ({options, onSelect, selectedTask}) => {

    return (

        <FormControl sx={{m: 1, width: 300}}>
            <InputLabel id="demo-single-select-label">Task</InputLabel>
            <Select
                labelId="demo-single-select-label"
                id="demo-single-select"
                value={selectedTask}
                onChange={onSelect}
                input={<OutlinedInput label="Task"/>}
                MenuProps={MenuProps}
            >
                {options.map((task) => (
                    <MenuItem
                        key={task}
                        value={task}
                    >
                        {task}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

    );
};

export default SelectForm;
