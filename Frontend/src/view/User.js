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
    this.copyUrl = this.copyUrl.bind(this);
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
  }

  downloadFile(data){
     var downloadURL = "/download/" + data.file_hash
    this.props.history.push({ pathname: downloadURL , state:{userType: this.state.userInfo.user_type, userinfo: this.state.userInfo}});
  }

  removeFile(data){
    var that = this
    if(confirm("Are you sure you want to delete?")){
      deleteFile(data.file_id).then(res => {
        if(res.status === 200 && res.statusText === "OK"){
          alert("Your file has been removed successfully")
          that.loadFileList()
        }
      })
    }
  }

  uploadFile(){
    this.props.history.push({ pathname: "/upload", state:{userType: this.state.userInfo.user_type, userinfo: this.state.userInfo} });
  }

  logoutAction(){
    this.props.history.push({ pathname: "/" , state:{userType: "", userinfo: {}}});
  }

  loadFileList(){
    getFileList(this.state.userInfo.user_id).then(res => {
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

  copyUrl(url) {
    navigator.clipboard.writeText(url)
  }

  loadFillData() {
    if (this.state.fileList.length) {
      return this.state.fileList.map((data) => {
        var filename = data.file_name+data.file_type
        var filesize = data.file_size / 1024
        var size = filesize > 1023 ? filesize/1024 : filesize
        var sizeMatric = filesize > 1023 ? 'MB' : 'KB'
        var reqDT = new Date(data.upload_date_time)
        var requestDate = reqDT.toLocaleString()

        var status = ''
        if(data.status === "200" || data.status === "204") status = "Unblocked"
        else if(data.status === "210" || data.status === "201") status = "Blocked"

        var downloadURL = redirectpath + data.file_hash  ///http://localhost:3000/download/50ce455d63fde3c33d727ceab15f3577a62b6e567e26153a9b74064f9a9f8490
        return (
            <tr className="d-flex"  key={data.file_hash}>
              <td className="col-2">{filename}</td>
              <td className="col-1">{size.toFixed(2)} {sizeMatric}</td>
              <td className="col-2">{requestDate}</td>
              <td className="col-3">{downloadURL}</td>
              <td className="col-1">{status}</td>
              <td>{<IconButton className="btn btn-info col-sm" onClick={() => this.removeFile(data)}>
                <micon.RemoveCircle style={{color: "#000", frontSize: "100"}}/>
              </IconButton>}</td>
              <td>{<IconButton className="btn btn-info col-sm" onClick={() => this.downloadFile(data)}>
                <micon.CloudDownloadRounded style={{color: "#000", frontSize: "100"}}/>
              </IconButton>}</td>
              <td>{<IconButton className="btn btn-info col-sm" onClick={() => this.copyUrl(downloadURL)}>
                <micon.FileCopy style={{color: "#000", frontSize: "100"}}/>
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
              <div className="site-identity">
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
                <table className="table table-hover table-striped table-bordered">
                  <thead
                    style={{ backgroundColor: "#005f50", color: "#dff9fb" }}
                  >
                    <tr className="d-flex" key={"user_key1"}>
                      <th className="col-2" scope="col">File Name</th>
                      <th className="col-1" scope="col">Size</th>
                      <th className="col-2" scope="col">Upload Date & Time</th>
                      <th className="col-3" scope="col">Download URL</th>
                      <th className="col-1" scope="col">Status</th>
                      <th className="col-sm" scope="col"></th>
                      <th className="col-sm" scope="col"></th>
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

}

export default withStyles(styles, {withTheme: true})(userpanel);
