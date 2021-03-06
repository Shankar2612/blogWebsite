import React, { useEffect, useState } from 'react';
import writeBgImage from "../Images/writeBgImage.png";
import TextEditor from "../Components/TextEditor"; 
import { EditorState, convertToRaw } from "draft-js";
import { db, storage, auth } from "../Firebase/firebase";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import firebase from "firebase";
import WriteArticleCard from "../Components/WriteArticleCard";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PulseLoader from "react-spinners/PulseLoader";
import ClipLoader from "react-spinners/ClipLoader";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Link, withRouter } from "react-router-dom";
import "./Write.css";

class Write extends React.Component {
    constructor(){
        super();
        this.state={
            editorState: EditorState.createEmpty(),
            file: null,
            category: "Select",
            displayCategory: "none",
            title: "",
            backgroundDisplay: "none",
            articles: [],
            loading: false,
            publishLoading: false,
            message: "",
            openSnackbar: false,
            offset: null,
            menu: "none",
            translate: "",
            progress: 0,
            colorBackground: "none"
        }
    }

    componentDidMount(){
        //getting the offset top of the container
        const container = document.getElementsByClassName("write-section")[0];
        this.setState({offset: container.offsetTop - 60});

        this.setState({loading: true});
        setTimeout(() => {
            db.collection("articleData").doc(this.props.user.email).get().then((doc) => {
                if (doc.exists) {
                    this.setState({articles: doc.data().data, loading: false});
                } else {
                    // doc.data() will be undefined in this case
                    this.setState({articles: [], loading: false});
                }
            }).catch((error) => {
                this.setState({openSnackbar: true, message: "An error occurred. Please refresh the page."});
            });
        }, 1500);
    }

    moveToSecondPage = () => {
        window.scrollTo(0,this.state.offset);
    }

