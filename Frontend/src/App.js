import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


import Login from './view/Login';
import Registration from './view/Registration'
import LandingPage from './view/LandingPage'
import Admin from "./view/Admin";
import Download from "./view/Download"
import User from "./view/User"


import { BrowserRouter as Router, Route } from "react-router-dom";


export default class App extends React.Component {

render(){
  const downloadPath =  "/download/";
  return (
      <Router>
        <div className="App">
          <div className="container py-4">
            <div className="row">
              <Route path="/" exact component={LandingPage}/>
              <Route path="/upload" exact component={LandingPage}/>
              <Route path="/login" exact component={Login} />
              <Route path="/registration" exact component={Registration}/>
              <Route path='/admin' exact component={Admin}/>
              <Route path={downloadPath}  component={Download}/>
              <Route path='/user' exact component={User}/>
            </div>
          </div>
        </div>
      </Router>
  );
}
}



