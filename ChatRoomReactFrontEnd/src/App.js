import React from 'react';
import './App.css';
import Signin from './../src/views/Signin/Signin.js';
import Dashboard from './../src/views/Dashboard/Dashboard.js';
import NotFound from './../src/views/NotFound/NotFound.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {

  return (
    <Router>
      <Switch>
        <Route path="/" component={Signin} exact />
        <Route path="/signup" component={Signin} exact />
        <Route path="/dashboard" component={Dashboard} exact />
        <Route path="/not-found" component={NotFound} exact />
        <Redirect path="/" to="not-found" />
      </Switch>
    </Router>
  );
}

export default App;