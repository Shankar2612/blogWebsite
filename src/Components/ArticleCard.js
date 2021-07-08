import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./ArticleCard.css";

const ArticleCard = (props) => {

    const [color, setColor] = useState(props.color);
    const [bgColor, setBgColor] = useState("transparent");

    const onColorChangeToBlack = () => {
        setColor("black");
        setBgColor(props.color);
    }

    const onColorChangeToNormal = () => {
        setColor(props.color);
        setBgColor("transparent");
    }

    const getTime = () => {
        const wpm = 150;
        const words = props.html.split(" ");
        const min = words.length/wpm;
        if(min < 1) {
            return (min * 60).toFixed() + " secs read";
        } else {
            return min.toFixed() + " mins read";
        }
    }

    return <div className="article-grid-item">
        <div className="article-grid-img-container">
            <img className="article-grid-img" src={props.img} alt="" />
        </div>
        <div className="article-grid-author-div">
            <div className="profile-div">
                <img className="article-profile-img" src={props.photoURL === "" ? (props.googlePhoto === "" ? "https://i.pinimg.com/originals/e6/38/ca/e638ca8c9bdafc0cbca31b781b279f49.jpg" : props.googlePhoto) : props.photoURL} alt="" />
            </div>
            <p className="article-author-name">{props.author}</p>
            <p className="article-read-time">* {getTime()}</p>
        </div>
        <p className="article-title">{props.title}</p>
        <p style={{color: props.color}} className="article-body">{props.body}</p>
        <div className="article-read-div">
            <Link to={{pathname: "/" + props.author + "/" + props.title, state: {email: props.email, googlePhoto: props.googlePhoto, photoURL: props.photoURL, name: props.author}}} style={{color: color, border: "2px solid " + color, backgroundColor: bgColor}} onMouseEnter={onColorChangeToBlack} onMouseLeave={onColorChangeToNormal} className="article-read-btn" type="button">Read</Link>
        </div>
    </div>
}

export default ArticleCard;