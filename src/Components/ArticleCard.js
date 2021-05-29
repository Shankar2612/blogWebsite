import React, { useState, useEffect } from 'react';
import "./ArticleCard.css";

const ArticleCard = (props) => {

    const [color, setColor] = useState(props.color);

    const onColorChangeToBlack = () => {
        setColor("black");
    }

    const onColorChangeToNormal = () => {
        setColor(props.color);
    }

    return <div className="article-grid-item">
        <img className="article-grid-img" src={props.img} alt="" />
        <div className="article-grid-author-div">
            <div className="profile-div">
                <img className="article-profile-img" src={props.authorImg} alt="" />
            </div>
            <p className="article-author-name">{props.author}</p>
            <p className="article-read-time">* {props.time} min read</p>
        </div>
        <p className="article-title">{props.title}</p>
        <p style={{color: props.color}} className="article-body">{props.body}</p>
        <div className="article-read-div">
            <button style={{color: color, border: "2px solid " + color}} onMouseEnter={onColorChangeToBlack} onMouseLeave={onColorChangeToNormal} className="article-read-btn" type="button">Read</button>
        </div>
    </div>
}

export default ArticleCard;