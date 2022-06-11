import React from 'react'
import {uploadFile} from "../api/utils";
import './LandingPage.css';

import {withStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import IconButton from "@material-ui/core/IconButton";
import * as micon from "@material-ui/icons";

const redirectadminpath = '/adminpanel';
const redirectteacherpath = '/teacherpanel';
const redirectpupilpath = '/pupilpanel';



const styles = theme => ({
  root: {},
});

class LandingPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      selectedFile: null,
      filesList: [],
      uploadFile: '',
      hideDownloadUrl: true,

    };

    this.selectFile = this.selectFile.bind(this);
    this.addFile = this.addFile.bind(this);
    this.loadFillData = this.loadFillData.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.loadRegister = this.loadRegister.bind(this);
    this.loadLogin = this.loadLogin.bind(this);




    // this.loginAction = this.loginAction.bind(this);
    // this.onChangeHandler = this.onChangeHandler.bind(this);
    // this.createUser = this.createUser.bind(this);
  }

  loadRegister(){
    this.props.history.push({ pathname: "/registration"});
  }

  loadLogin(){
    this.props.history.push({ pathname: "/login"});
  }

  uploadFile(){
    var status = this.state.hideDownloadUrl
    this.setState({hideDownloadUrl: !status})
  }

  loadFillData(){
    if (this.state.filesList.length) {

      return this.state.filesList.map(data => {
        return (
            <tr key={data.hashId}>
              <th>{data.fileName}</th>
              <th style={{display: this.state.hideDownloadUrl ? 'none' : ''}}>{data.downloadUrl}</th>
              <td>{<IconButton className="btn btn-info" onClick={() => this.openPopup(data)}>
                <micon.Info style={{color: "#22a6b3", frontSize: "30"}}/>
              </IconButton>}</td>
            </tr>
        )
      })
    }
  }

  addFile(){
    var that = this
    const fileData = new FormData();
    fileData.append(
        "file",
        this.state.selectedFile,
        this.state.selectedFile.name
    );
    uploadFile(fileData).then(response => {
      console.log(response);
      var tempList = that.state.filesList;
      var downloadUrl = "http://127.0.0.1:8000/download/" + response.data.filehash
      var fileName = that.state.selectedFile.name
      var hashId = response.data.fileHash

      var obj = {
        fileName,
        downloadUrl,
        hashId
      }

      tempList.push(obj)
      that.setState({filesList: tempList}, console.log(that.state.filesList))
    })
  }

  selectFile(){
    var that = this;
    this.setState({selectedFile: event.target.files[0]})
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
        this.props.history.push({ pathname: "/adminpanel", state: {usertype: response.data} });
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
              <h3 style={{textShadow: '-4px 3px 2px rgba(162, 155, 254, 0.29)', color: 'rgb(87, 101, 116)'}}>Upload a file</h3>
              <input type="file" id="myFile" name="filename" onChange={this.selectFile}/>
              <br/><br/>
              <button className="btn btn-info" style={{width: '85%'}} onClick={this.addFile}>Add</button>
              <br/><br/>

              <table className="table table-hover table-striped">
                <thead style={{backgroundColor: '#30336b', color:'#dff9fb'}}>
                <tr key={"user_key1"}>
                  <th scope="col">File Name</th>
                  <th scope="col" style={{display: this.state.hideDownloadUrl ? 'none' : ''}}>Download URL</th>
                  <th scope="col"></th>
                </tr>
                </thead>
                <tbody>
                {this.loadFillData()}
                </tbody>
              </table>
              <br/><br/>
              <button className="btn btn-info" style={{width: '85%'}} onClick={this.uploadFile}>Upload</button>
              <br/><br/>
              <button className="btn btn-info" style={{width: '85%'}} onClick={this.loadRegister}>Register</button>
              <br/><br/>
              <button className="btn btn-info" style={{width: '85%'}} onClick={this.loadLogin}>Login</button>
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


export default withStyles(styles, {withTheme: true})(LandingPage);
