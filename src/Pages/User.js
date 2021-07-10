import React, { useState, useEffect } from 'react';
import userbgImage from "../Images/userbgImage.png";
import dropdownIcon from "../Images/dropdownIcon.png";
import { db, storage, auth } from "../Firebase/firebase";
import firebase from "firebase";
import { Link, withRouter } from "react-router-dom";
import Navbar from "../Components/Navbar";
import PulseLoader from "react-spinners/PulseLoader";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
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
    const [gotitDiv, setGotitDiv] = useState("flex");
    const [changePasswordDiv, setChangePasswordDiv] = useState("none");
    const [error, setError] = useState("");
    const [passwordEye, setPasswordEye] = useState("password");
    const [confirmPasswordEye, setConfirmPasswordEye] = useState("password");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");
    const [screenWidth, setScreenWidth] = useState(null);
    const [menu, setMenu] = useState("none");
    const [translate, setTranslate] = useState("");
    const [progress, setProgress] = useState(0);
    const [colorBackground, setColorBackground] = useState("none");

    useEffect(() => {
        setScreenWidth(window.innerWidth);

        window.addEventListener("resize", () => {
            setScreenWidth(window.innerWidth);
        })

        db.collection("articleData").doc(props.user.email).get().then((doc) => {
            if (doc.exists) {
                setArticleData(doc.data().data);
            } else {
                // doc.data() will be undefined in this case
                setArticleData([]);
            }
        }).catch((error) => {
            // console.log("Error getting article:", error);
            setOpenSnackbar(true);
            setMessage("An Error occurred. Please Refresh the page.");
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
            setOpenSnackbar(true);
            setMessage("Color successfully applied!");
            window.location.reload();
        })
        .catch((error) => {
            // The document probably doesn't exist.
            // console.error("Error applying color: ", error);
            setOpenSnackbar(true);
            setMessage("An Error occurred while changing color.");
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
            setOpenSnackbar(true);
            setMessage("Username successfully changed!");
            window.location.reload();
        })
        .catch((error) => {
            // The document probably doesn't exist.
            // console.error("Error changing username: ", error);
            setOpenSnackbar(true);
            setMessage("An Error occurred while changing username.");
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
            setOpenSnackbar(true);
            setMessage("Your Hobby has been updated!");
            setDisplayHobbyDiv("none");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            // console.error("Error updating hobby: ", error);
            setOpenSnackbar(true);
            setMessage("An Error occurred while updating your hobbies.");
        });
    }

    const removeHobbies = (eachHobby) => {
        db.collection("users").doc(props.user.email).update({
            hobbies: firebase.firestore.FieldValue.arrayRemove(eachHobby)
        })
        .then(() => {
            setOpenSnackbar(true);
            setMessage(`Your Hobby ${eachHobby} has been deleted!`);
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

    const deleteArticle = (img, title, html, doc, category) => {
        db.collection("articleData").doc(props.user.email).update({
            data: firebase.firestore.FieldValue.arrayRemove({
                img: img,
                html: html,
                doc: doc,
                category: category,
                title: title
            })
        })
        .then(() => {
            setOpenSnackbar(true);
            setMessage(`Your article ${title} has been removed`);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        })
        .catch((error) => {
            // console.error("Error while removing: ", error);
            setOpenSnackbar(true);
            setMessage(`An Error occurred while deleting your article.`);
        });
    }

    const closeGotitDiv = () => {
        setGotitDiv("none");
    }

    const onEditProfileImage = (event) => {
        if(props.user.photoURL === "") {
            const storageRef = storage.ref();

            //uploading the image to cloud storage
            const metadata = {
                contentType: 'image/jpeg'
            };

            const uploadTask = storageRef.child(`${props.user.email}/profileImage/image`).put(event.target.files[0], metadata);

            uploadTask.on('state_changed', // or 'state_changed'
                (snapshot) => {
                    setColorBackground("flex");
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(Math.round(progress));
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
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        setOpenSnackbar(true);
                        setMessage("Error while uploading profile image");
                        setColorBackground("none");
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        setOpenSnackbar(true);
                        setMessage("Error while uploading profile image");
                        setColorBackground("none");
                        break;

                    // ...

                    case 'storage/unknown':
                        setOpenSnackbar(true);
                        setMessage("Error while uploading profile image");
                        setColorBackground("none");
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                    }
                }, 
                () => {
                    setColorBackground("none");
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        db.collection("users").doc(props.user.email).update({
                            photoURL: downloadURL
                        })
                        .then(() => {
                            setOpenSnackbar(true);
                            setMessage("Congratulations!! Your profile photo has been updated");
                            window.location.reload();
                        })
                        .catch((error) => {
                            // console.error("Error while uploading: ", error);
                            setOpenSnackbar(true);
                            setMessage("An Error occurred while updating your profile photo.");
                        });
                    });
                }
            );
        } else {
            const storageRef = storage.ref();

            //Before uploading new image, deleting the old one

            const imageRef = storageRef.child(`${props.user.email}/profileImage/image`);

            imageRef.delete().then(() => {
                // File deleted successfully
                //uploading the image to cloud storage
                const metadata = {
                    contentType: 'image/jpeg'
                };

                const uploadTask = storageRef.child(`${props.user.email}/profileImage/image`).put(event.target.files[0], metadata);

                uploadTask.on('state_changed', // or 'state_changed'
                    (snapshot) => {
                        setColorBackground("flex");
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(Math.round(progress));
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
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            setOpenSnackbar(true);
                            setMessage("Error while uploading profile image");
                            setColorBackground("none");
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            setOpenSnackbar(true);
                            setMessage("Error while uploading profile image");
                            setColorBackground("none");
                            break;

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            setOpenSnackbar(true);
                            setMessage("Error while uploading profile image");
                            setColorBackground("none");
                            break;
                        }
                    }, 
                    () => {
                        setColorBackground("none");
                        // Upload completed successfully, now we can get the download URL
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            db.collection("users").doc(props.user.email).update({
                                photoURL: downloadURL
                            })
                            .then(() => {
                                setOpenSnackbar(true);
                                setMessage("Congratulations!! Your profile photo has been updated");
                                window.location.reload();
                            })
                            .catch((error) => {
                                // console.error("Error while uploading: ", error);
                                setOpenSnackbar(true);
                                setMessage("An Error occurred while updating your profile photo");
                            });
                        });
                    }
                );
            }).catch((error) => {
                // Uh-oh, an error occurred!
                setOpenSnackbar(true);
                setMessage("Error while updating profile photo");
                setColorBackground("none");
            });
        }
    }

    const getAge = (dob) => {
        const newdob = new Date(dob);
        const today = new Date();
        return today.getFullYear() - newdob.getFullYear();
    }

    const openChangePasswordDiv = () => {
        if(changePasswordDiv === "none") {
            setChangePasswordDiv("flex");
        } else {
            setChangePasswordDiv("none");
        }
    }

    const onChangePassword = () => {
        if(password === "") {
            setError("password");
        } else if(confirmPassword === "") {
            setError("confirm password");
        } else if(password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");
            setOpenSnackbar(true);
            setMessage("Password and Confirm Password doesn't match!");
            setError("");
        } else if(password.length < 6) {
            setOpenSnackbar(true);
            setMessage("Password must be 6 characters long");
            setPassword("");
            setConfirmPassword("");
            setError("");
        } else {
            setLoading(true);
            db.collection("users").doc(props.user.email).update({
                password: password
            })
            .then(() => {
                setOpenSnackbar(true);
                setMessage("Password successfully changed!");
                setChangePasswordDiv("none");
                setPassword("");
                setConfirmPassword("");
                setError("");
                setLoading(false);
            })
            .catch((error) => {
                // The document probably doesn't exist.
                // console.error("Error updating document: ", error);
                setOpenSnackbar(true);
                setMessage("An Error occurred while processing your request!");
                setLoading(false);
            });
        }
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setMessage("");
    }

    const handleMenu = () => {
        if(menu === "none") {
            setMenu("block");
            setTranslate("translate");
        } else {
            setMenu("none");
            setTranslate("");
        }
    }

    const onSignOut = () => {
        const email = sessionStorage.getItem("email");
        const password = sessionStorage.getItem("password");

        if(email !== null & password !== null) {
            sessionStorage.clear();
            setOpenSnackbar(true);
            setMessage("You are successfully logged out!");
            props.setUser(null);
            setTimeout(() => {
                props.history.push("/");
            }, 1500);
        } else {
            auth.signOut().then(() => {
                setOpenSnackbar(true);
                setMessage("You are successfully logged out!");
                setTimeout(() => {
                    props.history.push("/");
                }, 1500);
            }).catch((error) => {
                setOpenSnackbar(true);
                setMessage("Error while logging out. Please try after some time.");
            });
        }
    }

    const updateDOB = (event) => {
        db.collection("users").doc(props.user.email).update({
            dob: event.target.value
        })
        .then(() => {
            setOpenSnackbar(true);
            setMessage("Your DOB successfully updated");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        })
        .catch((error) => {
            // The document probably doesn't exist.
            setOpenSnackbar(true);
            setMessage("Error occurred while updating your DOB.");
        });
    }

    return <div className="user-page-div">
        <Navbar handleMenu={handleMenu} setUser={props.setUser} user={props.user} />
        <img className="user-page-bg-img" src={userbgImage} alt="user-bg-img" />
        <div className="user-page-main-content">
            <div className="change-password-color">
                <button onClick={openChangePasswordDiv} style={{color: props.user.color, border: "2px solid " + props.user.color}} className="change-password-btn" type="button">Change Password</button>
                <button style={{color: "black", border: "2px solid " + props.user.color, background: props.user.color}} className="change-color-btn-div" type="button">
                    <div onClick={onOpenColorDropdown} className="color-text-icon-div">
                        <p className="change-color-text">Change Color</p>
                        <img className="dropdown-icon" src={dropdownIcon} alt="dropdown" />
                    </div>
                    <div style={{display: displayColorDropdown}} className="color-dropdown">
                        <div className="default-div">
                            <div style={{background: props.user.color}} className="box"></div>
                            <p className="">applied</p>
                        </div>
                        <hr className="user-page-line" />
                        <div className="non-default-div">
                            {colorList.map(color => {
                                if(color !== props.user.color) {
                                    return <div onClick={() => onSelectColor(color)} style={{background: color, marginRight: 0}} className="box unselected"></div>
                                }
                            })}
                        </div>
                    </div>
                </button>
            </div>
            <div style={{width: "100%", height: "fit-content", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div className="user-img-details-div">
                    <div className="user-img-div">
                        <div style={{border: "8px solid " +  props.user.color}} className="user-img-bg-box">
                            <img className="user-img" src={props.user.photoURL === "" ? (props.user.googlePhoto === "" ? "https://i.pinimg.com/originals/e6/38/ca/e638ca8c9bdafc0cbca31b781b279f49.jpg" : props.user.googlePhoto) : props.user.photoURL} alt="profile-img" />
                        </div>
                        {/* <button  type="button">
                            {"Edit Image"}
                            <input style={{display: "none"}} type="file" />
                        </button> */}
                        <label>
                            <p style={{background: props.user.color}} className="edit-img-btn">
                                <input onChange={onEditProfileImage} style={{display: "none"}} type="file" />
                                <p>Select Image</p>
                            </p>
                        </label>
                    </div>
                    <div className="user-details-div-showcase">
                        <div className="user-details-grid">
                            <div className="user-types-div">
                                <p style={{color: props.user.color}} className="user-name">Name</p>
                                <p style={{color: props.user.color}} className="user-name">Email</p>
                                <p style={{color: props.user.color}} className="user-name">Age</p>
                                <p style={{color: props.user.color}} className="user-name">DOB</p>
                                <p style={{color: props.user.color}} className="user-name">Hobby</p>
                                <p style={{color: props.user.color}} className="user-name">Articles</p>
                            </div>
                            <div className="user-values-div">
                                <div style={{position: "relative"}} className="user-name-value-div">
                                    <input onChange={onChangeUsername} type="text" style={{color: "white", fontWeight: 500, marginRight: 10}} className="user-name-input" value={username} />
                                    <button onClick={onSubmitChangeName} className="name-edit-btn" style={{display: nameEditBtn, background: props.user.color}} type="button">Save</button>
                                    <div style={{display: gotitDiv}} className="got-it-div">
                                        <img onClick={closeGotitDiv} style={{width: 16, marginLeft: "auto"}} className="close-icon" src="https://img.icons8.com/material-outlined/16/000000/multiply--v1.png" alt="close" />
                                        <p className="got-it-text">You can edit your name by typing on it and click on save button</p>
                                    </div>
                                </div>
                                <div className="user-name-value-div">
                                    <p style={{color: "white", fontWeight: 500, marginBottom: 0}} className="user-name">{props.user.email}</p>
                                </div>
                                <div className="user-name-value-div">
                                    <p style={{color: "white", fontWeight: 500, marginBottom: 0}} className="user-name">{props.user.dob === "" ? "DOB not provided" : getAge(props.user.dob)}</p>
                                </div>
                                <div className="user-name-value-div">
                                    <p style={{color: "white", fontWeight: 500, marginBottom: 0}} className="user-name">{props.user.dob === "" ? <input className="register-input-div" onChange={updateDOB} type="date" min="1940-01-01" max="2019-12-31" /> : props.user.dob}</p>
                                </div>
                                <div className="hobbies-div">
                                    {screenWidth <= 500 ? null : screenWidth <= 600 ? hobbies.map((hobby, index) => {
                                        if(index < 1) {
                                            return <div style={{background: props.user.color}} className="hobbies-text-delete">
                                                    <p className="hobbies-text">{hobby}</p>
                                                    <img onClick={() => removeHobbies(hobby)} className="close-icon" src="https://img.icons8.com/material-outlined/14/000000/multiply--v1.png" alt="close" />
                                                </div>
                                        }
                                    }) : hobbies.map((hobby, index) => {
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
                                    {articleData.length === 0 ? null : <p onClick={openArticles} className="view-all-articles">view All</p>}
                                </div>
                            </div>
                        </div>
                        <div style={{display: articleDiv}} className="article-showcase-div">
                            {articleData.map(article => {
                                return <div className="article-div">
                                    <img className="cover-photo" src={article.img} alt="coverphoto" />
                                    <p className="article-title-showcase">{article.title}</p>
                                    <div className="article-showcase-btn-div">
                                        <Link to={{pathname: "/" + props.user.displayName + "/" + article.title, state: {email: props.user.email, name: props.user.displayName, googlePhoto: props.user.googlePhoto, photoURL: props.user.photoURL}}} style={{border: "2px solid " + props.user.color, color: props.user.color, marginRight: 15}} className="article-showcase-read" type="button">Read</Link>
                                        <button onClick={() => deleteArticle(article.img, article.title, article.html, article.doc, article.category)} style={{border: "2px solid " + props.user.color, color: props.user.color}} className="article-showcase-read" type="button">Delete</button>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style={{display: changePasswordDiv}} className="black-screen"></div>
        <div style={{display: changePasswordDiv}} className="change-password-div-two">
            <div className="close-icon-container">
                <img onClick={openChangePasswordDiv} className="close-icon" src="https://img.icons8.com/ios-glyphs/26/000000/multiply.png"/>
            </div>
            <div className="register-items-div">
                <p className="register-item-name">Password</p>
                <div style={error === "password" ? {border: "2px solid red", borderRadius: 5} : {border: "none", borderRadius: 0}} className="register-input-div">
                    <input style={{padding: 0}} onChange={(event) => setPassword(event.target.value)} value={password} type={passwordEye} className="register-item-input" />
                    {passwordEye === "password" ? <img onClick={() => setPasswordEye("text")} className="password-eye-close" src="https://img.icons8.com/fluent-systems-regular/20/000000/visible.png"/> : <img onClick={() => setPasswordEye("password")} className="password-eye-open" src="https://img.icons8.com/fluent-systems-filled/20/000000/visible.png"/>}
                </div>
            </div>
            <div style={{marginBottom: 30}} className="register-items-div">
                <p className="register-item-name">Confirm Password</p>
                <div style={error === "confirm password" ? {border: "2px solid red", borderRadius: 5} : {border: "none", borderRadius: 0}} className="register-input-div">
                    <input style={{padding: 0}} onChange={(event) => setConfirmPassword(event.target.value)} value={confirmPassword} type={confirmPasswordEye} className="register-item-input" />
                    {confirmPasswordEye === "password" ? <img onClick={() => setConfirmPasswordEye("text")} className="password-eye-close" src="https://img.icons8.com/fluent-systems-regular/20/000000/visible.png"/> : <img onClick={() => setConfirmPasswordEye("password")} className="password-eye-open" src="https://img.icons8.com/fluent-systems-filled/20/000000/visible.png"/>}
                </div>
            </div>
            {loading ? <PulseLoader color="black" loading={loading} size={10} margin={2} /> : <button onClick={onChangePassword} className="register-btn" type="button">Continue</button>}
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
        <div style={{display: menu}} className="menu-screen"></div>
        <div className={"menu-div " + translate}>
            <div className="links">
                <img onClick={handleMenu} className="close-icon" src="https://img.icons8.com/ios-glyphs/26/000000/multiply.png"/>
                {props.user === null 
                ? <div style={{display: "flex", flexDirection: "column"}}>
                    <Link style={{padding: 10}} className="sign-in-link sign-in-sidebar" to="/signin">SignIn</Link>
                    <Link style={{padding: 10}} className="sign-in-link sign-in-sidebar" to="/register">Get Started</Link>
                </div> 
                : <div style={{display: "flex", flexDirection: "column"}}>
                    <Link to={"/" + props.user.displayName + "/write"} className="link-container">
                        <img src="https://img.icons8.com/windows/24/000000/writer-male.png"/>
                        <p className="sign-in-link">Write</p>
                    </Link>
                    <Link to={"/" + props.user.displayName + "/read"} className="link-container">
                        <img src="https://img.icons8.com/material/24/000000/read.png"/>
                        <p className="sign-in-link">Read</p>
                    </Link>
                    <Link to={"/" + props.user.displayName} className="link-container">
                        <img src="https://img.icons8.com/material-outlined/24/000000/user-male-circle.png"/>
                        <p className="sign-in-link">Profile</p>
                    </Link>
                    <button onClick={openChangePasswordDiv} className="link-container">
                        <img src="https://img.icons8.com/material-outlined/24/000000/lock-2.png"/>
                        <p className="change-password-btn" type="button">Change Password</p>
                    </button>
                    <button onClick={onSignOut} className="link-container">
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
        <div style={{display: colorBackground, backgroundColor: props.user.color }} className="color-background">
            <div className="progress-div">
                <p className="progress-percent">{progress} %</p>
                <p className="progress-msg">Please don't refresh the page</p>
                <p className="progress-msg">We are updating your profile photo. Just wait a while...</p>
            </div>
        </div>
    </div>
}

export default withRouter(User);