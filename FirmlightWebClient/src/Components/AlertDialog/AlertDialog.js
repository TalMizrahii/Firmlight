import './AlertDialog.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({headline, description, agreeText, disagreeText, open, setOpen, handleAgree}) {

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="alert-dialog">
            <React.Fragment>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" className="alert-dialog">
                        {headline}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" className="alert-dialog">
                            {description}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus className="alert-dialog">
                            {disagreeText}
                        </Button>
                        <Button onClick={handleAgree} autoFocus className="alert-dialog">
                            {agreeText}
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    );
}