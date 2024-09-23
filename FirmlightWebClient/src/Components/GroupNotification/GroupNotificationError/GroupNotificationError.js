import './GroupNotificationError.css';
import Error from '../../../Assets/icons/error.png';
import Close from '../../../Assets/icons/close.png';

const GroupNotificationError = ({groupName, description, handleNotificationClose}) => {

    return (
        <>
            <div id="GroupNotificationError" className="GroupNotification-frame">
                <div className="GroupNotification__head">
                    <div className="GroupNotification__head__status">
                        <img src={Error} alt="status"/>
                        <h1 id="GroupNotification__head__error">{groupName}</h1>
                    </div>
                    <div className="GroupNotification__head-close">
                        <img onClick={handleNotificationClose} src={Close} alt="close"/>
                    </div>
                </div>
                <div className="GroupNotification__description">
                    <p>{description}</p>
                </div>
            </div>
        </>
    )
}
export default GroupNotificationError;
