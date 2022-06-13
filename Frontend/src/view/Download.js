import React from "react";
import "./Download.css";
import { withStyles } from "@material-ui/core/styles";
import {
  getFileInfo,
  checkFileStatus,
  downloadFileAsGuest,
  clearCache,
  downloadFileAsUser,
  unblockFile, downloadInfo, blockFile, downloadAvailablity
} from "../api/utils";
import "./LandingPage.css";
import "./All.css";
import BlockPopUp from "./BlockPopUp";

var FileSaver = require('file-saver');

const donwloadhost = 'http://127.0.0.1:8000/'

const styles = (theme) => ({
  root: {},
});

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filehash:'',
      fileInfo:[],
      filename: '',
      filesize: 0,
      sizeMatric: '',
      requestDate:'',
      statusButtonName: '',
      downloadurl: '',
      isDisabled: false,
      hidePopup: true,
      url: this.props.location.pathname,
      userinfo: (typeof this.props.location.state === 'undefined') ? {} : this.props.location.state.userinfo,
      userType: (typeof this.props.location.state === 'undefined') ? {} :  this.props.location.state.userType
    };

    this.loadFillData = this.loadFillData.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.backToUser = this.backToUser.bind(this);
    // this.changeFileStatus = this.changeFileStatus.bind(this);
    this.openPopUp = this.openPopUp.bind(this);
    this.switchPopup = this.switchPopup.bind(this);
  }

  openPopUp(){
    this.switchPopup();
  }

  switchPopup() {
    this.setState({ hidePopup: !this.state.hidePopup });
  }

  checkDocStatus(hash){
    var that = this
    var url =  this.state.url

    checkFileStatus(hash).then(res => {
      if(res.status === 200 && res.statusText === 'OK'){
        if(res.data.fstatus === "Block"){
          that.setState({statusButtonName: 'Unblock', downloadurl: url, isDisabled: true})
        }else{
          that.setState({statusButtonName: 'Block', downloadurl: url, isDisabled: false})
        }
      }
      getFileInfo(hash).then(res => {
        ///TODO : error throwing
        if(res.status === 200 && res.statusText === "OK"){
          var data = res.data

          var filename = data.file_name + data.file_type
          var filesize = data.file_size / 1024
          var size = filesize > 1023 ? filesize/1024 : filesize
          var sizeMatric = filesize > 1023 ? 'MB' : 'KB'
          var reqDT = new Date(data.upload_date_time)
          var requestDate = reqDT.toLocaleString()

          that.setState({
            fileInfo: res.data,
            filehash: hash,
            filename: filename,
            filesize: size.toFixed(2),
            sizeMatric: sizeMatric,
            requestDate:requestDate,
          }, () => {
          })
        }
      })
    })
  }



  backToUser(){
    var that = this
    this.props.history.push({ pathname: '/user', state:{userType: that.state.userType, userinfo: that.state.userinfo}});
  }

  downloadFile(){
    var that = this
    if(Object.keys(that.state.userinfo).length !== 0 ){
        downloadFileAsUser(this.state.filehash, that.state.filename).then(res => {
          if (res.status === 200 && res.statusText === "OK") {
            let url = donwloadhost + "download/" + that.state.filehash + "/" + that.state.filename
            FileSaver.saveAs(url, that.state.filename);
            downloadInfo(this.state.filehash, 'USER', that.state.userinfo.user_id).then(res => {
              clearCache().then(res => {})
            })
          }
        })
    } else{
      downloadAvailablity(this.state.filehash).then(res => {
        if(res.data === "First Download" || res.data === "Allow Download"){
          downloadFileAsGuest(this.state.filehash, that.state.filename).then(res => {
              if (res.status === 200 && res.statusText === "OK") {
                let url = donwloadhost + "guestDownload/" + that.state.filehash + "/" + that.state.filename
                FileSaver.saveAs(url, that.state.filename);
                downloadInfo(this.state.filehash, 'GEUST', 0).then(res => {
                  clearCache().then(res => {})
                })
              }
          })
        }else{
          alert(res.data)
        }
      })

    }
  }

  componentDidMount() {
    var url =  this.props.location.pathname
    var hash = url.split('/')[2]
    var that = this

    this.checkDocStatus(hash)
  }

  loadFillData() {
    return (
      <div key={this.state.filehash} className="downloadDetailsLabel">
        <label>File Name: {this.state.filename}</label>
        <br />
        <label>
          Size: {this.state.filesize} {this.state.sizeMatric}{" "}
        </label>
        <br />
        <label>Upload Date: {this.state.requestDate} </label>
        <br />
      </div>
    );
  }

  render() {
    var those = this
    return (
      <div className="fill-window">
        <div
          style={{ width: "100%", backgroundColor: "#005f50", height: "60px" }}
        >
          <h1>TUC Share</h1>
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
              Download file
            </h3>
            {this.loadFillData()}
          </div>
        </div>

        <div className="btn-group reqButton" role="group">
          <button className="btn download mr-1" disabled={this.state.isDisabled} style={{display: Object.keys(this.state.userinfo).length === 0  ? 'none' : ''}} onClick={this.backToUser}>
            Back
          </button>
          <button className="btn download mr-1" disabled={this.state.isDisabled} onClick={this.downloadFile}>
            Download
          </button>

          <button className="btn block mr-1" onClick={this.openPopUp}>
            {this.state.statusButtonName}
          </button>
        </div>
        {!this.state.hidePopup ? (
            <BlockPopUp
                actionStatus={this.state.statusButtonName}
                fileHash={this.state.filehash}
                fileInfo={this.state.fileInfo}
                checkStatus={those.checkDocStatus}
                closePopup={this.switchPopup}
                {...this.props}
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
    );
  }
}

export default withStyles(styles, { withTheme: true })(LandingPage);
