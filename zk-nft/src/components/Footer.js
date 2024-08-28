import React from 'react';
import './Footer.css'; // Import CSS for styling the footer

/**
 * Footer component
 * Displays copyright information and additional links.
 */
const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p className="footer-text">
                    &copy; {new Date().getFullYear()} NFT Generator. All rights reserved.
                </p>
                <nav className="footer-nav">
                    <ul>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
