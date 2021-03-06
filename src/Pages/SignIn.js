import React, { useState, useEffect } from 'react';
import { Link, withRouter } from "react-router-dom";
import googleLogo from "../Images/googleLogo.png";
import facebookLogo from "../Images/facebookLogo.png";
import githubLogo from "../Images/githubLogo.png";
import { provider, auth, fbprovider, db, gitprovider } from "../Firebase/firebase";
import PulseLoader from "react-spinners/PulseLoader";
import Navbar from "../Components/Navbar";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import "./SignIn.css";

const SignIn = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordEye, setPasswordEye] = useState("password");
    const [loading, setLoading] = useState(false);
    const [loadingScreen , setLoadingScreen] = useState("none");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");
    const [menu, setMenu] = useState("none");
    const [translate, setTranslate] = useState("");

    const signInWithGoogle = () => {
        auth.signInWithPopup(provider).then(payload => {
            db.collection("users").doc(payload.user.email).get().then((doc) => {
                if(doc.exists) {
                    props.history.push("/");
                    props.setUser(doc.data());
                } else {
                    db.collection("users").doc(payload.user.email).set({
                        displayName: payload.user.displayName,
                        email: payload.user.email,
                        dob: "",
                        hobbies: [],
                        articleCategories: [],
                        photoURL: "",
                        color: "#FFD951",
                        doc: new Date(),
                        password: "",
                        googlePhoto: payload.user.photoURL
                    })
                    .then(() => {
                        //Creating articledata collection when a user signs in
                        db.collection("articleData").doc(payload.user.email).set({
                            data: []
                        })
                        .then(() => {
                            db.collection("users").doc(payload.user.email).get().then((doc) => {
                                props.setUser(doc.data());
                                props.history.push("/");
                            })
                            .catch((error) => {
                                setMessage("Error while Sign In");
                                setOpenSnackbar(true);
                            });
                        })
                        .catch((error) => {
                            setMessage("Error while Sign In");
                            setOpenSnackbar(true);
                        });
                    })
                    .catch((error) => {
                        setMessage("Error while Sign In");
                        setOpenSnackbar(true);
                    });
                }
            })
        })
        .catch(error => {
            setMessage(error.message);
            setOpenSnackbar(true);
        })
    }

    const signInWithGit = () => {
        auth.signInWithPopup(gitprovider).then((result) => {
            db.collection("users").doc(result.user.email).get().then((doc) => {
                if(doc.exists) {
                    props.history.push("/");
                    props.setUser(doc.data());
                } else {
                    db.collection("users").doc(result.user.email).set({
                        displayName: result.additionalUserInfo.username,
                        email: result.user.email,
                        dob: "",
                        hobbies: [],
                        articleCategories: [],
                        photoURL: "",
                        color: "#FFD951",
                        doc: new Date(),
                        password: "",
                        googlePhoto: result.user.photoURL
                    })
                    .then(() => {
                         //Creating articledata collection when a user signs in
                        db.collection("articleData").doc(result.user.email).set({
                            data: []
                        })
                        .then(() => {
                            db.collection("users").doc(result.user.email).get().then((doc) => {
                                props.setUser(doc.data());
                                props.history.push("/");
                            })
                            .catch((error) => {
                                setMessage("Error while Sign In");
                                setOpenSnackbar(true);
                            });
                        })
                        .catch((error) => {
                            setMessage("Error while creating article data");
                            setOpenSnackbar(true);
                        });
                    })
                    .catch((error) => {
                        setMessage("Error while Sign In");
                        setOpenSnackbar(true);
                    });
                }
            })
          }).catch((error) => {
            // Handle Errors here.
            setMessage(error.message);
            setOpenSnackbar(true);
          });
    }

    const onSignIn = () => {
        if(email === "") {
            setError("email");
        } else if(!email.includes("@") || !email.includes(".com")) {
            setMessage("Email is invalid");
            setOpenSnackbar(true);
            setError("email");
            setEmail("");
        } else if(password === "") {
            setError("password");
        } else if(password.length < 6) {
            setMessage("Password must be 6 characters long");
            setOpenSnackbar(true);
            setPassword("");
            setError("password");
        } else {
            setLoading(true);
            setLoadingScreen("flex");

            db.collection("users").doc(email).get().then((doc) => {
                if (doc.exists) {
                    if(doc.data().password === password) {
                        // document.cookie = `email=${email}`;
                        // document.cookie = `pass=${password}`;
                        sessionStorage.setItem("email", email);
                        sessionStorage.setItem("password", password);
                        
                        setOpenSnackbar(true);
                        setMessage("Welcome Back!!");
                        props.setUser(doc.data());
                        setTimeout(() => {
                            props.history.push("/");
                        }, 1500);
                        setLoadingScreen("none");
                        setLoading(false);
                        setEmail("");
                        setPassword("");
                    } else {
                        setMessage("Incorrect Password. Please try again.");
                        setOpenSnackbar(true);
                        setLoadingScreen("none");
                        setLoading(false);
                        setEmail("");
                        setPassword("");
                    }
                } else {
                    // doc.data() will be undefined in this case
                    setMessage("Email not found. Please Register.");
                    setOpenSnackbar(true);
                    setLoadingScreen("none");
                    setLoading(false);
                    setEmail("");
                    setPassword("");
                }
            }).catch((error) => {
                // console.log("Error getting document:", error);
                setMessage("An Error occurred. Please try again after some time.");
                setOpenSnackbar(true);
                setLoadingScreen("none");
                setLoading(false);
                setEmail("");
                setPassword("");
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

    return <div className="signin-container">
        <Navbar handleMenu={handleMenu} setUser={props.setUser} user={props.user} />
        <div className="signin-card">
            <p className="signin-header">Welcome Back!</p>
            <div className="signin-items-div">
                <p className="signin-item-name">Email</p>
                <input style={error === "email" ? {border: "2px solid red", borderRadius: 5} : {border: "none"}} onChange={(event) => setEmail(event.target.value)} value={email} type="email" className="signin-item-input" />
            </div>
            <div className="signin-items-div">
                <p className="signin-item-name">Password</p>
                <div style={error === "password" ? {border: "2px solid red", borderRadius: 5} : {border: "none", borderRadius: 0}} className="register-input-div">
                    <input style={{padding: 0}} onChange={(event) => setPassword(event.target.value)} value={password} type={passwordEye} className="signin-item-input" />
                    {passwordEye === "password" ? <img onClick={() => setPasswordEye("text")} className="password-eye-close" src="https://img.icons8.com/fluent-systems-regular/20/000000/visible.png"/> : <img onClick={() => setPasswordEye("password")} className="password-eye-open" src="https://img.icons8.com/fluent-systems-filled/20/000000/visible.png"/>}
                </div>
            </div>
            <Link to="/user/forgotpassword" className="forgot-password">Forgot Password?</Link>
            <button onClick={onSignIn} style={{marginBottom: 20}} className="signin-btn" type="button">Continue</button>
            <p style={{marginBottom: 20}}>OR</p>
            <button onClick={signInWithGoogle} className="signin-google-btn" type="button">
                <img className="signin-google-logo" src={googleLogo} alt="" />
                <p className="signin-google-text">Sign In with Google</p>
            </button>
            <button onClick={signInWithGit} style={{marginBottom: 30}} className="signin-google-btn" type="button">
                <img className="signin-google-logo" src={githubLogo} alt="" />
                <p className="signin-google-text">Sign In with Github</p>
            </button>
            <p className="signin-member">New to Blog.io? <Link className="signin-register" to="/register">SignUp</Link></p>
        </div>
        <div style={{display: loadingScreen}} className="loading-screen">
            <div style={{zIndex: 200, backgroundColor: "transparent"}}>
                {/* <ClipLoader color="black" loading={true} size={50} /> */}
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

export default withRouter(SignIn);