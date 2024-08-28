import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/main.css'; // Import global CSS styles

/**
 * Entry point of the React application
 * Renders the main App component into the root element
 */
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
