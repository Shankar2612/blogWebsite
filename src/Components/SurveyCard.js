import React, { useState, useEffect } from 'react';
import "./SurveyCard.css";

class SurveyCard extends React.Component {
    constructor(){
        super();
        this.state={
            color: "black",
            click: "click",
        }
    }

    changeColorToWhite = () => {
        this.setState({color: "white"});
    }

    changeColorToBlack = () => {
        this.setState({color: "black"});
    }

    addCategory = (title) => {
        this.setState({click: "clicked"});
        this.props.addToCategory(title);
    }

    removeCategory = (title) => {
        this.setState({click: "click"});
        this.props.removeFromCategory(title);
    }

    render(){
      return <div className="survey-grid-item">
        <img className="survey-grid-img" src={this.props.img} alt="" />
        {this.state.click === "click"
        ? <button onClick={() => this.addCategory(this.props.title)} onMouseEnter={this.changeColorToWhite} onMouseLeave={this.changeColorToBlack} className="survey-grid-btn" type="button">
            <svg width="11" height="11" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="7" width="4" height="18" rx="2" fill={this.state.color} />
                <rect y="11" width="4" height="18" rx="2" transform="rotate(-90 0 11)" fill={this.state.color} />
            </svg>
            <p className="survey-grid-title">{this.props.title}</p>
        </button>
        : <button style={{background: "black"}} onClick={() => this.removeCategory(this.props.title)} className="survey-grid-btn" type="button">
            <svg width="11" height="11" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="7" width="4" height="18" rx="2" fill={"white"} />
                <rect y="11" width="4" height="18" rx="2" transform="rotate(-90 0 11)" fill={"white"} />
            </svg>
            <p style={{color: "white"}} className="survey-grid-title">{this.props.title}</p>
        </button>}
    </div>  
    }

    
}

export default SurveyCard;