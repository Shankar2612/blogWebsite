import React, { useState, useEffect } from 'react';
import readBackgroundImage from "../Images/readBackgroundImage.png";
import SurveyCard from "../Components/SurveyCard";
import CategoryCard from "../Components/CategoryCard";
import ArticleCard from "../Components/ArticleCard";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PulseLoader from "react-spinners/PulseLoader";
import { db, auth } from '../Firebase/firebase';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Link, withRouter } from "react-router-dom";
import "./Read.css";

class Read extends React.Component {
    constructor(){
        super();
        this.state = {
            survey: [],
            surveyRequired: false,
            categories: [],
            articles: [],
            loading: false,
            message: "",
            openSnackbar: false,
            offset: null,
            menu: "none",
            translate: ""
        }
    }

    componentDidMount() {
        //Getting the offset top position of the categories/survey container
        const container = document.getElementsByClassName("category-container")[0];
        this.setState({offset: container.offsetTop - 60});

        this.setState({loading: true});

        const userData = [];

        //Fetching survey items from the database 
        db.collection("surveyItems").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.setState({survey: this.state.survey.concat(doc.data())});
            });
        });

        //Fetching users data from database
        db.collection("users").doc(this.props.user.email).get().then((doc) => {
            if(doc.data().articleCategories.length === 0) {
                this.setState({surveyRequired: true});
            } else {
                this.setState({surveyRequired: false});
            }
        })

        db.collection("articleData").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // this.setState({articles: this.state.articles.concat(doc.data()), loading: false});
                if(doc.data().data.length === 0) {
                    this.setState({loading: false});
                } else {
                    doc.data().data.map(eachData => {
                        db.collection("users").doc(doc.id).get().then((doc) => {
                            console.log(eachData);
                            this.setState({articles: this.state.articles.concat({
                                email: doc.id,
                                img: eachData.img,
                                title: eachData.title,
                                category: eachData.category,
                                html: eachData.html,
                                googlePhoto: doc.data().googlePhoto,
                                photoURL: doc.data().photoURL,
                                name: doc.data().displayName,
                                doc: eachData.doc
                            })});
                            this.setState({loading: false});
                        })
                    })
                }
            });
        });
    }

    moveToSecondPage = () => {
        window.scrollTo(0,this.state.offset);
    }

    addToCategory = (title) => {
        this.setState({categories: this.state.categories.concat(title)});        
    }

    removeFromCategory = (title) => {
        const index = this.state.categories.indexOf(title);
        const newCategory = this.state.categories.slice(0, index).concat(this.state.categories.slice(index+1, this.state.categories.length));
        console.log(newCategory);
        this.setState({categories: newCategory});
    }

    onSubmitSurvey = () => {
        if(this.state.categories.length === 0) {
            this.setState({openSnackbar: true, message: "Please select at least one Category."});
        } else {
            db.collection("users").doc(this.props.user.email).update({
                articleCategories: this.state.categories
            }).then(() => {
                this.setState({openSnackbar: true, message: `Thanks for taking the Survey.`});
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            })
            .catch((error) => {
                // The document probably doesn't exist.
                this.setState({openSnackbar: true, message: "Error occurred while submitting the survey"});
            });
        }
    }

    handleCloseSnackbar = () => {
        this.setState({openSnackbar: false, message: ""});
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
                console.log(error);
            });
        }
    }

    handleCloseSnackbar = () => {
        this.setState({openSnackbar: false, message: ""});
    }

    render(){
      console.log(this.state.categories);
      return <div className="read-container">
        <Navbar handleMenu={this.handleMenu} setUser={this.props.setUser} user={this.props.user} />
        <div className="read-bg-img-container">
            <img className="read-bg-img" src={readBackgroundImage} alt="read-background-img" />
            <div className="read-bg-content">
                <p className="read-bg-salutation">
                    {this.props.time === null ? null : this.props.time >= 0 & this.props.time < 12 ? "Good Morning" : this.props.time >= 12 & this.props.time < 16 ? "Good Afternoon" : "Good Evening"}
                    <span style={{color: "#23C0B7", background: "transparent"}}> {this.props.user.displayName.split(" ")[0]}</span></p>
                <p className="read-bg-welcome">Welcome to Blog.io</p>
                <p style={{marginBottom: 30}} className="read-bg-welcome">Read an article to learn something new today.</p>
                <p className="read-bg-quote">“Today a reader, tomorrow a leader”</p>
                <p className="read-bg-author">-Margaret Fuller</p>
            </div>
            <div className="read-bg-svg-box" onClick={this.moveToSecondPage}>
                <svg className="read-bg-svg" width="28" height="16" viewBox="0 0 52 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="22.3007" y="25.2114" width="37.062" height="6.35348" rx="3.17674" transform="rotate(-45 22.3007 25.2114)" fill="white"/>
                    <rect x="3.49255" y="-1" width="37.062" height="6.35348" rx="3.17674" transform="rotate(45 3.49255 -1)" fill="white"/>
                </svg>
            </div>
        </div>
        {this.state.surveyRequired 
        ? <div className="survey-container">
            <div className="survey">
                <p className="survey-title">Survey Time!!</p>
                <p className="survey-body">Before start reading, please select the category of topics you would like to read. This will help us serve you better. Thank You!</p>
                <div className="survey-grid-container">
                    {this.state.survey.map(eachSurvey => {
                        return <SurveyCard addToCategory={this.addToCategory} removeFromCategory={this.removeFromCategory} img={eachSurvey.img} title={eachSurvey.title} />
                    })}
                </div>
                <button onClick={this.onSubmitSurvey} className="survey-submit-btn" type="button">Submit Survey</button>
            </div>
        </div>
        : <div className="category-container">
            <div className="category">
                <p className="category-title">Categories</p>
                <p className="category-body">What is your mood to read today? Select the topic that best suits your mood.</p>
                <div className="category-grid-container">
                    {this.state.survey.map(eachSurvey => {
                        return <CategoryCard img={eachSurvey.img} title={eachSurvey.title} />
                    })}
                </div>
            </div>
        </div>}
        <div className="best-writers-section">
            <div className="best-writers">
                <p style={{color: "white"}} className="best-writers-title">Read from our best Writers</p>
                {this.state.loading 
                ? <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}><PulseLoader color={this.props.user.color} loading={this.state.loading} size={12} margin={2} /></div>  
                : this.state.articles.length === 0 
                    ? <p style={{color: this.props.user.color}} className="no-articles-text">There are no articles available now. Be the first one to post an article.</p> 
                    : <div className="best-writers-grid-container">
                    {this.state.articles.map(eachSurvey => {
                        return <ArticleCard email={eachSurvey.email} img={eachSurvey.img} title={eachSurvey.title} googlePhoto={eachSurvey.googlePhoto} photoURL={eachSurvey.photoURL} html={eachSurvey.html} doc={eachSurvey.doc} author={eachSurvey.name} color={this.props.user.color}  />
                    })}
                </div>}
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
        </div>
    </div>  
    }
    
}

export default withRouter(Read);