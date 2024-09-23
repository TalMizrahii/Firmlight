import {Box, Popper, Fade, Button, Typography, FormGroup, Stack} from "@mui/material";
import {Notification} from "../";
import './NotificationCenter.css'

export default function NotificationCenter({
                                               anchorEl,
                                               isOpen,
                                               notifications,
                                               handleNotificationAccept,
                                               handleNotificationAcceptAll,
                                               handleNotificationDecline,
                                               handleNotificationDeclineAll
                                           }) {

    return (
        <Box style={{margin: "2px"}} id="full-notification-center">
            <Popper open={isOpen} anchorEl={anchorEl} transition>
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Box>
                            <Box className="notification-box notification-box-upper">
                                <Typography className="MuiTypography-root-not" variant="h5">
                                    Notifications & Requests
                                </Typography>
                                <FormGroup>
                                </FormGroup>
                            </Box>
                            <Stack
                                className="notification-stack"
                                spacing={2}
                            >
                                {notifications.length === 0 ? (
                                    <h4 className="No-notifications">
                                        No notifications...
                                    </h4>
                                ) : (
                                    notifications.map((notification) => (
                                        <Notification
                                            key={notification.groupID}
                                            data={notification}
                                            onAccept={() => handleNotificationAccept(notification)}
                                            onDecline={() => handleNotificationDecline(notification)}
                                        />
                                    ))
                                )}
                            </Stack>
                            <Box className="notification-box notification-box-lower">
                                <Button
                                    id="notification-button-accept"
                                    className="notification-button"
                                    variant="contained"
                                    onClick={handleNotificationAcceptAll}>
                                    Accept All
                                </Button>

                                <Button
                                    id="notification-button-decline"
                                    className="notification-button"
                                    variant="contained" color="error"
                                    onClick={handleNotificationDeclineAll}>
                                    Decline all
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                )}
            </Popper>
        </Box>);
}
