import './Notification.css'

const Notification = ({data, onAccept, onDecline}) => {
    return (
        <div className="card w-60">
            <div className="card-body">
                <h5 className="card-title">{data.content}</h5>
                <a href="#" id="notification-btn-accept" className="notification-btn btn btn-primary" onClick={onAccept}>Accept</a>
                <a href="#" id="notification-btn-decline" className="notification-btn btn btn-primary" onClick={onDecline}>Decline</a>
            </div>
        </div>
    )
}

export default Notification;
