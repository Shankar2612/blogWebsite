import React from 'react';
import { withRouter, Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { db, auth } from "../Firebase/firebase";
import ArticleCard from "../Components/ArticleCard";
import PulseLoader from "react-spinners/PulseLoader";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import "./CategoryItem.css";

class CategoryItem extends React.Component {
    constructor() {
        super();
        this.state={
            articles: [],
            loading: false,
            menu: "none",
            translate: "",
            openSnackbar: false,
            message: ""
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        setTimeout(() => {
            db.collection("articleData").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // this.setState({articles: this.state.articles.concat(doc.data()), loading: false});
                    if(doc.data().data.length === 0) {
                        this.setState({loading: false});
                    } else {
                        doc.data().data.map(eachData => {
                            if(eachData.category === this.props.match.params.id) {
                                db.collection("users").doc(doc.id).get().then((doc) => {
                                    this.setState({articles: this.state.articles.concat({
                                        img: eachData.img,
                                        title: eachData.title,
                                        category: eachData.category,
                                        html: eachData.html,
                                        googlePhoto: doc.data().googlePhoto,
                                        photoURL: doc.data().photoURL,
                                        name: doc.data().displayName,
                                        doc: eachData.doc,
                                        email: doc.id
                                    }), loading: false});
                                })
                            } else {
                                this.setState({loading: false});
                            }
                        })
                    }
                });
            });
        }, 1500);
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
    return <div className="category-item-container">
        <Navbar handleMenu={this.handleMenu} setUser={this.props.setUser} user={this.props.user} />
        {this.state.loading 
        ? <div style={{width: "100%", height: "100vh",backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center"}}><PulseLoader color={this.props.user.color} loading={this.state.loading} size={12} margin={2} /></div>
        : this.state.articles.length === 0 
            ? <div className="no-articles-div">
                <img className="no-article-logo" src="https://img.icons8.com/flat-round/128/000000/bookmark-book.png" alt="noarticle-logo" />
                <p className="no-articles-text">There are no articles related to <span style={{color: this.props.user.color, fontWeight: 600}}>{this.props.match.params.id}</span>. Be the first one to write about <span style={{color: this.props.user.color, fontWeight: 600}}>{this.props.match.params.id}</span>.</p>
                <Link style={{color: this.props.user.color, border: "2px solid " + this.props.user.color}} className="start-writing-link" to={"/" + this.props.user.displayName + "/write"}>Start Writing</Link>
            </div>
            : <div className="category-item-div">
            {this.state.articles.map(article => {
                return <ArticleCard email={article.email} img={article.img} title={article.title} googlePhoto={article.googlePhoto} photoURL={article.photoURL} html={article.html} doc={article.doc} author={article.name} color={this.props.user.color}  />
            })}
        </div>}
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

export default withRouter(CategoryItem);