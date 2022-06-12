import React from 'react'
import {getFileList, deleteFile} from "../api/utils";
import './Admin.css'

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import * as micon from '@material-ui/icons';
import RequestDetailsPopup from "./RequestDetails";

const styles = theme => ({
  root: {},
});

const redirectpath = 'http://localhost:3000/download/';

class userpanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileList:[],

      requestList: [],
      requestDetails: [],
      hidePopup:true,
      popupHeaderText: "Details",
      userInfo: this.props.location.state.userinfo
    };

    this.loadFillData = this.loadFillData.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.downloadFile = this.downloadFile.bind(this);

    this.openPopup = this.openPopup.bind(this);
    this.switchPopup = this.switchPopup.bind(this);
    this.loadFileList = this.loadFileList.bind(this);
    this.logoutAction = this.logoutAction.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {
    var that = this;
    var token = that.state.token;
    if(typeof this.props.location.state === 'undefined'){
      that.loadFileList()
    } else {
      that.setState({userInfo: that.props.location.state.userinfo}, () => {
        that.loadFileList()
      })
    }

    /// TODO : need to check this snipet
    /*
    if (token) {
      window.onpopstate = function (event) {
        that.props.history.go(1);
      };
    }*/

  }

  downloadFile(data){
     var downloadURL = "/download/" + data.file_hash
    this.props.history.push({ pathname: downloadURL , state:{userType: this.state.userInfo.user_type, userinfo: this.state.userInfo}});
  }

  removeFile(data){
    if(confirm("Are you sure you want to delete?")){
      deleteFile(data.file_id).then(res => {
        if(res.status === 200 && res.statusText === "OK"){
          alert("Your file has been removed successfully")
        }
      })
    }
  }

  uploadFile(){
    this.props.history.push({ pathname: "/upload", state:{userType: this.state.userInfo.user_type, userinfo: this.state.userInfo} });
  }

  logoutAction(){
    debugger
    this.props.history.push({ pathname: "/" , state:{userType: ""}});
  }

  loadFileList(){
    getFileList(this.state.userInfo.user_id).then(res => {
      console.log(res)
      if (res.status === 200 && res.statusText === "OK") {
        this.setState({fileList: res.data[0]})
      }
    });
  }

  switchPopup(){
    this.setState({hidePopup: !this.state.hidePopup});
  }

  openPopup(data) {

    var that = this;
    var list = [data];
    this.setState({requestDetails: [data]}, () =>{that.switchPopup()})
  }

  loadFillData() {
    // debugger
    if (this.state.fileList.length) {
      return this.state.fileList.map((data) => {
        // console.log(data)
        var filename = data.file_name+data.file_type
        var filesize = data.file_size / 1024
        var size = filesize > 1023 ? filesize/1024 : filesize
        var sizeMatric = filesize > 1023 ? 'MB' : 'KB'
        var reqDT = new Date(data.upload_date_time)
        var requestDate = reqDT.toLocaleString()

        var downloadURL = redirectpath + data.file_hash  ///http://localhost:3000/download/50ce455d63fde3c33d727ceab15f3577a62b6e567e26153a9b74064f9a9f8490
        return (
            <tr key={data.file_hash}>
              <td>{filename}</td>
              <td>{size.toFixed(2)} {sizeMatric}</td>
              <td>{requestDate}</td>
              <td>{downloadURL}</td>
              <td>{data.status}</td>
              <td>{<IconButton className="btn btn-info" onClick={() => this.removeFile(data)}>
                <micon.RemoveCircle style={{color: "#000", frontSize: "100"}}/>
              </IconButton>}</td>
              <td>{<IconButton className="btn btn-info" onClick={() => this.downloadFile(data)}>
                <micon.CloudDownloadRounded style={{color: "#000", frontSize: "100"}}/>
              </IconButton>}</td>
            </tr>
        );
      });
    }
  }

  render() {
    var that = this;
    var state = this.state;
    const {classes} = this.props;
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
                <h1 style={{ color: "#ecf0f1" }}>
                  TUC Share {that.state.fullName}
                </h1>
              </div>
              <h4 style={{ color: "#ecf0f1" }}>User Portal</h4>
              <div className="btn-group reqButton" role="group">
                <IconButton
                  aria-label="Logout"
                  className={classes.margin}
                  onClick={this.uploadFile}
                >
                  <micon.CloudUpload
                    style={{ color: "#ecf0f1", fontSize: 40 }}
                  />
                </IconButton>
                <IconButton
                  aria-label="Logout"
                  className={classes.margin}
                  onClick={this.logoutAction}
                >
                  <micon.ExitToApp style={{ color: "#ecf0f1", fontSize: 40 }} />
                </IconButton>
              </div>
            </div>
          </div>

          <div className="form-group">
            <h4 className="reqTitle">File List</h4>
            {/* <h4 style={{color: '#8e44ad', textAlign: 'center', margin: '0px 0 10px 12.5%'}}>Requests</h4> */}
            <div className="box-container">
              {/*<div className="ag-theme-alpine data-table">*/}
              <div className="table-scroll requestTable">
                <table className="table table-hover table-striped">
                  <thead
                    style={{ backgroundColor: "#005f50", color: "#dff9fb" }}
                  >
                    <tr key={"user_key1"}>
                      <th scope="col">File Name</th>
                      <th scope="col">Size</th>
                      <th scope="col">Upload Date & Time</th>
                      <th scope="col">Download URL</th>
                      <th scope="col">Block Status</th>
                      <th scope="col">Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.loadFillData()}
                    </tbody>
                  </table>
                </div>
                {/*</div>*/}
              </div>
            </div>
            {!that.state.hidePopup ? (
                <RequestDetailsPopup
                    requestDetails={that.state.requestDetails}
                    popupHeaderText={that.state.popupHeaderText}
                    reloadList={this.loadFileList}
                    closePopup={that.switchPopup}
                />
            ) : null}
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
    )
  }

  // logoutAction() {
  //   var that = this;
  //   that.setState({token: ''},
  //       () => {
  //         that.props.history.push({pathname: redirectpath});
  //       })
  // }
  //
  // tabSelectionAction(idx) {
  //   this.setState({selectedTab: idx})
  // }
}

export default withStyles(styles, {withTheme: true})(userpanel);
