import React from "react";
import { Box, TextField } from '@mui/material';

const WebCrawlingInputs = ({ urlsInput, setUrlsInput, crawlLimit, setCrawlLimit, setError, error }) => {
    // Handle changes for URLs
    const handleUrlsChange = (e) => {
        setUrlsInput(e.target.value);
        validateInputs(e.target.value, crawlLimit);
    };

    // Handle changes for crawl limit
    const handleCrawlLimitChange = (e) => {
        setCrawlLimit(e.target.value);
        validateInputs(urlsInput, e.target.value);
    };

    // Validate inputs
    const validateInputs = (urls, limit) => {
        const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
        const urlsArray = urls.split('\n').filter(url => url.trim() !== '');
        const invalidUrls = urlsArray.filter(url => !urlPattern.test(url));
        const urlsError = invalidUrls.length ? 'Some URLs are invalid.' : '';
        const limitError = !Number.isInteger(parseInt(limit, 10)) || parseInt(limit, 10) <= 0 ? 'Crawl limit must be a positive integer.' : '';
        setError(`${urlsError} ${limitError}`.trim());
    };

    return (
        <Box
            className="input-box"
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '370px', margin: 'auto' }}
        >
            <label>Web Crawling Inputs</label>
            <TextField
                label="URLs to Crawl (one per line)"
                multiline
                rows={5}
                variant="outlined"
                placeholder="Enter URLs, each on a new line"
                value={urlsInput}
                onChange={handleUrlsChange}
                required
                error={Boolean(error.includes('Some URLs are invalid'))}
                helperText={error.includes('Some URLs are invalid') ? 'Some URLs are invalid.' : ''}
            />

            <TextField
                label="Crawl Depth Limit"
                type="number"
                variant="outlined"
                placeholder="How deep each URL will crawl"
                value={crawlLimit}
                onChange={handleCrawlLimitChange}
                required
                error={Boolean(error.includes('Crawl limit must be a positive integer'))}
                helperText={error.includes('Crawl limit must be a positive integer') ? 'Crawl limit must be a positive integer.' : ''}
            />
        </Box>
    );
};

export default WebCrawlingInputs;
