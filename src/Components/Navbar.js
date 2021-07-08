import React, { useState, useEffect } from 'react';
import { Link, withRouter } from "react-router-dom";
import { auth } from "../Firebase/firebase";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import "./Navbar.css";

const Navbar = (props) => {

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");

    const onSignOut = () => {
        const email = sessionStorage.getItem("email");
        const password = sessionStorage.getItem("password");

        if(email !== null & password !== null) {
            sessionStorage.clear();
            setOpenSnackbar(true);
            setMessage("You are successfully logged out!");
            props.setUser(null);
            setTimeout(() => {
                props.history.push("/");
            }, 1500);
        } else {
            auth.signOut().then(() => {
                setOpenSnackbar(true);
                setMessage("You are successfully logged out!");
                setTimeout(() => {
                    props.history.push("/");
                }, 1500);
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setMessage("");
    }

    return <div className="navbar-container">
        <Link to="/" className="navbar-logo">Blog.io</Link>
        {props.user === null
        ? <div>
            <div className="navbar-signin-start">
                <Link to="/signin" className="navbar-signin">SignIn</Link>
                <Link to="/register" className="navbar-get-started">Get Started</Link>
            </div>
            <img onClick={props.handleMenu} className="navbar-menu-logo" src="https://img.icons8.com/metro/26/000000/menu.png"/>
        </div>
        : <div>
            <div className="navbar-signin-start">
                <Link to={"/" + props.user.displayName + "/write"} className="navbar-signed-items">Write</Link>
                <Link to={"/" + props.user.displayName + "/read"} className="navbar-signed-items">Read</Link>
                <button onClick={onSignOut} type="button" className="navbar-signed-items">Logout</button>
                <Link to={"/" + props.user.displayName} className="navbar-signed-items prof-img-div-navbar">
                    <img className="navbar-profile-img" src={props.user.photoURL === "" ? (props.user.googlePhoto === "" ? "https://i.pinimg.com/originals/e6/38/ca/e638ca8c9bdafc0cbca31b781b279f49.jpg" : props.user.googlePhoto) : props.user.photoURL} alt="profile img" />
                </Link>
            </div>
            <img onClick={props.handleMenu} className="navbar-menu-logo" src="https://img.icons8.com/metro/26/000000/menu.png"/>
        </div>
        }
        <Snackbar
            anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
            }}
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={message}
            action={
            <React.Fragment>
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </React.Fragment>
            }
        />
    </div>
}

export default withRouter(Navbar);