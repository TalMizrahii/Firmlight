import './Breadcrumbs.css';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ breadcrumbs }) => {
    return (
        <nav className="header-breadcrumbs" aria-label="breadcrumb">
            <ol className="breadcrumb">
                {breadcrumbs.map((crumb, index) => (
                    <li key={index} className={`breadcrumb-item${index === breadcrumbs.length - 1 ? ' active' : ''}`}
                        aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}>
                        {index === breadcrumbs.length - 1 ? (
                            // Last breadcrumb, not clickable.
                            <>{crumb}</>
                        ) : (
                            // Not the last breadcrumb, clickable.
                            <Link to={index === 0 ? "/groups" : "#"}>{crumb}</Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export default Breadcrumbs;
