import './GroupNotificationSuccess.css';
import Success from '../../../Assets/icons/success.png';
import Close from '../../../Assets/icons/close.png';
const GroupNotificationSuccess = ({groupName, description, handleNotificationClose}) => {

    return (
        <>
            <div id="GroupNotificationSuccess" className="GroupNotification-frame">
                <div className="GroupNotification__head">
                    <div className="GroupNotification__head__status">
                        <img src={Success} alt="status"/>
                        <h1 id="GroupNotificationSuccess-headline">{groupName}</h1>
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
export default GroupNotificationSuccess;
