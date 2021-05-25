import React, { useEffect, useState } from 'react';
import writeBgImage from "../Images/writeBgImage.png";
import TextEditor from "../Components/TextEditor"; 
import { EditorState, convertToRaw } from "draft-js";
import { db, storage } from "../Firebase/firebase";
import "./Write.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import firebase from "firebase";

class Write extends React.Component {
    constructor(){
        super();
        this.state={
            editorState: EditorState.createEmpty(),
            returnedData: "",
            file: null
        }
    }

    componentDidMount(){
        // const textArea = document.getElementById("textarea");

        db.collection("articleData").doc(this.props.user.email).get().then((doc) => {
            if (doc.exists) {
                console.log(doc.data());
                this.setState({returnedData: doc.data().data});
                // textArea.innerHTML += this.state.returnedData;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    moveToSecondPage = () => {
        window.scrollTo(0,652);
    }

    onSubmitFile = () => {
        if(convertToRaw(this.state.editorState.getCurrentContent()).blocks[0].text === "") {
            alert("Please write something before publishing");
        } else if(this.state.file === null) {
            alert("Please give a cover photo before publishing");
        } 
        else {
            //uploading the image to cloud storage
            const metadata = {
                contentType: 'image/jpeg'
            };

            const storageRef = storage.ref();

            const uploadTask = storageRef.child(`${this.props.user.email}/articleCoverImages/` + this.state.file.name).put(this.state.file, metadata);

            db.collection("articleData").doc(this.props.user.email).update({
                data: firebase.firestore.FieldValue.arrayUnion({
                    img: "",
                    html: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
                    doc: new Date(),
                    category: ""
                })
            })
            .then(() => {
                alert("Congratulations!! Your blog has been published");
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
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
        this.setState({file: null, editorState: EditorState.createEmpty()});
    }

    render(){
        console.log(convertToRaw(this.state.editorState.getCurrentContent()));
        console.log(this.state.returnedData);
    return <div className="write-container">
        <div className="write-bg-img-container">
            <img className="write-bg-img" src={writeBgImage} alt="" />
            <div className="write-bg-content">
                <p className="write-bg-salutation">Good Morning <span style={{color: "#23C0B7", background: "transparent"}}>Mr. {this.props.user.displayName.split(" ")[0]}</span></p>
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
                            <button className="preview-btn" type="button">Preview</button>
                            <button onClick={this.onSubmitFile} className="preview-btn" type="button">Publish</button>
                            <button onClick={this.onResetData} className="preview-btn" type="button">Reset</button>
                        </div>
                        {/* <button onClick={this.onSaveFile} type="button">Save</button>
                        <p id="textarea"></p> */}
                    </div>
                </div>
                <div className="button-div"></div>
            </div>
        </div>
    </div>    
    }
    
}

export default Write;