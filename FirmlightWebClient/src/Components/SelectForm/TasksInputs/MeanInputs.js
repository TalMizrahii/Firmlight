import React, {useState, useEffect} from "react";
import {Box, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel} from '@mui/material';
import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';

const MeanInputs = ({setMeanArray}) => {
    const [inputMethod, setInputMethod] = useState('text');
    const [textInput, setTextInput] = useState('');
    const [error, setError] = useState('');

    const validateAndSetArray = (arr) => {
        const validNumbers = arr.filter(num => !isNaN(num) && Number.isInteger(num));
        if (validNumbers.length === 0) {
            setError("No valid integers found.");
            setMeanArray([]);
        } else {
            setError("");
            setMeanArray(validNumbers);
        }
    };

    const handleTextChange = (e) => {
        const value = e.target.value;
        setTextInput(value);

        if (value.trim() === '') {
            setError('');
            setMeanArray([]);
            return;
        }

        const numbers = value.split(',').map(num => {
            const trimmed = num.trim();
            return trimmed === '' ? NaN : parseInt(trimmed, 10);
        });

        validateAndSetArray(numbers);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setError('');
            setMeanArray([]);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet, {header: 1});

                const numbers = json.flat().map(num => parseInt(num, 10));
                validateAndSetArray(numbers);
            } catch (error) {
                setError("Error reading the file. Please ensure it's a valid Excel or CSV file.");
                setMeanArray([]);
            }
        };

        reader.onerror = () => {
            setError("Error reading the file.");
            setMeanArray([]);
        };

        reader.readAsArrayBuffer(file);
    };

    useEffect(() => {
        // Reset error and mean array when switching input method
        setError('');
        setMeanArray([]);
    }, [inputMethod]);

    return (
        <div className="new-task__mean-container">
            <Box>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Input Method</FormLabel>
                    <RadioGroup
                        row
                        value={inputMethod}
                        onChange={(e) => setInputMethod(e.target.value)}
                    >
                        <FormControlLabel value="text" control={<Radio/>} label="Text Input"/>
                        <FormControlLabel value="file" control={<Radio/>} label="File Upload"/>
                    </RadioGroup>
                </FormControl>

                {inputMethod === 'text' && (
                    <TextField
                        label="Enter numbers separated by commas"
                        variant="outlined"
                        fullWidth
                        value={textInput}
                        onChange={handleTextChange}
                        error={!!error}
                        helperText={error}
                        margin="normal"
                    />
                )}

                {inputMethod === 'file' && (
                    <Box mt={2}>
                        <Form.Control
                            type="file"
                            accept=".xlsx, .csv"
                            onChange={handleFileChange}
                            isInvalid={!!error}
                        />
                        {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default MeanInputs;