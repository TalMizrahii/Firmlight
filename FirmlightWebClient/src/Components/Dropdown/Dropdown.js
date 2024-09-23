import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const Dropdown = ({selectedOptions, setSelectedOptions, inputPlaceholder, availableOptions, setAvailableOptions}) => {
    // newValue is the full current option, not just the title or the specific json of choice.
    // This is why the removal from the available options is not possible.
    const handleSelectedOptionsChange = (event, newValue) => {
        setSelectedOptions(newValue);
    };


    return (
        <Autocomplete
            multiple
            limitTags={2}
            id="multiple-limit-tags"
            options={availableOptions}
            getOptionLabel={(option) => option.username}
            value={selectedOptions}
            onChange={handleSelectedOptionsChange}
            renderInput={(params) => (
                <TextField {...params} label={inputPlaceholder} placeholder="Members"/>
            )}
            sx={{width: '100%'}}
        />
    );
};

export default Dropdown;
