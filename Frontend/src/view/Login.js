import React from 'react'
import {login} from "../api/utils";
import './Login.css';
import "./Admin.css";

import {withStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

const redirectadminpath = '/adminpanel';
const redirectteacherpath = '/teacherpanel';
const redirectpupilpath = '/pupilpanel';

const styles = theme => ({
  root: {},
});

class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.loginAction = this.loginAction.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  createUser(){
    this.props.history.push({ pathname: "/registration" });
  }

  loginAction() {
    var that = this;
    var data = {
      'username': that.state.username,
      'password': that.state.password
    }
    login(data).then(response => {
      if(response.status === 200 && response.statusText === "OK"){
        if(response.data.user_type === 'Admin')this.props.history.push({ pathname: "/admin", state: {userinfo: response.data} });
        else this.props.history.push({ pathname: "/user", state: {userinfo: response.data} });
      }
    })

  }

  onChangeHandler(e, lblname) {
    if (lblname === 'username') {
      this.setState({username: e.target.value})
    } else {
      this.setState({password: e.target.value})
    }
  }

  render() {
    return (
      <div>
        <div className="fill-window">
          <div
            style={{
              width: "100%",
              backgroundColor: "#005f50",
              height: "60px",
            }}
          >
            <div className="main-title-area">
              <div class="site-identity">
                <a href="#">
                  <img
                    src="https://www.tu-chemnitz.de/tucal4/img/logo-ua.svg"
                    alt="Site Name"
                  />
                </a>
                <h1 style={{ color: "#ecf0f1" }}>TUC Share</h1>
              </div>
            </div>
          </div>

          <div
            className="container p-33 border"
            style={{
              width: "500px",
              borderRadius: "15px",
              padding: "50px",
              margin: "5% auto",
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 8px 0px",
            }}
          >
            <div className="form-group">
              <h2
                style={{
                  textShadow: "-4px 3px 2px rgba(162, 155, 254, 0.29)",
                  color: "#005f50",
                }}
              >
                Account Login
              </h2>
              <br />
              <TextField
                style={{ width: "85%" }}
                id="username"
                label="Username"
                variant="outlined"
                onChange={(e) => this.onChangeHandler(e, "username")}
              />
              <br />
              <br />
              <TextField
                style={{ width: "85%" }}
                id="password"
                label="Password"
                type="Password"
                variant="outlined"
                onChange={(e) => this.onChangeHandler(e, "password")}
              />
              <br />
              <br />
              <button
                className="btn btn-info signupLoginButton"
                style={{ width: "85%" }}
                onClick={this.loginAction}
              >
                Login
              </button>
              {/*<button className="btn btn-info signupLoginButton" style={{width: '85%'}} onClick={this.createUser}>Create a new user</button>*/}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              backgroundColor: "#005f50",
              height: "60px",
              position: "fixed",
              bottom: "0",
            }}
          ></div>
        </div>
      </div>
    );
  }
}


export default withStyles(styles, {withTheme: true})(LoginPage);
