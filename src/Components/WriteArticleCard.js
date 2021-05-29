import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import firebase from "firebase";
import { db } from "../Firebase/firebase";
import "./WriteArticleCard.css";

const WriteArticleCard = (props) => {

    const onDeleteArticle = () => {
        db.collection("articleData").doc(props.email).update({
            data: firebase.firestore.FieldValue.arrayRemove({
                img: props.img,
                html: props.html,
                doc: props.doc,
                category: props.category,
                title: props.title
            })
        })
        .then(() => {
            alert(`Your article ${props.title} has been removed`);
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error while removing: ", error);
        });
    }

    return <div className="article-grid-item">
        <div className="img-container">
            <img className="article-img" src={props.img} alt="coverphoto" />
        </div>
        <p className="article-title">{props.title}</p>
        <div className="article-read-div">
            <Link to={"/" + props.name + "/" + props.title} style={{marginRight: 15}} className="article-read-btn" type="button">Read</Link>
            <button onClick={onDeleteArticle} className="article-read-btn" type="button">Delete</button>
        </div>
    </div>
}

export default WriteArticleCard;