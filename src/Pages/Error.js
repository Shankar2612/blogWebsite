import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "./Error.css";

const Error = (props) => {
    return <div className="error">
        <div className="error-img-container">
            <img className="error-img" src="https://img.icons8.com/doodle/96/000000/books.png"/>
        </div>
        <p className="error-title">404 Page Not Found</p>
        <p className="error-text">Still not getting what you are looking for... Let me help you.</p>
        <div className="error-btn-div">
            <Link className="error-btn" to="/">Home</Link>
        </div>
    </div>
}

export default Error;