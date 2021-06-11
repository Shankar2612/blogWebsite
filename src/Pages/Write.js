import React, { useEffect, useState } from 'react';
import writeBgImage from "../Images/writeBgImage.png";
import TextEditor from "../Components/TextEditor"; 
import { EditorState, convertToRaw } from "draft-js";
import { db, storage } from "../Firebase/firebase";
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
            openSnackbar: false
        }
    }

    componentDidMount(){
        this.setState({loading: true});
        setTimeout(() => {
            db.collection("articleData").doc(this.props.user.email).get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data().data);
                    this.setState({articles: doc.data().data, loading: false});
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    this.setState({articles: [], loading: false});
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }, 1500);
    }

    moveToSecondPage = () => {
        window.scrollTo(0,652);
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
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                    }
                }, 
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        this.setState({openSnackbar: true, message: "Error while ulpoading cover image"});
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                    }
                }, 
                () => {
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
                            console.error("Error while publishing: ", error);
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
        console.log(event.target.files[0]);
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
        this.setState({backgroundDisplay: "block"})
        const textArea = document.getElementById("textarea");
        textArea.innerHTML = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    }

    closePreview = () => {
        this.setState({backgroundDisplay: "none"})
    }

    handleCloseSnackbar = () => {
        this.setState({message: "", openSnackbar: false});
    }

    render(){
        console.log(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())));
        console.log(this.state.file);
        // console.log(this.state.category);
    return <div className="write-container">
        <Navbar setUser={this.props.setUser} user={this.props.user} />
        <div className="write-bg-img-container">
            <img className="write-bg-img" src={writeBgImage} alt="" />
            <div className="write-bg-content">
                <p className="write-bg-salutation">{this.props.time === null ? null : this.props.time >= 0 & this.props.time < 12 ? "Good Morning" : this.props.time >= 12 & this.props.time < 16 ? "Good Afternoon" : "Good Evening"}
                <span style={{color: "#23C0B7", background: "transparent"}}> Mr. {this.props.user.displayName.split(" ")[0]}</span></p>
                <p className="write-bg-welcome">Welcome to Blog.io</p>
                <p style={{marginBottom: 30}} className="write-bg-welcome">Write down your thoughts and ideas to spread knowledge.</p>
            </div>
            <div className="write-quote-div">
                <p className="write-bg-quote">“Know the worth of your Knowledge”</p>
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
                ? <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}><PulseLoader color={this.props.userColor} loading={this.state.loading} size={12} margin={2} /></div> 
                : this.state.articles === 0 
                    ? <p style={{color: this.props.userColor}} className="no-articles-text">You don't have any Articles yet. Please start writing.</p> 
                    : <div className="work-grid">
                    {this.state.articles.map(article => {
                        return <WriteArticleCard email={this.props.user.email} html={article.html} doc={article.doc} name={this.props.user.displayName} category={article.category} img={article.img} title={article.title} color={this.props.userColor} />
                    })}
                </div>}
            </div>
        </div>
        <div style={{display: this.state.backgroundDisplay}} className="backgroundDisplay"></div>
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
        <Footer userColor={this.props.userColor} />
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

export default Write;