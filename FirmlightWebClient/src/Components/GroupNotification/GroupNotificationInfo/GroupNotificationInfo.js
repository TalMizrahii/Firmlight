import './GroupNotificationInfo.css';
import InfoNot from '../../../Assets/icons/infoNot.png';
import Close from '../../../Assets/icons/close.png';

const GroupNotificationInfo = ({groupName, description, handleNotificationClose}) => {

    return (
        <>
            <div id="GroupNotificationInfo" className="GroupNotification-frame">
                <div className="GroupNotification__head">
                    <div className="GroupNotification__head__status">
                        <img src={InfoNot} alt="status"/>
                        <h1>{groupName}</h1>
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
export default GroupNotificationInfo;
