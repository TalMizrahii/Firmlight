import React from 'react';
import './Content.css';

const Content = ({children}) => {
    return (
        <div className="content">
            {children}
        </div>
    );
}

export default Content;