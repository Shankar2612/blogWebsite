import React, { useState, useEffect } from 'react';
import { withRouter, Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { db } from "../Firebase/firebase";
import ArticleCard from "../Components/ArticleCard";
import PulseLoader from "react-spinners/PulseLoader";
import "./CategoryItem.css";

class CategoryItem extends React.Component {
    constructor() {
        super();
        this.state={
            articles: [],
            loading: false
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        setTimeout(() => {
            db.collection("articleData").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // this.setState({articles: this.state.articles.concat(doc.data()), loading: false});
                    doc.data().data.map(eachData => {
                        if(eachData.category === this.props.match.params.id) {
                            db.collection("users").doc(doc.id).get().then((doc) => {
                                this.setState({articles: this.state.articles.concat({
                                    img: eachData.img,
                                    title: eachData.title,
                                    category: eachData.category,
                                    html: eachData.html,
                                    profileImg: doc.data().photoURL,
                                    name: doc.data().displayName,
                                    doc: eachData.doc
                                }), loading: false});
                            })
                        } else {
                            this.setState({loading: false});
                        }
                    })
                });
            });
        }, 1500);
    }

    render(){
    return <div className="category-item-container">
        <Navbar setUser={this.props.setUser} user={this.props.user} />
        {this.state.loading 
        ? <div style={{width: "100%", height: "100vh",backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center"}}><PulseLoader color={this.props.userColor} loading={this.state.loading} size={12} margin={2} /></div>
        : this.state.articles.length === 0 
            ? <div className="no-articles-div">
                <img className="no-article-logo" src="https://img.icons8.com/flat-round/128/000000/bookmark-book.png" alt="noarticle-logo" />
                <p className="no-articles-text">There are no articles related to <span style={{color: this.props.userColor, fontWeight: 600}}>{this.props.match.params.id}</span>. Be the first one to write about <span style={{color: this.props.userColor, fontWeight: 600}}>{this.props.match.params.id}</span>.</p>
                <Link style={{color: this.props.userColor, border: "2px solid " + this.props.userColor}} className="start-writing-link" to={"/" + this.props.user.displayName + "/write"}>Start Writing</Link>
            </div>
            : <div className="category-item-div">
            {this.state.articles.map(article => {
                return <ArticleCard img={article.img} title={article.title} authorImg={article.profileImg} html={article.html} doc={article.doc} author={article.name} color={this.props.userColor}  />
            })}
        </div>}
        <Footer userColor={this.props.userColor} />
    </div>
    }
}

export default withRouter(CategoryItem);