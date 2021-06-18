import React, { useState, useEffect } from 'react';
import homeImage from "../Images/homeImage.png";
import homeBackground from "../Images/homeBackground.jpg";
import read from "../Images/read.png";
import write from "../Images/write.png";
import { Link, withRouter } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { auth } from "../Firebase/firebase";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import "./Home.css";

const Home = (props) => {

    const [menu, setMenu] = useState("none");
    const [translate, setTranslate] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");

    console.log(props.user);

    const handleMenu = () => {
        if(menu === "none") {
            setMenu("block");
            setTranslate("translate");
        } else {
            setMenu("none");
            setTranslate("");
        }
    }

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

    return <div className="home-container">
        <Navbar handleMenu={handleMenu} setUser={props.setUser} user={props.user} />
        {props.user === null
        ? <div className="home">
            <div className="home-content-section">
                <p className="home-content-quote">“Blogging is a conversation, not a code.”</p>
                <p className="home-content-author">-Brian Clark</p>
                <p className="home-content-motivation">Start Reading from all famous writers and contribute to Blog.io to help others learn. </p>
                <Link to="/register" className="home-content-link">Get Started</Link>
            </div>
            {/* <img className="home-img" src={homeImage} alt="" /> */}
            <img className="home-background-img" src={homeBackground} alt="" />
            <div className="home-img-screen"></div>
        </div>
        : <div className="home-second">
            <div className="home-second-read">
                <img className="home-second-read-img" src={read} alt="read" />
                <p className="home-second-read-question">Want to read?</p>
                <Link className="home-second-read-link" to={"/" + props.user.displayName + "/read"}>Start Reading</Link>
            </div>
            <div className="home-second-write">
                <img className="home-second-write-img" src={write} alt="write" />
                <p className="home-second-write-question">Want to write?</p>
                <Link className="home-second-write-link" to={"/" + props.user.displayName + "/write"}>Start Writing</Link>
            </div>
        </div>}
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
        <div style={{display: menu}} className="menu-screen"></div>
        <div className={"menu-div " + translate}>
            <div className="links">
                <img onClick={handleMenu} className="close-icon" src="https://img.icons8.com/ios-glyphs/26/000000/multiply.png"/>
                {props.user === null 
                ? <div style={{display: "flex", flexDirection: "column"}}>
                    <Link style={{padding: 10}} className="sign-in-link sign-in-sidebar" to="/signin">SignIn</Link>
                    <Link style={{padding: 10}} className="sign-in-link sign-in-sidebar" to="/register">Get Started</Link>
                </div> 
                : <div style={{display: "flex", flexDirection: "column"}}>
                    <Link to={"/" + props.user.displayName + "/write"} className="link-container">
                        <img src="https://img.icons8.com/windows/24/000000/writer-male.png"/>
                        <p className="sign-in-link">Write</p>
                    </Link>
                    <Link to={"/" + props.user.displayName + "/read"} className="link-container">
                        <img src="https://img.icons8.com/material/24/000000/read.png"/>
                        <p className="sign-in-link">Read</p>
                    </Link>
                    <Link to={"/" + props.user.displayName} className="link-container">
                        <img src="https://img.icons8.com/material-outlined/24/000000/user-male-circle.png"/>
                        <p className="sign-in-link">Profile</p>
                    </Link>
                    <button className="link-container">
                        <img src="https://img.icons8.com/material-outlined/24/000000/lock-2.png"/>
                        <p className="change-password-btn" type="button">Change Password</p>
                    </button>
                    <button onClick={onSignOut} className="link-container">
                        <img src="https://img.icons8.com/material-outlined/24/000000/export.png"/>
                        <p className="change-password-btn" type="button">Log Out</p>
                    </button>
                </div>}
            </div>
            <div className="social-media-div">
                <img className="social-media-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAABKklEQVQ4jZXUuUoEQRAG4I9BjETMNRE8EBMDMXMFr8AXMBEEH8BY8Ek8MgMjH0AQdV08wNBAQTQRQxevUNCgZ6AdZlr3h4Ke6r9+qrqqhmosYAd3+MztFtuYr4n5hRE08f2HnWK4TqSB9j9ECmtjuiqTlMg7rnCI68j/gqFYKFXOAXoibl/p/qS4WEiIfKA3EunHRAVvjtCdOqGrSGQzwdvKqh4swlN0XkzwGlmebh2+onN3gjdAGLZyquuJoLEK/nuG50RQFUYrfM9daAlzFGMZ48LM7Oa+DQzm/jJahN2p68Z+RL5M8GYzHOG8k9pKaOI4yz9WhTXoFG9Yg0LoQSix3YHIK5bwGAsRHnYKZ/8QOcUkLgpHV4nwgBnhl7IibHeBe9xgT96lGD/qsILQWZplNAAAAABJRU5ErkJggg==" />
                <img className="social-media-icon" src="https://img.icons8.com/android/18/000000/twitter.png"/>
                <img className="social-media-icon" src="https://img.icons8.com/material-rounded/18/000000/instagram-new.png"/>
                <img className="social-media-icon" src="https://img.icons8.com/android/18/000000/linkedin.png"/>
                <img className="social-media-icon" src="https://img.icons8.com/material-outlined/18/000000/github.png"/>
            </div>
        </div>
    </div>
}

export default withRouter(Home);