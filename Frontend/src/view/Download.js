import React from "react";
import "./Download.css";
import { withStyles } from "@material-ui/core/styles";
import {
  getFileInfo,
  checkFileStatus,
  downloadFileAsGuest,
  clearCache,
  downloadFileAsUser,
  unblockFile, deleteRequest, blockFile
} from "../api/utils";
import "./LandingPage.css";

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
      userinfo: (typeof this.props.location.state === 'undefined') ? {} : this.props.location.state.userinfo,
      userType: (typeof this.props.location.state === 'undefined') ? {} :  this.props.location.state.userType
    };

    this.loadFillData = this.loadFillData.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.backToUser = this.backToUser.bind(this);
    this.changeFileStatus = this.changeFileStatus.bind(this);
  }

  changeFileStatus(){
    var filehash = this.state.filehash

    if(this.state.statusButtonName === 'Unblock'){
      unblockFile(filehash).then(res => {
        debugger
        if(res.data.code === 204){
          deleteRequest(reqID).then(res => {
            alert("This file has been unblocked successfully")
            that.close()
          })
        }
      })
    } else{
      blockFile(filehash).then(res => {
        if(res.data.code === 210){ /// TODO : check the response code for hash creation
          deleteRequest(reqID).then(res => {
            alert("This file has been blocked successfully")
            that.close()
          })
        }
      })
    }
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
          clearCache().then(res => {})
        }
      })
    } else{
      downloadFileAsGuest(this.state.filehash, that.state.filename).then(res => {
        if (res.status === 200 && res.statusText === "OK") {
          let url = donwloadhost + "guestDownload/" + that.state.filehash + "/" + that.state.filename
          FileSaver.saveAs(url, that.state.filename);
          clearCache().then(res => {})
        }
      })
    }
  }

  componentDidMount() {
    var url =  this.props.location.pathname
    var hash = url.split('/')[2]
    var that = this


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


  copyUrl(data) {
  }

  render() {
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

          <button className="btn block mr-1" onClick={this.changeFileStatus}>
            {this.state.statusButtonName}
          </button>
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
    );
  }
}

export default withStyles(styles, { withTheme: true })(LandingPage);
