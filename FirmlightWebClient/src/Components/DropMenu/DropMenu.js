import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";

const DropMenu = ({ handleClose, open, anchorEl, actions }) => {
    const handleMenuItemClick = (handler) => {
        handler();
        handleClose();
    };

    return (
        <Menu
            disableScrollLock={true}
            id="fade-menu"
            MenuListProps={{
                'aria-labelledby': 'fade-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
        >
            {actions.map((action, index) => (
                <MenuItem key={index} onClick={() => handleMenuItemClick(action.handler)}>
                    {action.title}
                </MenuItem>
            ))}
        </Menu>
    );
};

export default DropMenu;
