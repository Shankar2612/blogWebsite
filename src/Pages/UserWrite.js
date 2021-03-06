import React from 'react';
import { db, storage, auth } from "../Firebase/firebase";
import { withRouter, Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Error from "./Error";
import "./UserWrite.css";

class UserWrite extends React.Component {
    constructor() {
        super();
        this.state={
            articles: {},
            date: null,
            html: "",
            screenWidth: null,
            menu: "none",
            translate: "",
            openSnackbar: false,
            message: "",
            foundFlag: true,
            googlePhoto: "",
            photoURL: "",
            displayName: ""
        }
    }   
    
    setHtml = (textArea) => {
        textArea.innerHTML = this.state.html;
        const blockquote = document.getElementsByTagName("blockquote");
        // const textarea = document.getElementById("textarea");
        if(blockquote.length !== 0) {
            blockquote.style.backgroundColor = this.props.user.color;
        } else if(textArea.length !== 0) {
            for(let i = 0; i < textArea.children.length; i++) {
                if(textArea.children[i].tagName === "IMG") {
                    textArea.children[i].style.maxWidth = "100%";
                    textArea.children[i].style.width = "auto";
                }
            }
        }
    }

    componentDidMount() {
        this.setState({screenWidth: window.innerWidth});
        
        db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((docs) => {
                // doc.data() is never undefined for query doc snapshots
                if(docs.data().displayName === this.props.match.params.id & this.state.foundFlag) {
                    db.collection("articleData").doc(docs.data().email).get().then((doc) => {
                        if (doc.exists) {
                            // console.log("Document data:", doc.data().data);
                            doc.data().data.map(eachData => {
                                if(eachData.title === this.props.match.params.article) {
                                    const textArea = document.getElementById("textarea");
                                    this.setState({googlePhoto: docs.data().googlePhoto, photoURL: docs.data().photoURL, displayName: docs.data().displayName});
                                    // this.setState({foundFlag: true});
                                    this.setState({articles: eachData, date: new Date(eachData.doc.seconds * 1000), html: eachData.html});
                                    // console.log(textArea);
                                    textArea.innerHTML = this.state.html;
                                    const blockquote = document.getElementsByTagName("blockquote");
                                    // const textarea = document.getElementById("textarea");
                                    if(blockquote.length !== 0) {
                                        blockquote.style.backgroundColor = this.props.user.color;
                                    } else if(textArea.length !== 0) {
                                        for(let i = 0; i < textArea.children.length; i++) {
                                            if(textArea.children[i].tagName === "IMG") {
                                                textArea.children[i].style.maxWidth = "100%";
                                                textArea.children[i].style.width = "auto";
                                            }
                                        }
                                    }
                                } else {
                                    this.setState({foundFlag: false});
                                }
                            })
                        } else {
                            // doc.data() will be undefined in this case
                            // console.log("No such document!");
                            this.setState({articles: {}});
                        }
                    }).catch((error) => {
                        // console.log("Error getting document:", error);
                        this.setState({openSnackbar: true, message: "An Error occurred while retrieving info from the database. Please refresh the page."});
                    });
                }
            });
        });

        window.addEventListener("resize", () => {
            this.setState({screenWidth: window.innerWidth});

            const textArea = document.getElementById("textarea");
        
            db.collection("cities").get().then((querySnapshot) => {
                querySnapshot.forEach((docs) => {
                    // doc.data() is never undefined for query doc snapshots
                    if(docs.data().displayName === this.props.match.params.id & !this.state.foundFlag) {
                        db.collection("articleData").doc(docs.data().email).get().then((doc) => {
                            if (doc.exists) {
                                // console.log("Document data:", doc.data().data);
                                doc.data().data.map(eachData => {
                                    if(eachData.title === this.props.match.params.article) {
                                        this.setState({foundFlag: true});
                                        this.setState({articles: eachData, date: new Date(eachData.doc.seconds * 1000), html: eachData.html});
                                        textArea.innerHTML = this.state.html;
                                        const blockquote = document.getElementsByTagName("blockquote");
                                        const textarea = document.getElementById("textarea");
                                        if(blockquote.length !== 0) {
                                            blockquote.style.backgroundColor = this.props.user.color;
                                        } else if(textArea.length !== 0) {
                                            for(let i = 0; i < textArea.children.length; i++) {
                                                if(textArea.children[i].tagName === "IMG") {
                                                    textArea.children[i].style.width = "auto";
                                                    textArea.children[i].style.maxWidth = "100%";
                                                }
                                            }
                                        }
            
                                    }
                                })
                            } else {
                                // doc.data() will be undefined in this case
                                // console.log("No such document!");
                                this.setState({articles: {}});
                            }
                        }).catch((error) => {
                            // console.log("Error getting document:", error);
                            this.setState({openSnackbar: true, message: "An Error occurred while retrieving info from the database. Please refresh the page."});
                        });
                    }
                });
            });
        });
    }

    getUsersDate = () => {
        const date = new Date(this.state.date);
        return date.getDate() + "/" + (Number(date.getMonth()) + 1) + "/" + date.getFullYear();
    }

    getReadingTime = () => {
        const wpm = 150;
        const words = this.state.html.split(" ");
        const min = words.length/wpm;
        if(min < 1) {
            return (min * 60).toFixed() + " secs read";
        } else {
            return min.toFixed() + " mins read";
        }
    }

    handleMenu = () => {
        if(this.state.menu === "none") {
            this.setState({menu: "block", translate: "translate"});
        } else {
            this.setState({menu: "none", translate: ""});
        }
    }

    onSignOut = () => {
        const email = sessionStorage.getItem("email");
        const password = sessionStorage.getItem("password");

        if(email !== null & password !== null) {
            sessionStorage.clear();
            this.setState({openSnackbar: true, message: "You are successfully logged out!"});
            this.props.setUser(null);
            setTimeout(() => {
                this.props.history.push("/");
            }, 1500);
        } else {
            auth.signOut().then(() => {
                this.setState({openSnackbar: true, message: "You are successfully logged out!"});
                setTimeout(() => {
                    this.props.history.push("/");
                }, 1500);
            }).catch((error) => {
                // console.log(error);
                this.setState({openSnackbar: true, message: "Error occurred while logging out."});
            });
        }
    }

    handleCloseSnackbar = () => {
        this.setState({openSnackbar: false, message: ""});
    }

    render(){
        // console.log(this.props.location.state);
        // console.log(this.props);
        // console.log(this.state.foundFlag);
    return (<div className="userwrite-container">
        <Navbar handleMenu={this.handleMenu} setUser={this.props.setUser} user={this.props.user} />
        {this.state.foundFlag 
        ? <div><img className="cover-photo" src={this.state.articles.img} alt="coverphoto" />
        <p className="title">{this.state.articles.title}</p>
        <div style={{backgroundColor: this.props.user.color}} className="user-div">
            <div className="user-photo-container">
                <img className="user-photo" src={this.state.photoURL === "" ? (this.state.googlePhoto === "" ? "https://i.pinimg.com/originals/e6/38/ca/e638ca8c9bdafc0cbca31b781b279f49.jpg" : this.state.googlePhoto) : this.state.photoURL} alt="photo" />
            </div>
            <div className="user-details-div">
                <p className="user-display-name">{this.state.displayName}</p>
                <div className="date-read-time-div">
                    <p className="date">{this.getUsersDate()}</p>
                    <p className="date">{this.getReadingTime()}</p>
                </div>
            </div>
        </div>
        <div className="user-main-content">
            <hr className="user-line" />
            <div className="user-content">
                <p id="textarea"></p>
            </div>
            <div className="ending-div">
                <hr style={{margin: 0, width: "27%", marginRight: 25}} className="user-line" />
                <p className="end-text">The End</p>
                <hr style={{margin: 0, width: "27%", marginLeft: 25}} className="user-line" />
            </div>
        </div>
        <Footer userColor={this.props.user.color} />
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
        <div style={{display: this.state.menu}} className="menu-screen"></div>
        <div className={"menu-div " + this.state.translate}>
            <div className="links">
                <img onClick={this.handleMenu} className="close-icon" src="https://img.icons8.com/ios-glyphs/26/000000/multiply.png"/>
                {this.props.user === null 
                ? <div style={{display: "flex", flexDirection: "column"}}>
                    <Link style={{padding: 10}} className="sign-in-link sign-in-sidebar" to="/signin">SignIn</Link>
                    <Link style={{padding: 10}} className="sign-in-link sign-in-sidebar" to="/register">Get Started</Link>
                </div> 
                : <div style={{display: "flex", flexDirection: "column"}}>
                    <Link to={"/" + this.props.user.displayName + "/write"} className="link-container">
                        <img src="https://img.icons8.com/windows/24/000000/writer-male.png"/>
                        <p className="sign-in-link">Write</p>
                    </Link>
                    <Link to={"/" + this.props.user.displayName + "/read"} className="link-container">
                        <img src="https://img.icons8.com/material/24/000000/read.png"/>
                        <p className="sign-in-link">Read</p>
                    </Link>
                    <Link to={"/" + this.props.user.displayName} className="link-container">
                        <img src="https://img.icons8.com/material-outlined/24/000000/user-male-circle.png"/>
                        <p className="sign-in-link">Profile</p>
                    </Link>
                    <button className="link-container">
                        <img src="https://img.icons8.com/material-outlined/24/000000/lock-2.png"/>
                        <p className="change-password-btn" type="button">Change Password</p>
                    </button>
                    <button onClick={this.onSignOut} className="link-container">
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
        </div></div>
        : <Error />}
    </div>
)}
}

export default withRouter(UserWrite);