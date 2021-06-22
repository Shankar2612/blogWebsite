import React, { Component } from 'react';
import PulseLoader from "react-spinners/PulseLoader";
import { db } from "../Firebase/firebase";
import { withRouter, Redirect } from "react-router-dom";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import "./ForgotPasswordPage.css";

class ForgotPasswordPage extends React.Component {
    constructor() {
        super();
        this.state={
            email: "",
            loading: false,
            blackScreen: "none",
            otp: "",
            otpLoading: false,
            message: "",
            openSnackbar: false,
        }
    }

    onInputChange = (event) => {
        this.setState({email: event.target.value});
    }

    sendEmail = () => {
        localStorage.removeItem("otp");
        localStorage.removeItem("email");

        if(this.state.email === "") {
            this.setState({message: "Enter your Email!!", openSnackbar: true});
        } else if(!this.state.email.includes("@gmail.com")) {
            this.setState({email: "",message: "Invalid Email!!", openSnackbar: true});
        } else {
            this.setState({loading: true});

            db.collection("users").doc(this.state.email).get().then((doc) => {
                if (doc.exists) {
                    //The Email exists and we are ready to send an email

                    fetch("http://localhost:8080/email", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            email: this.state.email,
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        this.setState({loading: false, blackScreen: "flex", message: "Email sent!! Please check your mailbox.", openSnackbar: true});
                        localStorage.setItem("otp", data.otp);
                        localStorage.setItem("email", this.state.email);
                        this.setState({email: ""});
                    })
                } else {
                    // doc.data() will be undefined in this case
                    this.setState({loading: false, email: "", message: "Email not found. Please register the user first", openSnackbar: true});
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
                this.setState({loading: false, email: ""});
            });
        }
    }

    onOtpInputChange = (event) => {
        this.setState({otp: event.target.value});
    }

    onSubmitOTP = () => {
        if(this.state.otp === "") {
            this.setState({message: "Please Enter the OTP.", openSnackbar: true});
        } else if(this.state.otp !== localStorage.getItem("otp")) {
            this.setState({otp: "",message: "Invalid OTP! Please Enter the correct OTP.", openSnackbar: true});
        } else {
            //Everything goes correct
            this.setState({otp: "", blackScreen: "none"});
            this.props.history.push("/user/changepassword");
        }
    }

    handleCloseSnackbar = () => {
        this.setState({openSnackbar: false, message: ""});
    }

    render() {
        return <div className="forgot-password-div">
            <div className="forgot-password-box">
                <p className="heading">Forgot Password?</p>
                <p className="not-worry-text">Don't worry!! We are here to help you out. Just type in the email address associated with <span className="highlight">Blog.io</span>.</p>
                <p className="note"><span style={{color: "red", fontWeight: 500}}>Note:</span> Please give your original working email because we will send an OTP to that address.</p>
                <input onChange={this.onInputChange} value={this.state.email} type="email" placeholder="Email" className="forgot-email" />
                {this.state.loading ? <PulseLoader color="black" loading={this.state.loading} size={12} margin={2} /> : <button onClick={this.sendEmail} className="email-send-btn" type="button">Send Email</button>}
            </div>
            <div style={{display: this.state.blackScreen}} className="black-screen"></div>
            <div style={{display: this.state.blackScreen}} className="otp-box">
                <p className="enter-otp-text">Enter the OTP received in mail.</p>
                <input onChange={this.onOtpInputChange} value={this.state.otp} type="text" className="enter-otp-input" />
                {this.state.otpLoading ? <PulseLoader color="black" loading={this.state.loading} size={12} margin={2} /> : <button onClick={this.onSubmitOTP} type="button" className="continue-otp">Continue</button>}
            </div>
            <Snackbar
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
                }}
                open={this.state.openSnackbar}
                autoHideDuration={6000}
                onClose={this.handleCloseSnackbar}
                message={this.state.message}
                action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleCloseSnackbar}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
                }
            />
        </div>
    }
}

export default withRouter(ForgotPasswordPage);

