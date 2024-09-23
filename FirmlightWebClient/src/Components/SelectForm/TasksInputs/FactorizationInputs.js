import React from "react";

const FactorizationInputs = ({ factorization, setFactorization, setError, error }) => {
    // Handle input change
    const handleChange = (e) => {
        const value = e.target.value;
        setFactorization(value);
        // Validate input on change
        if (!validateFactorization(value)) {
            setError('Please enter a valid natural number.');
        } else {
            setError('');
        }
    };

    // Validation function for factorization input
    const validateFactorization = (value) => {
        const number = parseInt(value, 10);
        return !isNaN(number) && number > 0 && Number.isInteger(number);
    };

    return (
        <div className="input-box">
            <label>Integer to factorize</label>
            <input
                type="text"
                name="factorization"
                placeholder="Enter a natural number to factorize"
                value={factorization}
                onChange={handleChange}
                required
            />
        </div>
    );
};

export default FactorizationInputs;
