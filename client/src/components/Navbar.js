import { Link, useHistory } from 'react-router-dom';
import React from 'react';
import '../css/navbar.css'

const Navbar = () => {
    return (
        <div className='navbar'>
            <Link to={'/iga'}>IGA Sales</Link>
            <Link to={'/aldi'}>ALDI Sales</Link>
        </div>
    )
};

export default Navbar;