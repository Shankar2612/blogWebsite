import React, { Component } from 'react';
import "./Footer.css";

const Footer = (props) => {
    return <div style={{backgroundColor: props.userColor}} className="footer">
        <p className="footer-text">Designed with ♥ by <span style={{fontFamily: "'Sacramento', cursive", fontSize: 22}}>Shankar</span></p>
    </div>
}

export default Footer;