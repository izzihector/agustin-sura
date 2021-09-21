import React from 'react';
import {Link} from 'react-router-dom';

const SidebarElement = (props) => (
    <li id={props.id} className="nav-item">
        <Link className="nav-link" to={props.url}>
            <i className={props.icon}></i>
            <span>{props.text}</span>
        </Link>
    </li>
);

export default SidebarElement;