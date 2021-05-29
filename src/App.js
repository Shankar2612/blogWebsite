import React, {useState, useEffect } from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import SignIn from "./Pages/SignIn";
import Read from "./Pages/Read";
import Write from "./Pages/Write";
import UserWrite from "./Pages/UserWrite";
import User from "./Pages/User";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { auth, db } from "./Firebase/firebase";
import './App.css';

const App = (props) => {
  
  const [user, setUser] = useState(null);
  const [time, setTime] = useState(null);
  const [userColor, setUserColor] = useState("");

  useEffect(() => {
    const todayDate = new Date();
    const hours = todayDate.getHours();
    setTime(hours);

    auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log("user signed in", user);

        db.collection("users").doc(user.email).get().then((doc) => {
          setUserColor(doc.data().color);
          setUser(doc.data());
        })

      } else {
        console.log("user signed out");
        setUser(null);
      }
    });
  }, [])

  console.log(user);
  return (    
    <div className="app">
      {user === null
      ? <Router>
        <Switch>
          <Route exact path="/">
            <Navbar user={user} />
            <Home user={user} />
          </Route>
          <Route exact path="/register">
              <Navbar user={user} />
              <Register />
          </Route>
          <Route exact path="/signin">
              <Navbar user={user} />
              <SignIn />
          </Route>
          <Route path="/:id">
            <div>Error 404</div>
          </Route>
        </Switch>
      </Router>
      : <Router>
        <Switch>
          <Route exact path="/">
              <Navbar user={user} />
              <Home user={user} />
          </Route>
          <Route exact path="/:id/read">
              <Navbar user={user} />
              <Read time={time} userColor={userColor} user={user} />
              <Footer />
          </Route>
          <Route exact path="/:id/write">
              <Navbar user={user} />
              <Write time={time} userColor={userColor} user={user} />
              <Footer />
          </Route>
          <Route exact path="/:user/:article">
              <Navbar user={user} />
              <UserWrite userColor={userColor} user={user} />
              <Footer />
          </Route>
          <Route exact path={"/" + user.displayName} >
            <Navbar user={user} />
            <User user={user} userColor={userColor} />
          </Route>
          <Route path="/:id">
            <div>Error 404</div>
          </Route>
        </Switch>
      </Router>}

      {/* <Router>
        <Switch>
          {user !== null
          ? <Route exact path="/:id/read">
              <Navbar user={user} />
              <Read user={user} />
          </Route>
          : <Redirect to="/" />}
          <Route exact path="/">
            <Navbar user={user} />
            <Home user={user} />
          </Route>
          {user === null
          ? <Route exact path="/register">
              <Navbar user={user} />
              <Register />
          </Route>
          : <Redirect to="/" />}
          {user === null
          ? <Route exact path="/signin">
              <Navbar user={user} />
              <SignIn />
          </Route>
          : <Redirect to="/" />}
        </Switch>
      </Router> */}
    </div>
  );
}

export default App;
