import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { db } from "../Firebase/firebase";
import PulseLoader from "react-spinners/PulseLoader";
import Navbar from "../Components/Navbar";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import "./SignIn.css";
import "./Register.css";

const Register = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDOB] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordEye, setPasswordEye] = useState("password");
    const [confirmPasswordEye, setConfirmPasswordEye] = useState("password");
    const [loading, setLoading] = useState(false);
    const [loadingScreen , setLoadingScreen] = useState("none");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");
    const [menu, setMenu] = useState("none");
    const [translate, setTranslate] = useState("");

    const onRegister = () => {
        setError("");
        if(name === "") {
            setError("name");
        } else if(email === "") {
            setError("email");
        } else if(!email.includes("@") || !email.includes(".com")) {
            setMessage("Email is invalid");
            setOpenSnackbar(true);
            setError("email");
            setEmail("");
        } else if(dob === "") {
            setError("dob");
        } else if(password === "") {
            setError("password");
        } else if(confirmPassword === "") {
            setError("confirm password");
        } else if(password !== confirmPassword) {
            setOpenSnackbar(true);
            setMessage("Password and Confirm Password doesn't match");
            setPassword("");
            setConfirmPassword("");
        } else if(password.length < 6) {
            setOpenSnackbar(true);
            setMessage("Password must be 6 characters long");
            setPassword("");
            setConfirmPassword("");
        } else {
            setLoadingScreen("flex");
            setLoading(true);

            db.collection("users").doc(email).get().then((doc) => {
                if (doc.exists) {
                    if(doc.data().password === "") {
                        setOpenSnackbar(true);
                        setMessage("This Email is already registered with us. You can set your password after signing in to your account.");
                        setLoading(false);
                        setLoadingScreen("none");
                        setName("");
                        setEmail("");
                        setDOB("");
                        setPassword("");
                        setConfirmPassword("");
                        setError("");
                    } else {
                        setOpenSnackbar(true);
                        setMessage("This Email is already registered with us. You can Sign In or use a different one.");
                        setLoading(false);
                        setLoadingScreen("none");
                        setName("");
                        setEmail("");
                        setDOB("");
                        setPassword("");
                        setConfirmPassword("");
                        setError("");
                    }
                } else {
                    // doc.data() will be undefined in this case
                    db.collection("users").doc(email).set({
                        displayName: name,
                        email: email,
                        dob: dob,
                        hobbies: [],
                        articleCategories: [],
                        photoURL: "",
                        color: "#FFD951",
                        doc: new Date(),
                        password: password,
                        googlePhoto: ""
                    })
                    .then(() => {
                         //Creating articledata collection when a user signs in
                        db.collection("articleData").doc(email).set({
                            data: []
                        })
                        .then(() => {
                            setOpenSnackbar(true);
                            setMessage("You are successfully registered with us. You can now Sign In!");
                            setName("");
                            setEmail("");
                            setDOB("");
                            setPassword("");
                            setConfirmPassword("");
                            setError("");
                            setLoadingScreen("none");
                            setLoading(false);
                        })
                        .catch((error) => {
                            setOpenSnackbar(true);
                            setMessage("Error occurred while registering user.");
                            setLoadingScreen("none");
                            setLoading(false);
                        });
                    })
                    .catch((error) => {
                        setOpenSnackbar(true);
                        setMessage("Error occurred while registering user.");
                        setLoadingScreen("none");
                            setLoading(false);
                    });
                }
            }).catch((error) => {
                // console.log("Error getting document:", error);
                setOpenSnackbar(true);
                setMessage("Error occurred while registering user.");
                setLoadingScreen("none");
                setLoading(false);
            });
        }
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setMessage("");
    }

    const handleMenu = () => {
        if(menu === "none") {
            setMenu("block");
            setTranslate("translate");
        } else {
            setMenu("none");
            setTranslate("");
        }
    }

    return <div className="register-container">
        <Navbar handleMenu={handleMenu} setUser={props.setUser} user={props.user} />
        <div className="register-card">
            <p className="register-header">Join Blog.io</p>
            <div className="register-items-div">
                <p className="register-item-name">Name</p>
                <input style={error === "name" ? {border: "2px solid red", borderRadius: 5} : {border: "none"}} onChange={(event) => setName(event.target.value)} value={name} type="text" className="register-item-input" />
            </div>
            <div className="register-items-div">
                <p className="register-item-name">Email</p>
                <input style={error === "email" ? {border: "2px solid red", borderRadius: 5} : {border: "none"}} onChange={(event) => setEmail(event.target.value)} value={email} type="email" className="register-item-input" />
            </div>
            <div className="register-items-div">
                <p className="register-item-name">DOB</p>
                <input style={error === "dob" ? {border: "2px solid red", borderRadius: 5} : {border: "none"}} onChange={(event) => setDOB(event.target.value)} value={dob} type="date" min="1940-01-01" max="2019-12-31" className="register-item-input" />
            </div>
            <div className="register-items-div">
                <p className="register-item-name">Password</p>
                <div style={error === "password" ? {border: "2px solid red", borderRadius: 5} : {border: "none", borderRadius: 0}} className="register-input-div">
                    <input style={{padding: 0}} onChange={(event) => setPassword(event.target.value)} value={password} type={passwordEye} className="register-item-input" />
                    {passwordEye === "password" ? <img onClick={() => setPasswordEye("text")} className="password-eye-close" src="https://img.icons8.com/fluent-systems-regular/20/000000/visible.png"/> : <img onClick={() => setPasswordEye("password")} className="password-eye-open" src="https://img.icons8.com/fluent-systems-filled/20/000000/visible.png"/>}
                </div>
            </div>
            <div style={{marginBottom: 30}} className="register-items-div">
                <p className="register-item-name">Confirm Password</p>
                <div style={error === "confirm password" ? {border: "2px solid red", borderRadius: 5} : {border: "none", borderRadius: 0}} className="register-input-div">
                    <input style={{padding: 0}} onChange={(event) => setConfirmPassword(event.target.value)} value={confirmPassword} type={confirmPasswordEye} className="register-item-input" />
                    {confirmPasswordEye === "password" ? <img onClick={() => setConfirmPasswordEye("text")} className="password-eye-close" src="https://img.icons8.com/fluent-systems-regular/20/000000/visible.png"/> : <img onClick={() => setConfirmPasswordEye("password")} className="password-eye-open" src="https://img.icons8.com/fluent-systems-filled/20/000000/visible.png"/>}
                </div>
            </div>
            <button onClick={onRegister} className="register-btn" type="button">Continue</button>
            <p className="register-member">Already a member? <Link className="register-sign-in" to="/signin">SignIn</Link></p>
            <p className="imp-note-register">Note: <span style={{color: "black", fontWeight: 400, fontSize: 13}}>If you have signed in using Google or Github, then there is by default no password set up initially. 
            So you have to Sign In using the Authentication provider (Google or Github) you used before and go to the Profile section to change/set your password.{" "} 
            <span style={{fontWeight: 700}}>Or</span> you can request for a Forgot Password in the Sign In page.</span></p>
        </div>
        <div style={{display: loadingScreen}} className="loading-screen">
            <div style={{zIndex: 200, backgroundColor: "transparent"}}>
                <PulseLoader color="black" loading={loading} size={15} margin={2} />
            </div>
        </div>
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
                    <button className="link-container">
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

export default Register;