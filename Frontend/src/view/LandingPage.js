import React from "react";
import {clearCache, uploadFile} from "../api/utils";
import "./All.css";

import TextField from "@material-ui/core/TextField";

const redirectadminpath = "/adminpanel";
const redirectteacherpath = "/teacherpanel";
const redirectpupilpath = "/pupilpanel";

import {withStyles} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import * as micon from '@material-ui/icons';
import { Hidden } from "@material-ui/core";

const styles = (theme) => ({
  root: {},
});

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      selectedFile: null,
      filesList: [],
      uploadFile: "",
      hideDownloadUrl: true,
      userType: '',
      userinfo: {}
    };

    this.selectFile = this.selectFile.bind(this);
    this.addFile = this.addFile.bind(this);
    this.loadFillData = this.loadFillData.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.loadRegister = this.loadRegister.bind(this);
    this.loadLogin = this.loadLogin.bind(this);
    this.copyUrl = this.copyUrl.bind(this);
    this.backToUser = this.backToUser.bind(this);
  }

  backToUser(){
    this.props.history.push({ pathname: "/user" , state: {userinfo: this.state.userinfo}});
  }

  loadRegister() {
    this.props.history.push({ pathname: "/registration" });
  }

  loadLogin() {
    this.props.history.push({ pathname: "/login" });
  }

  uploadFile() {
    var status = this.state.hideDownloadUrl;
    this.setState({ hideDownloadUrl: !status });
  }

  loadFillData() {
    if (this.state.filesList.length) {
      return this.state.filesList.map((data) => {
        return (
          <tr className="d-flex flex-nowrap" key={data.hashId}>
            <th className="col-sm" >{data.fileName}</th>
            <th className="col-sm" style={{overflow: 'hidden', display: this.state.hideDownloadUrl ? "none" : "" }}>
              {data.downloadUrl}
            </th>
            <IconButton
              className="btn btn-info col-1"
              style={{
                width: "85%",
                display: this.state.hideDownloadUrl ? "none" : "",
              }}
              onClick={() => this.copyUrl(data)}
            >
              <micon.FileCopy style={{ color: "#000" }} />
            </IconButton>
          </tr>
        );
      });
    }
  }

  copyUrl(data) {
    navigator.clipboard.writeText(data.downloadUrl)
  }

  loadFilesInList(response){
    var that = this;
    var tempList = that.state.filesList;
    var downloadUrl =
        "http://localhost:3000/download/" + response.data.file_hash;
    var fileName = that.state.selectedFile.name;
    var hashId = response.data.file_hash;

    var obj = {
      fileName,
      downloadUrl,
      hashId,
    };
    tempList.push(obj);
    that.setState({ filesList: tempList });
  }

  addFile() {
    var that = this;
    const fileData = new FormData();
    fileData.append(
      "file",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

    if(Object.keys(that.state.userinfo).length === 0){
      uploadFile(fileData, "GEUST", 0).then((response) => {
        var status_code = response.data.hasOwnProperty('status_code')
        if(status_code) alert(response.data.detail)
        else {
          clearCache().then(res => {that.loadFilesInList(response)})
        }
      });
    } else{
      uploadFile(fileData, "USER", this.state.userinfo.user_id).then((response) => {
        var status_code = response.data.hasOwnProperty('status_code')
        if(status_code) alert(response.data.detail)
        else {
          clearCache().then(res => {that.loadFilesInList(response)})
        }
      });
    }

  }

  selectFile() {
    var that = this;
    this.setState({ selectedFile: event.target.files[0] });
  }

  createUser() {
    this.props.history.push({ pathname: "/registration" });
  }

  loginAction() {
    var that = this;
    var data = {
      username: that.state.username,
      password: that.state.password,
    };
    login(data).then((response) => {
      if (response.status === 200 && response.statusText === "OK") {
        this.props.history.push({
          pathname: "/adminpanel",
          state: { usertype: response.data },
        });
      }
    });
  }

  onChangeHandler(e, lblname) {
    if (lblname === "username") {
      this.setState({ username: e.target.value });
    } else {
      this.setState({ password: e.target.value });
    }
  }

  componentDidMount() {
    if(typeof this.props.location.state === 'undefined'){

    } else{
      this.setState({userType: this.props.location.state.userType, userinfo: this.props.location.state.userinfo})
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
              <div className="site-identity">
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
            className="container"
            style={{
              width: "500px",
              height: "200px",
              borderRadius: "15px",
              padding: "10px",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
          >
            <div className="form-group">
              <h3
                style={{
                  textShadow: "-4px 3px 2px rgba(162, 155, 254, 0.29)",
                  color: "#005f50",
                }}
              >
                Upload a file
              </h3>
              <input
                type="file"
                id="myFile"
                name="filename"
                onChange={this.selectFile}
              />
              <br />
              <br />
              <button className="btn btn-info add" onClick={this.addFile}>
                +
              </button>
            </div>
          </div>

        <div className="uploadTable table-wrapper-scroll-y my-custom-scrollbar" style={{display: this.state.filesList.length? '' : 'none'}}>
          <table className="table table-hover table-striped  table-bordered" >
            <thead style={{ backgroundColor: "#005f50", color: "#dff9fb" }}>
              <tr className="d-flex flex-nowrap" key={"user_key1"}>
                <th className="col-sm" scope="col" style={{ width: "20%" }}>
                  File Name
                </th>
                <th className="col-sm" scope="col" style={{ width: "70%", display: this.state.hideDownloadUrl ? 'none' : '' }}>
                  Download URL
                </th>
                <th className="col-1" scope="col" style={{ width: "10%", display: this.state.hideDownloadUrl ? 'none' : ''  }}></th>
              </tr>
            </thead>
            <tbody>{this.loadFillData()}</tbody>
          </table>
        </div>
        <button className="btn btn-info mr-2 cancel" onClick={this.backToUser} style={{display: this.state.userType ? '' : 'none'}}>
          Back
        </button>

        <button className="btn btn-info upload" onClick={this.uploadFile}>
          Upload
        </button>
          <div
            className="signupSigninLink"
            style={{ display: this.state.userType ? "none" : "" }}
          >
            <div className="login">
              <a style={{ width: "30%" }} onClick={this.loadLogin}>
                Login?
              </a>
            </div>
            <div className="signup">
              <a style={{ width: "30%" }} onClick={this.loadRegister}>
                Register
              </a>
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

export default withStyles(styles, { withTheme: true })(LandingPage);
