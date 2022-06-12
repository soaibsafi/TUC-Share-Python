import React from "react";
import { uploadFile } from "../api/utils";
import "./LandingPage.css";

import TextField from "@material-ui/core/TextField";

const redirectadminpath = "/adminpanel";
const redirectteacherpath = "/teacherpanel";
const redirectpupilpath = "/pupilpanel";

import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import * as micon from "@material-ui/icons";

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
      userType: "",
    };

    this.selectFile = this.selectFile.bind(this);
    this.addFile = this.addFile.bind(this);
    this.loadFillData = this.loadFillData.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.loadRegister = this.loadRegister.bind(this);
    this.loadLogin = this.loadLogin.bind(this);
    this.copyUrl = this.copyUrl.bind(this);
    this.backToUser = this.backToUser.bind(this);

    // this.loginAction = this.loginAction.bind(this);
    // this.onChangeHandler = this.onChangeHandler.bind(this);
    // this.createUser = this.createUser.bind(this);
  }

  backToUser() {
    this.props.history.push({ pathname: "/user" });
  }

  componentDidMount() {
    if (typeof this.props.location.state === "undefined") {
    } else {
      this.setState({ userType: this.props.location.state.userType });
      debugger;
    }
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
          <tr key={data.hashId}>
            <th>{data.fileName}</th>
            <th style={{ display: this.state.hideDownloadUrl ? "none" : "" }}>
              {data.downloadUrl}
            </th>
            <IconButton
              className="btn btn-info"
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
    debugger;
    console.log(data);
  }

  addFile() {
    var that = this;
    const fileData = new FormData();
    fileData.append(
      "file",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    uploadFile(fileData).then((response) => {
      console.log(response);
      var tempList = that.state.filesList;
      var downloadUrl = "http://localhost:3000/" + response.data.filehash;
      var fileName = that.state.selectedFile.name;
      var hashId = response.data.fileHash;

      var obj = {
        fileName,
        downloadUrl,
        hashId,
      };

      tempList.push(obj);
      that.setState({ filesList: tempList }, console.log(that.state.filesList));
    });
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
      console.log(response);
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

          <div className="uploadTable table-wrapper-scroll-y my-custom-scrollbar">
            <table className="table table-hover table-striped">
              <thead style={{ backgroundColor: "#005f50", color: "#dff9fb" }}>
                <tr key={"user_key1"}>
                  <th scope="col" style={{ width: "20%" }}>
                    File Name
                  </th>
                  <th scope="col" style={{ width: "70%" }}>
                    Download URL
                  </th>
                  <th scope="col" style={{ width: "10%" }}></th>
                </tr>
              </thead>
              <tbody>{this.loadFillData()}</tbody>
            </table>
          </div>
          <button
            className="btn btn-info upload"
            onClick={this.backToUser}
            style={{ display: this.state.userType ? "" : "none" }}
          >
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
