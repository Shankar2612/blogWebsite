import React, { useState, useEffect } from 'react';
import { Link, withRouter } from "react-router-dom";
import googleLogo from "../Images/googleLogo.png";
import facebookLogo from "../Images/facebookLogo.png";
import { provider, auth, fbprovider, db } from "../Firebase/firebase";
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

    const signInWithGoogle = () => {
        auth.signInWithPopup(provider).then(payload => {
            console.log(payload);
            db.collection("users").doc(payload.user.email).get().then((doc) => {
                if(doc.exists) {
                    props.history.push("/");
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
                            props.history.push("/");
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
        })
    }

    const signInWithFacebook = () => {
        auth.signInWithPopup(fbprovider).then(payload => {
            console.log(payload);
            db.collection("users").doc(payload.user.email).get().then((doc) => {
                if(doc.exists) {
                    props.history.push("/");
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
                            props.history.push("/");
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
        })
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
                console.log("Error getting document:", error);
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

    return <div className="signin-container">
        <Navbar setUser={props.setUser} user={props.user} />
        <div className="signin-card">
            <p className="signin-header">Welcome Back!</p>
            <div className="signin-items-div">
                <p className="signin-item-name">Email</p>
                <input style={error === "email" ? {border: "2px solid red", borderRadius: 5} : {border: "none"}} onChange={(event) => setEmail(event.target.value)} value={email} type="email" className="signin-item-input" />
            </div>
            <div style={{marginBottom: 30}} className="signin-items-div">
                <p className="signin-item-name">Password</p>
                <div style={error === "password" ? {border: "2px solid red", borderRadius: 5} : {border: "none", borderRadius: 0}} className="register-input-div">
                    <input style={{padding: 0}} onChange={(event) => setPassword(event.target.value)} value={password} type={passwordEye} className="signin-item-input" />
                    {passwordEye === "password" ? <img onClick={() => setPasswordEye("text")} className="password-eye-close" src="https://img.icons8.com/fluent-systems-regular/20/000000/visible.png"/> : <img onClick={() => setPasswordEye("password")} className="password-eye-open" src="https://img.icons8.com/fluent-systems-filled/20/000000/visible.png"/>}
                </div>
            </div>
            <button onClick={onSignIn} style={{marginBottom: 20}} className="signin-btn" type="button">Continue</button>
            <p style={{marginBottom: 20}}>OR</p>
            <button onClick={signInWithGoogle} className="signin-google-btn" type="button">
                <img className="signin-google-logo" src={googleLogo} alt="" />
                <p className="signin-google-text">Sign In with Google</p>
            </button>
            <button onClick={signInWithFacebook} style={{marginBottom: 30}} className="signin-google-btn" type="button">
                <img className="signin-google-logo" src={facebookLogo} alt="" />
                <p className="signin-google-text">Sign In with Facebook</p>
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
    </div>
}

export default withRouter(SignIn);