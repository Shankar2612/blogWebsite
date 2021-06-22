import React, {useState, useEffect } from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import SignIn from "./Pages/SignIn";
import Read from "./Pages/Read";
import Write from "./Pages/Write";
import UserWrite from "./Pages/UserWrite";
import User from "./Pages/User";
import Error from "./Pages/Error";
import CategoryItem from "./Pages/CategoryItem";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ChangePasswordPage from "./Pages/ChangePasswordPage";
import { auth, db } from "./Firebase/firebase";
import './App.css';

class App extends React.Component {
  constructor(){
    super();
    this.state={
      user: null,
      time: null,
      userColor: "",
      isLoggedin: false,
      loading: true
    }
  }

  componentDidMount(){
    
    //Retrieving user details from session storage
    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");

    const todayDate = new Date();
    const hours = todayDate.getHours();
    this.setState({time: hours});

    if(email !== null & password !== null) {
      db.collection("users").doc(email).get().then((doc) => {
        this.setState({userColor: doc.data().color, user: doc.data(), isLoggedin: true, loading: false});
      });
    } else {
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("user signed in", user);
  
          db.collection("users").doc(user.email).get().then((doc) => {
            this.setState({userColor: doc.data().color, user: doc.data(), isLoggedin: true, loading: false});
          });
  
        } else {
          console.log("user signed out");
          this.setState({user: null, isLoggedin: false, loading: false});
        }
      });
    }
  }

  setUser = (newUser) => {
    if (newUser !== null) {
      this.setState({user: newUser, isLoggedin: true});
    } else {
      this.setState({user: newUser, isLoggedin: false});
    }
  }

  render() {
    console.log(this.state.user, this.state.isLoggedin);
    console.log(localStorage.getItem("otp"));
  return (    
    <div className="app">
      <Router>
          {this.state.loading ? null : 
          <Switch>
            <Route exact path="/">
              <Home setUser={this.setUser} user={this.state.user} />
            </Route>
            <Route exact path="/user/forgotpassword">
              {!this.state.isLoggedin ? <ForgotPasswordPage /> : <Redirect to={"/"} />}
            </Route>
            <Route exact path="/user/changepassword">
              {!this.state.isLoggedin && localStorage.getItem("otp") !== null ? <ChangePasswordPage /> : <Redirect to="/user/forgotpassword" />}
            </Route>
            <Route exact path="/register">
              {!this.state.isLoggedin ? <Register setUser={this.setUser} user={this.state.user} /> : <Redirect to={"/"} />}
            </Route>
            <Route exact path="/signin">
              {!this.state.isLoggedin ? <SignIn setUser={this.setUser} user={this.state.user} /> : <Redirect to={"/"} />}
            </Route>
            <Route exact path="/:id/read">
              {!this.state.isLoggedin ? <Redirect to={"/"} /> : <Read setUser={this.setUser} time={this.state.time} userColor={this.state.userColor} user={this.state.user} />}
            </Route>
            <Route exact path="/:id/write">
              {!this.state.isLoggedin ? <Redirect to={"/"} /> : <Write setUser={this.setUser} time={this.state.time} userColor={this.state.userColor} user={this.state.user} />}
            </Route>
            <Route exact path={this.state.user === null ? null : "/" + this.state.user.displayName}>
              {!this.state.isLoggedin ? <Redirect to={"/"} /> : <User setUser={this.setUser} user={this.state.user} userColor={this.state.userColor} />}
            </Route>
            <Route exact path="/:id/:article">
              {!this.state.isLoggedin ? <Redirect to={"/"} /> : <UserWrite setUser={this.setUser} user={this.state.user} userColor={this.state.userColor} />}
            </Route>
            <Route exact path="/:id">
              {!this.state.isLoggedin ? <Redirect to={"/"} /> : <CategoryItem setUser={this.setUser} user={this.state.user} userColor={this.state.userColor} />}
            </Route>
            <Route path="/:id">
              <Error user={this.state.user} />
            </Route>
          </Switch>}
      </Router>
    </div>
  );
  }
}

export default App;

      