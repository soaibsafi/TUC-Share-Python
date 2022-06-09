import React from 'react';
import '../../../App.css';

import {withStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  root: {},
});

class userpopup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fname: this.props.userinfo.fname,
      lname: this.props.userinfo.lname,
      username: this.props.userinfo.username,
      uid: this.props.userinfo.uid,
      selectedRole: this.props.selectedRole,
      password: ''
    }
    this.oninputChange = this.oninputChange.bind(this);
    this.onRoleSelect = this.onRoleSelect.bind(this);
    this.setUserID = this.setUserID.bind(this);
    this.sendData = this.sendData.bind(this);
    this.resetState = this.resetState.bind(this);
    this.close = this.close.bind(this);
  }

  render() {
    var that = this;
    return (
        <div className='popup'>
          <div className='App popup_inner'>
            <div className="custom_pop">
              <h2>{that.props.popupHeaderText + " " + (that.props.popupHeaderText !== "Update" ? that.props.selectedRole : '')}</h2>
              <br/>
              <div>
                {that.props.popupHeaderText === "Update" ?
                    <TextField style={{width: '100%'}} disabled label="Username" variant="outlined"
                               value={this.state.username} id="usernname"
                               onChange={(e) => that.oninputChange.bind(e, "username")}/>
                    :
                    <TextField style={{width: '100%'}} label="Username" variant="outlined"
                               value={this.state.username} id="usernname1"
                               onChange={(e) => that.oninputChange(e, "username")}/>
                }
                <br/><br/>
                <TextField style={{width: '100%'}} label="First Name" variant="outlined" id="fname"
                           value={this.state.fname} onChange={(e) => that.oninputChange(e, "fname")}/>

                <br/><br/>
                <TextField style={{width: '100%'}} label="Last Name" variant="outlined" id="lname"
                           value={this.state.lname}  onChange={(e) => that.oninputChange(e, "lname")}/>
                <br/><br/>
                {that.props.popupHeaderText !== "Update" ?
                    <div>
                      <TextField style={{width: '100%'}} label="Password" variant="outlined"
                                 type="password" id="password"
                                 onChange={(e) => that.oninputChange(e, "password")}/>
                      <br/>
                    </div> : null}
              </div>
              <div className="popup-button-area">
                <button className='btn btn-outline-info' onClick={that.sendData}>{this.props.popupBtnText}</button>
                <button className='btn btn-outline-danger' onClick={this.close}>{"Close"}</button>
              </div>
            </div>
          </div>
        </div>
    )
  }

  close() {
    this.resetState();
    this.props.closePopup();
  }

  resetState() {
    this.setState({
      fname: "",
      lname: "",
      username: "",
      uid: "",
      selectedRole: "",
      password: ''
    })
  }

  oninputChange(key, lblname) {
    switch (lblname) {
      case "username":
        this.setState({username: key.target.value});
        break;
      case "fname":
        this.setState({fname: key.target.value});
        break;
      case "lname":
        this.setState({lname: key.target.value});
        break;
      case "password":
        this.setState({password: key.target.value});
        break;
      default:
        break;
    }
  }

  onRoleSelect(e) {
    this.setState({selectedRole: e.value})
  }

  setUserID() {
    return "USRATR" + Date.now()
  }

  sendData() {
    var data = this.props.popupBtnText === "Add" ? {
      "firstname": this.state.fname,
      "lastname": this.state.lname,
      "username": this.state.username,
      "password": this.state.password,
      "role": this.state.selectedRole,
      "uid": this.setUserID()

    } : {
      "firstname": this.state.fname,
      "lastname": this.state.lname,
      "role": this.state.selectedRole,
      "uid": this.state.uid
    }

    // this.resetState();
    if (this.props.popupBtnText === "Add") {
      if (data.firstname.length &&
          data.lastname.length &&
          data.username.length &&
          data.password.length) {

        this.props.addUser(data)
      } else alert("No name provided");
    } else {
      if (data.firstname.length &&
          data.lastname.length)
        this.props.updateInfo(data);

      else alert("Please Provide all information")
    }
  }
}

export default withStyles(styles, {withTheme: true})(userpopup);
