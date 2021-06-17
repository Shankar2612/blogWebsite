import React, { useState, useEffect } from 'react';
import { db, storage} from "../Firebase/firebase";
import { withRouter } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./UserWrite.css";

class UserWrite extends React.Component {
    constructor() {
        super();
        this.state={
            articles: {},
            date: null,
            html: "",
            screenWidth: null
        }
    }

    componentDidMount() {
        this.setState({screenWidth: window.innerWidth});

        const textArea = document.getElementById("textarea");
        
        if(this.props.location.state === undefined) {
            this.props.history.push("/");
        } else {
            db.collection("articleData").doc(this.props.location.state.email).get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data().data);
                    doc.data().data.map(eachData => {
                        if(eachData.title === this.props.match.params.article) {
                            this.setState({articles: eachData, date: new Date(eachData.doc.seconds * 1000), html: eachData.html});
                            textArea.innerHTML = this.state.html;
                            const blockquote = document.getElementsByTagName("blockquote");
                            const textarea = document.getElementById("textarea");
                            if(blockquote.length !== 0) {
                                blockquote.style.backgroundColor = this.props.userColor;
                            // } else if(textarea.length !== 0) {
                            //     console.log(textarea.childNodes);
                            //     for(let i = 0; i < textarea.childNodes.length; i++) {
                            //         console.log(textarea.childNodes[i]);
                            //         if(textarea.childNodes[i].childNodes.length !== 0) {
                            //             // console.log(textarea.childNodes[i], "it's an image tag!!");
                            //             console.log(textarea.childNodes[i].childNodes[0]);
                            //         }
                            //     }
                            } else if(textarea.length !== 0 & this.state.screenWidth < 550) {
                                textarea.getElementsByTagName("img")[0].style.width = "100%";
                            } else {
                                textarea.getElementsByTagName("img")[0].style.width = "auto";
                                textarea.getElementsByTagName("img")[0].style.height = "auto";
                            }
                            

                        }
                    })
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    this.setState({articles: {}});
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }

        window.addEventListener("resize", () => {
            this.setState({screenWidth: window.innerWidth});

            const textArea = document.getElementById("textarea");
        
            if(this.props.location.state === undefined) {
                this.props.history.push("/");
            } else {
                db.collection("articleData").doc(this.props.location.state.email).get().then((doc) => {
                    if (doc.exists) {
                        console.log("Document data:", doc.data().data);
                        doc.data().data.map(eachData => {
                            if(eachData.title === this.props.match.params.article) {
                                this.setState({articles: eachData, date: new Date(eachData.doc.seconds * 1000), html: eachData.html});
                                textArea.innerHTML = this.state.html;
                                const blockquote = document.getElementsByTagName("blockquote");
                                const textarea = document.getElementById("textarea");
                                if(blockquote.length !== 0) {
                                    blockquote.style.backgroundColor = this.props.userColor;
                                // } else if(textarea.length !== 0) {
                                //     console.log(textarea.childNodes);
                                //     for(let i = 0; i < textarea.childNodes.length; i++) {
                                //         console.log(textarea.childNodes[i]);
                                //         if(textarea.childNodes[i].childNodes.length !== 0) {
                                //             // console.log(textarea.childNodes[i], "it's an image tag!!");
                                //             console.log(textarea.childNodes[i].childNodes[0]);
                                //         }
                                //     }
                                } else if(textarea.length !== 0 & this.state.screenWidth < 550) {
                                    textarea.getElementsByTagName("img")[0].style.width = "100%";
                                } else {
                                    textarea.getElementsByTagName("img")[0].style.width = "auto";
                                    textarea.getElementsByTagName("img")[0].style.height = "auto";
                                }
                                

                            }
                        })
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                        this.setState({articles: {}});
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            }
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

    render(){
    return (<div className="userwrite-container">
        <Navbar setUser={this.props.setUser} user={this.props.user} />
        <img className="cover-photo" src={this.state.articles.img} alt="coverphoto" />
        <p className="title">{this.state.articles.title}</p>
        <div style={{backgroundColor: this.props.userColor}} className="user-div">
            <div className="user-photo-container">
                <img className="user-photo" src={this.props.user.photoURL} alt="photo" />
            </div>
            <div className="user-details-div">
                <p className="user-display-name">{this.props.user.displayName}</p>
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
        <Footer userColor={this.props.userColor} />
    </div>
)}
}

export default withRouter(UserWrite);