import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import googleLogo from "../Images/googleLogo.png";
import facebookLogo from "../Images/facebookLogo.png";
import { provider, auth, fbprovider, db } from "../Firebase/firebase";
import "./SignIn.css";

const SignIn = (props) => {

    const signInWithGoogle = () => {
        auth.signInWithPopup(provider).then(payload => {
            console.log(payload);
            db.collection("users").doc(payload.user.email).get().then((doc) => {
                if(doc.exists) {
                    props.history.push("/");
                } else {
                    db.collection("users").doc(payload.user.email).set({
                        name: payload.user.displayName,
                        email: payload.user.email,
                        dob: "",
                        age: null,
                        hobbies: [],
                        about: "",
                        articles: null,
                        img: payload.user.photoURL,
                        color: "#FFD951",
                        doc: new Date(),
                        password: ""
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
                            alert("Error while creating article data");
                        });
                    })
                    .catch((error) => {
                        alert("Error while Sign In");
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
                        name: payload.user.displayName,
                        email: payload.user.email,
                        dob: "",
                        age: null,
                        hobbies: [],
                        about: "",
                        articles: null,
                        img: payload.user.photoURL,
                        color: "yellow",
                        doc: new Date(),
                        password: ""
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
                            alert("Error while creating article data");
                        });
                    })
                    .catch((error) => {
                        alert("Error while Sign In");
                    });
                }
            })
        })
    }

    return <div className="signin-container">
        <div className="signin-card">
            <p className="signin-header">Welcome Back!</p>
            <div className="signin-items-div">
                <p className="signin-item-name">Email</p>
                <input type="email" className="signin-item-input" />
            </div>
            <div style={{marginBottom: 30}} className="signin-items-div">
                <p className="signin-item-name">Password</p>
                <input type="password" className="signin-item-input" />
            </div>
            <button style={{marginBottom: 20}} className="signin-btn" type="button">Continue</button>
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
    </div>
}

export default withRouter(SignIn);