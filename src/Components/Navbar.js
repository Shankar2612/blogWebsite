import React, { useState, useEffect } from 'react';
import { Link, withRouter } from "react-router-dom";
import { auth } from "../Firebase/firebase";
import "./Navbar.css";

const Navbar = (props) => {

    const onSignOut = () => {
        auth.signOut().then(() => {
            console.log("user signed out");
            props.history.push("/");
        }).catch((error) => {
            console.log(error);
        });
    }

    return <div className="navbar-container">
        <Link to="/" className="navbar-logo">Blog.io</Link>
        {props.user === null
        ? <div className="navbar-signin-start">
            <Link to="/signin" className="navbar-signin">SignIn</Link>
            <Link to="/register" className="navbar-get-started">Get Started</Link>
        </div>
        : <div className="navbar-signin-start">
            <Link to={"/" + props.user.displayName + "/write"} className="navbar-signed-items">Write</Link>
            <Link to={"/" + props.user.displayName + "/read"} className="navbar-signed-items">Read</Link>
            <button onClick={onSignOut} type="button" className="navbar-signed-items">Logout</button>
            <Link to={"/" + props.user.displayName} className="navbar-signed-items">
                <img className="navbar-profile-img" src={props.user.photoURL} alt="profile img" />
            </Link>
        </div>}
    </div>
}

export default withRouter(Navbar);