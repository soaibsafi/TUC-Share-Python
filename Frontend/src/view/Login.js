import React from 'react'
import {login} from "../api/utils";
import './Login.css';

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
      console.log(response)
      if(response.status === 200 && response.statusText === "OK"){
        this.props.history.push({ pathname: "/admin", state: {usertype: response.data} });
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
        <div className="parent-div fill-window">
          <div style={{width: "100%", backgroundColor: "#16a085", height: "60px"}}>
            {/*<h1>E-School Cube</h1>*/}
          </div>
          <div className="title-area">

          </div>
          <div className="container p-33 border"
               style={{width: '500px', borderRadius: '15px', padding: '50px', margin: '5% auto', boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}}>
            <div className="form-group">
              <h2 style={{textShadow: '-4px 3px 2px rgba(162, 155, 254, 0.29)', color: 'rgb(87, 101, 116)'}}>Account Login</h2>
              <br/>
              <TextField style={{width: '85%'}} id="username" label="Username" variant="outlined"
                         onChange={(e) => this.onChangeHandler(e, "username")}/>
              <br/><br/>
              <TextField style={{width: '85%'}} id="password" label="Password" type="Password" variant="outlined"
                         onChange={(e) => this.onChangeHandler(e, "password")}/>
              <br/><br/>
              <button className="btn btn-info" style={{width: '85%'}} onClick={this.loginAction}>Login</button>
              {/*<br/><br/>*/}
              {/*<button className="btn btn-info" style={{width: '85%'}} onClick={this.createUser}>Create a new user</button>*/}
            </div>
          </div>
          <div>

          </div>
          <div
              style={{width: "100%", backgroundColor: "#16a085", height: "60px", position: "fixed", bottom: "0"}}>
            <label style={{color: 'rgb(223, 230, 233)', paddingTop: '21px', textShadow: '-4px 3px 2px rgba(241, 196, 15, 0.29)', fontWeight: 'bold'}}>Welcome to E-School Cube</label>

          </div>
        </div>

    )
  }
}


export default withStyles(styles, {withTheme: true})(LoginPage);
