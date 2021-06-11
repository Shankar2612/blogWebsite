import React, { useState, useEffect } from 'react';
import homeImage from "../Images/homeImage.png";
import homeBackground from "../Images/homeBackground.jpg";
import read from "../Images/read.png";
import write from "../Images/write.png";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./Home.css";

const Home = (props) => {

    const [menu, setMenu] = useState("none");
    const [translate, setTranslate] = useState("");

    console.log(props.user);

    const handleMenu = () => {
        if(menu === "none") {
            setMenu("block");
            setTranslate("translate");
        } else {
            setMenu("none");
            setTranslate("");
        }
    }

    return <div className="home-container">
        <Navbar handleMenu={handleMenu} setUser={props.setUser} user={props.user} />
        {props.user === null
        ? <div className="home">
            <div className="home-content-section">
                <p className="home-content-quote">“Blogging is a conversation, not a code.”</p>
                <p className="home-content-author">-Brian Clark</p>
                <p className="home-content-motivation">Start Reading from all famous writers and contribute to Blog.io to help others learn. </p>
                <Link to="/register" className="home-content-link">Get Started</Link>
            </div>
            {/* <img className="home-img" src={homeImage} alt="" /> */}
            <img className="home-background-img" src={homeBackground} alt="" />
            <div className="home-img-screen"></div>
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
                <Link className="home-second-write-link" to={"/" + props.user.displayName + "/write"}>Start Writing</Link>
            </div>
        </div>}
        <div style={{display: menu}} className="menu-screen"></div>
        <div className={"menu-div " + translate}>
            <div className="links">
                <img onClick={handleMenu} className="close-icon" src="https://img.icons8.com/ios-glyphs/26/000000/multiply.png"/>
                <Link className="sign-in-link" to="/signin">SignIn</Link>
                <Link className="sign-in-link" to="/register">Get Started</Link>
            </div>
            <div className="social-media-div">
                <img className="social-media-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAABKklEQVQ4jZXUuUoEQRAG4I9BjETMNRE8EBMDMXMFr8AXMBEEH8BY8Ek8MgMjH0AQdV08wNBAQTQRQxevUNCgZ6AdZlr3h4Ke6r9+qrqqhmosYAd3+MztFtuYr4n5hRE08f2HnWK4TqSB9j9ECmtjuiqTlMg7rnCI68j/gqFYKFXOAXoibl/p/qS4WEiIfKA3EunHRAVvjtCdOqGrSGQzwdvKqh4swlN0XkzwGlmebh2+onN3gjdAGLZyquuJoLEK/nuG50RQFUYrfM9daAlzFGMZ48LM7Oa+DQzm/jJahN2p68Z+RL5M8GYzHOG8k9pKaOI4yz9WhTXoFG9Yg0LoQSix3YHIK5bwGAsRHnYKZ/8QOcUkLgpHV4nwgBnhl7IibHeBe9xgT96lGD/qsILQWZplNAAAAABJRU5ErkJggg==" />
                <img className="social-media-icon" src="https://img.icons8.com/android/18/000000/twitter.png"/>
                <img className="social-media-icon" src="https://img.icons8.com/material-rounded/18/000000/instagram-new.png"/>
                <img className="social-media-icon" src="https://img.icons8.com/android/18/000000/linkedin.png"/>
                <img className="social-media-icon" src="https://img.icons8.com/material-outlined/18/000000/github.png"/>
            </div>
        </div>
    </div>
}

export default Home;