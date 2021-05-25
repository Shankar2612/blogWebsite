import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./Register.css";

const Register = (props) => {
    return <div className="register-container">
        <div className="register-card">
            <p className="register-header">Join Blog.io</p>
            <div className="register-items-div">
                <p className="register-item-name">Name</p>
                <input type="text" className="register-item-input" />
            </div>
            <div className="register-items-div">
                <p className="register-item-name">Email</p>
                <input type="email" className="register-item-input" />
            </div>
            <div className="register-items-div">
                <p className="register-item-name">DOB</p>
                <input type="date" value="" max="2011-12-31" className="register-item-input" />
            </div>
            <div className="register-items-div">
                <p className="register-item-name">Password</p>
                <input type="password" className="register-item-input" />
            </div>
            <div style={{marginBottom: 30}} className="register-items-div">
                <p className="register-item-name">Confirm Password</p>
                <input type="password" className="register-item-input" />
            </div>
            <button className="register-btn" type="button">Continue</button>
            <p className="register-member">Already a member? <Link className="register-sign-in" to="/signin">SignIn</Link></p>
        </div>
    </div>
}

export default Register;