import React, { useState, useEffect } from 'react';
import homeImage from "../Images/homeImage.png";
import read from "../Images/read.png";
import write from "../Images/write.png";
import { Link } from "react-router-dom";
import { storage } from "../Firebase/firebase";
import "./Home.css";

const Home = (props) => {

    // useEffect(() => {
    //     const reference = storage.ref("SurveyImages/travelSurveyImage.png");

    //     reference.getDownloadURL().then((url) => {
    //         console.log(url);
    //     })
    // })

    return <div className="home-container">
        {props.user === null
        ? <div className="home">
            <div className="home-content-section">
                <p className="home-content-quote">“Blogging is a conversation, not a code.”</p>
                <p className="home-content-author">-Brian Clark</p>
                <p className="home-content-motivation">Start Reading from all famous writers and contribute to Blog.io to help others learn. </p>
                <Link to="/register" className="home-content-link">Get Started</Link>
            </div>
            <img className="home-img" src={homeImage} alt="" />
        </div>
        : <div className="home-second">
            <div className="home-second-read">
                <img className="home-second-read-img" src={read} alt="read" />
                <p className="home-second-read-question">Want to read?</p>
                <Link className="home-second-read-link" to={"/" + props.user.displayName + "/read"}>Start Reading</Link>
            </div>
            <div className="home-second-write">
                <img className="home-second-write-img" src={write} alt="write" />
                <p className="home-second-write-question">Want to write?</p>
                <Link className="home-second-write-link" to={"/" + props.user.displayName + "/write"}>Start Reading</Link>
            </div>
        </div>}
    </div>
}

export default Home;