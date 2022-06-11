import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


import Login from './view/Login';
import Registration from './view/Registration'
import LandingPage from './view/LandingPage'
import AdminPage from './view/Admin'

import adminPanel from './view/admin/adminPanel'
import pupilPanel from "./view/pupil/pupilPanel";
import teacherPanel from "./view/teacher/teacherPanel";
import manageTest from './view/teacher/manageTest'


import { BrowserRouter as Router, Route } from "react-router-dom";
import Admin from "./view/Admin";

export default class App extends React.Component {
render(){
  return (
      <Router>
        <div className="App">
          <div className="container py-4">
            <div className="row">
              <Route path="/" exact component={LandingPage}/>
              <Route path="/login" exact component={Login} />
              <Route path="/registration" exact component={Registration}/>
              <Route path='/admin' exact component={Admin}/>



              <Route path="/adminpanel" exact component={adminPanel}/>
              <Route path="/pupilpanel" exact component={pupilPanel}/>
              <Route path="/teacherpanel" exact component={teacherPanel}/>
              <Route path="/manageTestpanel" exact component={manageTest}/>

            </div>
          </div>
        </div>
      </Router>
  );
}
}



