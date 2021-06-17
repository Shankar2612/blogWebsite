import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import firebase from "firebase";
import { db, storage } from "../Firebase/firebase";
import ClipLoader from "react-spinners/ClipLoader";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import "./WriteArticleCard.css";

const WriteArticleCard = (props) => {
    const [editBackground, setEditBackground] = useState("transparent");
    const [deleteBackground, setDeleteBackground] = useState("transparent");
    const [editTextColor, setEditTextColor] = useState(props.color);
    const [deleteTextColor, setDeleteTextColor] = useState(props.color);
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");

    const onDeleteArticle = () => {
        setLoading(true);
        const storageRef = storage.ref();

        const imageRef = storageRef.child(`${props.email}/articleCoverImages/` + props.title);
        
        imageRef.delete().then(() => {
            // File deleted successfully
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
                setOpenSnackbar(true);
                setMessage(`Your article ${props.title} has been removed`);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            })
            .catch((error) => {
                console.error("Error while removing: ", error);
            });
        }).catch((error) => {
            // Uh-oh, an error occurred!
            setOpenSnackbar(true);
            setMessage("Error deleting the article");
        });
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setMessage("");
    }

    return <div className="article-grid-item">
        <div className="img-container">
            <img className="article-img" src={props.img} alt="coverphoto" />
        </div>
        <p className="article-title">{props.title}</p>
        <div className="article-read-div">
            <Link to={{pathname: "/" + props.name + "/" + props.title, state: {email: props.email}}} onMouseEnter={() => {setEditBackground(props.color); setEditTextColor("black")}} onMouseLeave={() => {setEditBackground("transparent"); setEditTextColor(props.color)}} style={{marginRight: 15, border: "2px solid " + props.color, color: editTextColor, backgroundColor: editBackground}} className={"article-read-btn"} type="button">Read</Link>
            {loading ? <ClipLoader color={props.color} loading={loading} size={22} /> : <button onClick={onDeleteArticle} onMouseEnter={() => {setDeleteBackground(props.color); setDeleteTextColor("black")}} onMouseLeave={() => {setDeleteBackground("transparent"); setDeleteTextColor(props.color)}} style={{border: "2px solid " + props.color, color: deleteTextColor, backgroundColor: deleteBackground}} className={"article-read-btn"} type="button">Delete</button>}
        </div>
        <Snackbar
            anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
            }}
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={message}
            action={
            <React.Fragment>
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </React.Fragment>
            }
        />
    </div>
}

export default WriteArticleCard;