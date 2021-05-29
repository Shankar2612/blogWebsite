import React, { useState, useEffect } from 'react';
import readBackgroundImage from "../Images/readBackgroundImage.png";
import SurveyCard from "../Components/SurveyCard";
import CategoryCard from "../Components/CategoryCard";
import ArticleCard from "../Components/ArticleCard";
import "./Read.css";
import { db } from '../Firebase/firebase';

class Read extends React.Component {
    constructor(){
        super();
        this.state = {
            survey: [],
            surveyRequired: false,
            categories: [],
            articles: []
        }
    }

    componentDidMount() {

        //Fetching survey items from the database 
        db.collection("surveyItems").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.setState({survey: this.state.survey.concat(doc.data())});
            });
        });

        //Fetching users data from database
        db.collection("users").doc(this.props.user.email).get().then((doc) => {
            if(doc.data().articleCategories.length === 0) {
                this.setState({surveyRequired: true});
            } else {
                this.setState({surveyRequired: false});
            }
        })

        //Fetching articles from the database
        db.collection("articles").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.setState({articles: this.state.articles.concat(doc.data())});
            });
        });
    }

    moveToSecondPage = () => {
        window.scrollTo(0,652);
    }

    addToCategory = (title) => {
        this.setState({categories: this.state.categories.concat(title)});        
    }

    removeFromCategory = (title) => {
        const newCategory = this.state.categories.slice(0, title).concat(this.state.categories.slice(title+1, -1));
        this.setState({categories: newCategory});
    }

    onSubmitSurvey = () => {
        db.collection("users").doc(this.props.user.email).update({
            articleCategories: this.state.categories
        }).then(() => {
            alert(`Thanks for taking the Survey.`);
            window.location.reload();
        })
        .catch((error) => {
            // The document probably doesn't exist.
            alert("Error occurred while submitting the survey");
        });
    }

    render(){
    //   console.log(this.state.categories);
      return <div className="read-container">
        <div className="read-bg-img-container">
            <img className="read-bg-img" src={readBackgroundImage} alt="read-background-img" />
            <div className="read-bg-content">
                <p className="read-bg-salutation">
                    {this.props.time === null ? null : this.props.time >= 0 & this.props.time < 12 ? "Good Morning" : this.props.time >= 12 & this.props.time < 16 ? "Good Afternoon" : "Good Evening"}
                    <span style={{color: "#23C0B7", background: "transparent"}}> Mr. {this.props.user.displayName.split(" ")[0]}</span></p>
                <p className="read-bg-welcome">Welcome to Blog.io</p>
                <p style={{marginBottom: 30}} className="read-bg-welcome">Read an article to learn something new today.</p>
                <p className="read-bg-quote">“Today a reader, tomorrow a leader”</p>
                <p className="read-bg-author">-Margaret Fuller</p>
            </div>
            <div className="read-bg-svg-box" onClick={this.moveToSecondPage}>
                <svg className="read-bg-svg" width="28" height="16" viewBox="0 0 52 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="22.3007" y="25.2114" width="37.062" height="6.35348" rx="3.17674" transform="rotate(-45 22.3007 25.2114)" fill="white"/>
                    <rect x="3.49255" y="-1" width="37.062" height="6.35348" rx="3.17674" transform="rotate(45 3.49255 -1)" fill="white"/>
                </svg>
            </div>
        </div>
        {this.state.surveyRequired 
        ? <div className="survey-container">
            <div className="survey">
                <p className="survey-title">Survey Time!!</p>
                <p className="survey-body">Before start reading, please select the category of topics you would like to read. This will help us serve you better. Thank You!</p>
                <div className="survey-grid-container">
                    {this.state.survey.map(eachSurvey => {
                        return <SurveyCard addToCategory={this.addToCategory} removeFromCategory={this.removeFromCategory} img={eachSurvey.img} title={eachSurvey.title} />
                    })}
                </div>
                <button onClick={this.onSubmitSurvey} className="survey-submit-btn" type="button">Submit Survey</button>
            </div>
        </div>
        : <div className="category-container">
            <div className="category">
                <p className="category-title">Categories</p>
                <p className="category-body">What is your mood to read today? Select the topic that best suits your mood.</p>
                <div className="category-grid-container">
                    {this.state.survey.map(eachSurvey => {
                        return <CategoryCard img={eachSurvey.img} title={eachSurvey.title} />
                    })}
                </div>
            </div>
        </div>}
        <div className="best-writers-section">
            <div className="best-writers">
                <p style={{color: "white"}} className="best-writers-title">Read from our best Writers</p>
                <div className="best-writers-grid-container">
                    {this.state.articles.map(eachSurvey => {
                        return <ArticleCard img={eachSurvey.img} title={eachSurvey.title} rating={eachSurvey.rating} body={eachSurvey.body} 
                                            authorImg={eachSurvey.authorImg} time={eachSurvey.time} author={eachSurvey.author} color={this.props.userColor}  />
                    })}
                </div>
            </div>
        </div>
    </div>  
    }
    
}

export default Read;