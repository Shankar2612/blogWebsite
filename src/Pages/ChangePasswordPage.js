import React, { Component } from 'react';
import PulseLoader from "react-spinners/PulseLoader";
import { db } from "../Firebase/firebase";
import { withRouter } from "react-router-dom";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import "./ChangePasswordPage.css";

class ChangePasswordPage extends React.Component {
    constructor() {
        super();
        this.state={
            newPassword: "",
            confirmNewPassword: "",
            loading: false,
            newPasswordVisibility: "invisible",
            confirmPasswordVisibility: "invisible",
            newPasswordType: "password",
            confirmPasswordType: "password",
            message: "",
            openSnackbar: false,
        }
    }

    componentDidMount() {
        localStorage.removeItem("otp");
    }

    handleNewPasswordChange = (event) => {
        this.setState({newPassword: event.target.value});
    }

    handleConfirmNewPasswordChange = (event) => {
        this.setState({confirmNewPassword: event.target.value});
    }

    onChangeNewPasswordVisibility = () => {
        if(this.state.newPasswordVisibility === "visible") {
            this.setState({newPasswordVisibility: "invisible", newPasswordType: "password"});
        } else {
            this.setState({newPasswordVisibility: "visible", newPasswordType: "text"});
        }
    }

    onChangeConfirmPasswordVisibility = () => {
        if(this.state.confirmPasswordVisibility === "visible") {
            this.setState({confirmPasswordVisibility: "invisible", confirmPasswordType: "password"});
        } else {
            this.setState({confirmPasswordVisibility: "visible", confirmPasswordType: "text"});
        }
    }

    handleChangePassword = () => {
        if(this.state.newPassword === "") {
            this.setState({message: "Please Enter your New Password.", openSnackbar: true});
        } else if(this.state.confirmNewPassword === "") {
            this.setState({message: "Please Enter the Confirm Password.", openSnackbar: true});
        } else if(this.state.newPassword.length > 10) {
            this.setState({newPassword: "", confirmNewPassword: "", message: "The Password should be less than 10 characters.", openSnackbar: true});
        } else if(this.state.newPassword.length < 5) {
            this.setState({newPassword: "", confirmNewPassword: "", message: "The Password should not be less than 5 characters.", openSnackbar: true});
        } else if(this.state.newPassword !== this.state.confirmNewPassword) {
            this.setState({newPassword: "", confirmNewPassword: "", message: "Password and Confirm Password does not match.", openSnackbar: true});
        } else {
            //Everything goes well
            this.setState({loading: true});
            db.collection("users").doc(localStorage.getItem("email")).update({
                password: this.state.newPassword
            })
            .then(() => {
                //Password successfully changed
                this.setState({newPassword: "", confirmNewPassword: "", loading: false, message: "Password successfully changed!!", openSnackbar: true});
                localStorage.removeItem("email");
                this.props.history.push("/");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                this.setState({newPassword: "", confirmNewPassword: "", loading: false, message: "An Error Occurred! Please try again later.", openSnackbar: true});
                localStorage.removeItem("email");
                this.props.history.push("/");
            });
        }
    }

    handleCloseSnackbar = () => {
        this.setState({openSnackbar: false, message: ""});
    }

    render() {
        return <div className="change-password-div">
            <div className="change-password-box">
                <p className="new-password">Set a new Password below:</p>
                <p className="note"><span style={{color: "red", fontWeight: 500}}>Note:</span> Please do not Refresh the Page.</p>
                <p className="new-password-text">New Password</p>
                <div className="new-password-input-icon-div">
                    <input onChange={this.handleNewPasswordChange} value={this.state.newPassword} type={this.state.newPasswordType} className="new-password-input"/>
                    {this.state.newPasswordVisibility === "visible" ? <img className="invisible" onClick={this.onChangeNewPasswordVisibility} src="https://img.icons8.com/fluent-systems-filled/22/000000/visible.png"/> : <img onClick={this.onChangeNewPasswordVisibility} className="invisible" src="https://img.icons8.com/fluent-systems-regular/22/000000/visible.png"/>}
                </div>
                <p className="new-password-text">Confirm New Password</p>
                <div className="new-password-input-icon-div">
                    <input onChange={this.handleConfirmNewPasswordChange} value={this.state.confirmNewPassword} type={this.state.confirmPasswordType} className="new-password-input"/>
                    {this.state.confirmPasswordVisibility === "visible" ? <img className="invisible" onClick={this.onChangeConfirmPasswordVisibility} src="https://img.icons8.com/fluent-systems-filled/22/000000/visible.png"/> : <img onClick={this.onChangeConfirmPasswordVisibility} className="invisible" src="https://img.icons8.com/fluent-systems-regular/22/000000/visible.png"/>}
                </div>
                <div className="change-password-btn-loader">
                    {this.state.loading ? <PulseLoader color="black" loading={this.state.loading} size={12} margin={2} /> : <button onClick={this.handleChangePassword} className="change-btn" type="button">Change</button>}
                </div>
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

export default withRouter(ChangePasswordPage);