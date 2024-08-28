import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import CSS for styling the header

/**
 * Header component
 * Displays the navigation bar and branding elements.
 */
const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <h1 className="logo">
                    <Link to="/">NFT Generator</Link>
                </h1>
                <nav className="nav">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/generate">Mint NFT</Link></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