    onSubmitFile = () => {
        if(convertToRaw(this.state.editorState.getCurrentContent()).blocks[0].text === "") {
            this.setState({openSnackbar: true, message: "Please write something before publishing"});
        } else if(this.state.file === null) {
            this.setState({openSnackbar: true, message: "Please give a cover photo before publishing"});
        } else if(this.state.category === "Select"){
            this.setState({openSnackbar: true, message: "Please select the category that best suits your article."});
        } else if(this.state.title === "") {
            this.setState({openSnackbar: true, message: "Please give a title to your article"});
        }
        else {
            this.setState({publishLoading: true});
            //uploading the image to cloud storage
            const metadata = {
                contentType: 'image/jpeg'
            };

            const storageRef = storage.ref();

            const uploadTask = storageRef.child(`${this.props.user.email}/articleCoverImages/` + this.state.title).put(this.state.file, metadata);

            uploadTask.on('state_changed', // or 'state_changed'
                (snapshot) => {
                    this.setState({colorBackground: "flex"});
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    this.setState({progress: Math.round(progress)});
                    switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        // console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        // console.log('Upload is running');
                        break;
                    }
                }, 
                (error) => {
                    this.setState({colorBackground: "none"});
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        this.setState({openSnackbar: true, message: "Error while uploading cover image", colorBackground: "none"})
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        this.setState({openSnackbar: true, message: "Error while uploading cover image", colorBackground: "none"});
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        this.setState({openSnackbar: true, message: "Error while uploading cover image", colorBackground: "none"});
                        break;
                    }
                }, 
                () => {
                    this.setState({colorBackground: "none"});
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        db.collection("articleData").doc(this.props.user.email).update({
                            data: firebase.firestore.FieldValue.arrayUnion({
                                img: downloadURL,
                                html: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
                                doc: new Date(),
                                category: this.state.category,
                                title: this.state.title
                            })
                        })
                        .then(() => {
                            this.setState({openSnackbar: true, message: "Congratulations!! Your blog has been published"});
                            this.setState({publishLoading: false});
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        })
                        .catch((error) => {
                            // console.error("Error while publishing: ", error);
                            this.setState({openSnackbar: true, message: "Error occurred while publishing your article."});
                            this.setState({publishLoading: false});
                        });
                    });
                }
            );
        }
    }

    onEditorStateChange = (editorState) => {
        this.setState({editorState});
    }

    onUploadFile = (event) => {
        this.setState({file: event.target.files[0]});
    }

    onResetData = () => {
        this.setState({file: null, editorState: EditorState.createEmpty(), category: "Select", title: ""});
    }

    onOpenCategory = () => {
        if(this.state.displayCategory === "none") {
            this.setState({displayCategory: "flex"});
        } else {
            this.setState({displayCategory: "none"});
        }
    }

    setCategory = (category) => {
        this.setState({category: category, displayCategory: "none"});
    }

    setTitle = (event) => {
        this.setState({title: event.target.value});
    }

    onOpenPreview = () => {
        this.setState({backgroundDisplay: "block"});
        const textArea = document.getElementById("textarea");
        textArea.innerHTML = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
        for(let i = 0; i < textArea.children.length; i++) {
            if(textArea.children[i].tagName === 'IMG') {
                textArea.children[i].style.maxWidth = "100%"
            }
        }
    }

    closePreview = () => {
        this.setState({backgroundDisplay: "none"})
    }

    handleCloseSnackbar = () => {
        this.setState({message: "", openSnackbar: false});
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
                this.setState({openSnackbar: true, message: "Error occurred while logging out. Please try again after some time."});
            });
        }
    }

    render(){
        // console.log(this.state.articles);
        // console.log(this.state.category);
    return <div className="write-container">
        <Navbar handleMenu={this.handleMenu} setUser={this.props.setUser} user={this.props.user} />
        <div className="write-bg-img-container">
            <img className="write-bg-img" src={writeBgImage} alt="" />
            <div className="write-bg-content">
                <p className="write-bg-salutation">{this.props.time === null ? null : this.props.time >= 0 & this.props.time < 12 ? "Good Morning" : this.props.time >= 12 & this.props.time < 16 ? "Good Afternoon" : "Good Evening"}
                <span style={{color: "#23C0B7", background: "transparent"}}> {this.props.user.displayName.split(" ")[0]}</span></p>
                <p className="write-bg-welcome">Welcome to Blog.io</p>
                <p style={{marginBottom: 30}} className="write-bg-welcome">Write down your thoughts and ideas to spread knowledge.</p>
            </div>
            <div className="write-quote-div">
                <p className="write-bg-quote">???Know the worth of your Knowledge???</p>
                <p className="write-bg-author">-Unknown</p>
            </div>
            <div className="write-bg-svg-box" onClick={this.moveToSecondPage}>
                <svg className="write-bg-svg" width="28" height="16" viewBox="0 0 54 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="23.3007" y="26.2109" width="37.062" height="6.35348" rx="3.17674" transform="rotate(-45 23.3007 26.2109)" fill="black"/>
                    <rect x="4.49255" width="37.062" height="6.35348" rx="3.17674" transform="rotate(45 4.49255 0)" fill="black"/>
                </svg>
            </div>
        </div>
        <div className="write-section">
            <div className="write">
                <div className="write-main-grid">
                    <div className="write-main-section">
                        <p className="write-header">Start writing your thoughts & ideas</p>
                        <div className="write-category-select-div">
                            <p className="write-category-select-text">Please select the category of your article.</p>
                            <div className="category-div">
                                <div onClick={this.onOpenCategory} className="category-select-div">
                                    <p className="select">{this.state.category}</p>
                                    <img src="https://img.icons8.com/android/20/000000/sort-down.png" alt="dropdown" />
                                </div>
                                <div style={{display: this.state.displayCategory}} className="select-div">
                                    <p onClick={() => this.setCategory("Art")} className="select-items">Art</p>
                                    <p onClick={() => this.setCategory("Comics")} className="select-items">Comics</p>
                                    <p onClick={() => this.setCategory("Corona")} className="select-items">Corona</p>
                                    <p onClick={() => this.setCategory("Design")} className="select-items">Design</p>
                                    <p onClick={() => this.setCategory("Fitness")} className="select-items">Fitness</p>
                                    <p onClick={() => this.setCategory("Food")} className="select-items">Food</p>
                                    <p onClick={() => this.setCategory("Gaming")} className="select-items">Gaming</p>
                                    <p onClick={() => this.setCategory("Media")} className="select-items">Media</p>
                                    <p onClick={() => this.setCategory("Style")} className="select-items">Style</p>
                                    <p onClick={() => this.setCategory("Travel")} className="select-items">Travel</p>
                                </div>
                            </div>
                        </div>
                        <div className="write-title-div">
                            <p className="write-title-text">Please give a title to your story.</p>
                            <input value={this.state.title} onChange={this.setTitle} className="title-input" type="text" placeholder="Title" />
                        </div>
                        <div className="editorjs-container">
                            <TextEditor onEditorStateChange={this.onEditorStateChange} editorState={this.state.editorState} />
                            <div className="write-img-upload-div">
                                <div className="write-img-div">
                                    {this.state.file !== null ? <img className="write-img" src={URL.createObjectURL(this.state.file)} alt="" /> : null}
                                </div>
                                <label>
                                    <p className="write-img-upload-btn">
                                        <input onChange={this.onUploadFile} style={{display: "none"}} type="file" />
                                        <p>Select Image</p>
                                    </p>
                                </label>
                            </div>
                        </div>
                        <div className="write-btns">
                            {convertToRaw(this.state.editorState.getCurrentContent()).blocks[0].text === "" ? null : <button onClick={this.onOpenPreview} className="preview-btn preview-only" type="button">Preview</button>}
                            {this.state.publishLoading ? <div style={{marginLeft: 20}}><ClipLoader color="black" loading={this.state.publishLoading} size={22} /></div> : <button onClick={this.onSubmitFile} className="preview-btn" type="button">Publish</button>}
                            <button onClick={this.onResetData} className="preview-btn" type="button">Reset</button>
                        </div>
                        {/* <button onClick={this.onSaveFile} type="button">Save</button>
                        <p id="textarea"></p> */}
                    </div>
                </div>
                <div className="button-div"></div>
            </div>
        </div>
        <div className="display-section">
            <div className="display">
                <p className="your-work-header">Your Work</p>
                {this.state.loading 
                ? <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}><PulseLoader color={this.props.user.color} loading={this.state.loading} size={12} margin={2} /></div> 
                : this.state.articles.length === 0 
                    ? <p style={{color: this.props.user.color}} className="no-articles-text">You don't have any Articles yet. Please start writing.</p> 
                    : <div className="work-grid">
                    {this.state.articles.map(article => {
                        return <WriteArticleCard email={this.props.user.email} html={article.html} doc={article.doc} name={this.props.user.displayName} category={article.category} img={article.img} title={article.title} color={this.props.user.color} />
                    })}
                </div>}
            </div>
        </div>
        <div style={{display: this.state.backgroundDisplay, opacity: "20%"}} className="backgroundDisplay"></div>
        <div style={{display: this.state.backgroundDisplay}} className="preview-div">
            <div className="close-btn-div">
                <img className="close-icon" onClick={this.closePreview} src="https://img.icons8.com/metro/24/000000/multiply.png" alt="closebtn" />
            </div>
            {convertToRaw(this.state.editorState.getCurrentContent()).blocks[0].text === "" 
                ? <p id="no-text">Nothing to show.</p> 
                : <div className="textarea-div">
                    {this.state.file !== null ? <img className="cover-photo" src={URL.createObjectURL(this.state.file)} alt="coverphoto" /> : null}
                    {this.state.title !== "" ? <p className="textarea-title">{this.state.title}</p> : null}
                    <hr className="line" />
                    <div className="textarea-main-div">
                        <p id="textarea"></p>
                    </div>
                </div>}
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
        <div style={{display: this.state.colorBackground, backgroundColor: this.props.user.color }} className="color-background">
            <div className="progress-div">
                <p className="progress-percent">{this.state.progress} %</p>
                <p className="progress-msg">Please don't refresh the page</p>
                <p className="progress-msg">We are making your content online. Just sit and relax for a moment...</p>
            </div>
        </div>
    </div>    
    }
    
}

export default withRouter(Write);