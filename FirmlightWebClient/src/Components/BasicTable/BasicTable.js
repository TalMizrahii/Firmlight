import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './BasicTable.css';

export default function BasicTable({taskData}) {
    // Get the current time
    const now = new Date().getTime();

    // Transform the JSON object into an array of objects
    const statisticsArray = Object.keys(taskData.statistics).map(key => {
        const stat = taskData.statistics[key];
        const startTime = new Date(stat.startTime).getTime();
        const finishTime = stat.finishTime ? new Date(stat.finishTime).getTime() : now;
        const time = (finishTime - startTime) / 1000; // Time in seconds

        return {
            user: stat.workerUsername,
            runStatus: stat.status,
            time: time,
            percentage: parseFloat(stat.percentage).toFixed(2)
        };
    });

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell align="right">Run Status</TableCell>
                        <TableCell align="right">Time (seconds)</TableCell>
                        <TableCell align="right">Percentage (%)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {statisticsArray.map((statistic, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {statistic.user}
                            </TableCell>
                            <TableCell align="right">{statistic.runStatus}</TableCell>
                            <TableCell align="right">
                                {statistic.time.toFixed(2)} {/* Rounded to 2 decimal places */}
                            </TableCell>
                            <TableCell align="right">{statistic.percentage}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
