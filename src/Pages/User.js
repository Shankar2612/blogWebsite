import React, { useState, useEffect } from 'react';
import userbgImage from "../Images/userbgImage.png";
import dropdownIcon from "../Images/dropdownIcon.png";
import { db } from "../Firebase/firebase";
import firebase from "firebase";
import "./User.css";

const User = (props) => {

    const [displayColorDropdown, setDisplayColorDropdown] = useState("none");
    const [displayHobbyDiv, setDisplayHobbyDiv] = useState("none");
    const [username, setUsername] = useState(props.user.displayName);
    const [nameEditBtn, setNameEditBtn] = useState("none");
    const [hobbies, setHobbies] = useState(props.user.hobbies);
    const [hobby, setHobby] = useState("");
    const [remainingHobbyDiv, setRemainingHobbyDiv] = useState("none");
    const [articleData, setArticleData] = useState([]);
    const [articleDiv, setArticleDiv] = useState("none");

    useEffect(() => {
        db.collection("articleData").doc(props.user.email).get().then((doc) => {
            if (doc.exists) {
                setArticleData(doc.data().data);
            } else {
                // doc.data() will be undefined in this case
                setArticleData([]);
            }
        }).catch((error) => {
            console.log("Error getting article:", error);
        });
    }, [])

    const onOpenColorDropdown = () => {
        if(displayColorDropdown === "none") {
            setDisplayColorDropdown("flex");
        } else {
            setDisplayColorDropdown("none");
        }
    }

    const colorList = ["#FFD951", "#FF1E56", "#58FF68", "#E3C4A8", "#F67E7D"];

    const onSelectColor = (color) => {
        setDisplayColorDropdown("none");
        db.collection("users").doc(props.user.email).update({
            color: color
        })
        .then(() => {
            alert("Color successfully applied!");
            window.location.reload();
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error applying color: ", error);
        });
    }

    const onChangeUsername = (event) => {
        setUsername(event.target.value);
        setNameEditBtn("block");
    }

    const onSubmitChangeName = () => {
        db.collection("users").doc(props.user.email).update({
            name: username
        })
        .then(() => {
            alert("Username successfully changed!");
            window.location.reload();
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error changing username: ", error);
        });
    }

    const displayHobby = () => {
        setHobby("");
        if(displayHobbyDiv === "none") {
            setDisplayHobbyDiv("flex");
        } else {
            setDisplayHobbyDiv("none");
        }
    }

    const handleHobbyChange = () => {
        setHobbies(hobbies.concat(hobby));
        db.collection("users").doc(props.user.email).update({
            hobbies: hobbies.concat(hobby)
        })
        .then(() => {
            alert("Your Hobby has been updated!");
            setDisplayHobbyDiv("none");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating hobby: ", error);
        });
    }

    const removeHobbies = (eachHobby) => {
        db.collection("users").doc(props.user.email).update({
            hobbies: firebase.firestore.FieldValue.arrayRemove(eachHobby)
        })
        .then(() => {
            alert(`Your Hobby ${eachHobby} has been deleted!`);
            window.location.reload();
        })
    }

    const openRemainingHobbyDiv = () => {
        if(remainingHobbyDiv === "none") {
            setRemainingHobbyDiv("flex");
        } else {
            setRemainingHobbyDiv("none");
        }
    }

    const closeHobby = () => {
        setRemainingHobbyDiv("none");
    }

    const openArticles = () => {
        if(articleDiv === "none") {
            setArticleDiv("grid");
        } else {
            setArticleDiv("none");
        }
    }

    return <div className="user-page-div">
        <img src={userbgImage} alt="user-bg-img" />
        <div className="user-page-main-content">
            <div className="change-password-color">
                <button style={{color: props.userColor, border: "2px solid " + props.userColor}} className="change-password-btn" type="button">Change Password</button>
                <button style={{color: "black", border: "2px solid " + props.userColor, background: props.userColor}} className="change-color-btn-div" type="button">
                    <div onClick={onOpenColorDropdown} className="color-text-icon-div">
                        <p className="change-color-text">Change Color</p>
                        <img className="dropdown-icon" src={dropdownIcon} alt="dropdown" />
                    </div>
                    <div style={{display: displayColorDropdown}} className="color-dropdown">
                        <div className="default-div">
                            <div style={{background: props.userColor}} className="box"></div>
                            <p className="">applied</p>
                        </div>
                        <hr className="user-page-line" />
                        <div className="non-default-div">
                            {colorList.map(color => {
                                if(color !== props.userColor) {
                                    return <div onClick={() => onSelectColor(color)} style={{background: color, marginRight: 0}} className="box unselected"></div>
                                }
                            })}
                        </div>
                    </div>
                </button>
            </div>
            <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div className="user-img-details-div">
                    <div className="user-img-div">
                        <div style={{border: "8px solid " +  props.userColor}} className="user-img-bg-box">
                            <img className="user-img" src={props.user.photoURL} alt="profile-img" />
                        </div>
                        <button style={{background: props.userColor}} className="edit-img-btn" type="button">Edit Image</button>
                    </div>
                    <div className="user-details-div">
                        <div className="user-details-grid">
                            <div className="user-types-div">
                                <p style={{color: props.userColor}} className="user-name">Name</p>
                                <p style={{color: props.userColor}} className="user-name">Email</p>
                                <p style={{color: props.userColor}} className="user-name">Age</p>
                                <p style={{color: props.userColor}} className="user-name">DOB</p>
                                <p style={{color: props.userColor}} className="user-name">Hobby</p>
                                <p style={{color: props.userColor}} className="user-name">Articles</p>
                            </div>
                            <div className="user-values-div">
                                <div className="user-name-value-div">
                                    <input onChange={onChangeUsername} type="text" style={{color: "white", fontWeight: 500, marginRight: 10}} className="user-name-input" value={username} />
                                    <button onClick={onSubmitChangeName} className="name-edit-btn" style={{display: nameEditBtn, background: props.userColor}} type="button">Save</button>
                                </div>
                                <div className="user-name-value-div">
                                    <p style={{color: "white", fontWeight: 500, marginBottom: 0}} className="user-name">{props.user.email}</p>
                                </div>
                                <div className="user-name-value-div">
                                    <p style={{color: "white", fontWeight: 500, marginBottom: 0}} className="user-name">"{props.user.dob}</p>
                                </div>
                                <div className="user-name-value-div">
                                    <p style={{color: "white", fontWeight: 500, marginBottom: 0}} className="user-name">"{props.user.dob}</p>
                                </div>
                                <div className="hobbies-div">
                                    {hobbies.map((hobby, index) => {
                                        if(index < 3) {
                                            return <div style={{background: props.user.color}} className="hobbies-text-delete">
                                                    <p className="hobbies-text">{hobby}</p>
                                                    <img onClick={() => removeHobbies(hobby)} className="close-icon" src="https://img.icons8.com/material-outlined/14/000000/multiply--v1.png" alt="close" />
                                                </div>
                                        }
                                    })}
                                    {hobbies.length > 3 ? <p onClick={openRemainingHobbyDiv} className="remaining-hobbies">see All</p> : null}
                                    <div style={{display: displayHobbyDiv, border: "2px solid " + props.user.color }} className="add-hobby-div">
                                        <input onChange={(event) => setHobby(event.target.value)} className="hobby-input-field" type="text" value={hobby} />
                                        <button onClick={handleHobbyChange} style={{background: props.user.color}} className="hobby-save-btn" type="button">Add</button>
                                    </div>
                                    <svg onClick={displayHobby} className="add-more-hobby-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 172 172" style={{fill:props.user.color}}>
                                        <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style={{mixBlendMode: "normal"}}>
                                            <path d="M0,172v-172h172v172z" fill="none"></path>
                                            <g fill= {props.user.color}>
                                                <path d="M86,14.33333c-39.49552,0 -71.66667,32.17115 -71.66667,71.66667c0,39.49552 32.17115,71.66667 71.66667,71.66667c39.49552,0 71.66667,-32.17115 71.66667,-71.66667c0,-39.49552 -32.17115,-71.66667 -71.66667,-71.66667zM86,28.66667c31.74921,0 57.33333,25.58412 57.33333,57.33333c0,31.74921 -25.58412,57.33333 -57.33333,57.33333c-31.74921,0 -57.33333,-25.58412 -57.33333,-57.33333c0,-31.74921 25.58412,-57.33333 57.33333,-57.33333zM78.83333,50.16667v28.66667h-28.66667v14.33333h28.66667v28.66667h14.33333v-28.66667h28.66667v-14.33333h-28.66667v-28.66667z"></path>
                                            </g>
                                        </g>
                                    </svg>
                                    <div style={{display: remainingHobbyDiv}} className="remaining-hobby-box">
                                        <img onClick={closeHobby} className="close-icon" src="https://img.icons8.com/material-outlined/16/000000/multiply--v1.png" alt="close" />
                                        {hobbies.map(hobby => {
                                            return <div style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10}}>
                                                <p className="each-hobby">{hobby}</p>
                                                {/* <button className="delete-hobby-btn" type="button">remove</button> */}
                                                <img onClick={() => removeHobbies(hobby)} className="delete-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABmJLR0QA/wD/AP+gvaeTAAABGUlEQVQ4jdWUvU5CQRCFv1ULoIdr46v4CvoQxBcw4Ra2KGAD70DstbA22vgTnkJjozW0x8JdsuDseoFQMMk0Myff7p7dHdi1cLmmoABOgGPgyJc/gCfg1sHXSqsJ6oK+YCZQImeCnqBWFXooeMsAl/PVnywLrXlhVWjIiaCRA/fXgIa8TEELw9N7wdCADH0vrk0FTQt8ZgBGvteJah1fGxn6tgW+SRwxgEpBaSwU59gCP2b8u4h05xndQ9DtLbI3jjnjICp+JsSlg+tgg4OBYB8YGNq/jG1eXmsrz83Dext8kG7CyvmXflkDOhHUk2APL1aEPwtaWejSzq+8byngVNBVYmz+N+ibwCmLg/6d30F/5+C70k53In4A6D2ebmL0hxoAAAAASUVORK5CYII=" />
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className="user-name-value-div">
                                    <p style={{color: "white", fontWeight: 500, marginBottom: 0, marginRight: 15}} className="user-name">{articleData.length}</p>
                                    <p onClick={openArticles} className="view-all-articles">view All</p>
                                </div>
                            </div>
                        </div>
                        <div style={{display: articleDiv}} className="article-showcase-div">
                            {articleData.map(article => {
                                return <div className="article-div">
                                    <img className="cover-photo" src={article.img} alt="coverphoto" />
                                    <p className="article-title-showcase">{article.title}</p>
                                    <div className="article-showcase-btn-div">
                                        <button style={{border: "2px solid " + props.user.color, color: props.user.color, marginRight: 15}} className="article-showcase-read" type="button">Read</button>
                                        <button style={{border: "2px solid " + props.user.color, color: props.user.color}} className="article-showcase-read" type="button">Delete</button>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default User;