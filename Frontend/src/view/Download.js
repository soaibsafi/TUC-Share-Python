import React from "react";
import { getFileInfo } from "../api/utils";
import "./LandingPage.css";
// import {useLocation} from 'react-router-dom'

import TextField from "@material-ui/core/TextField";

const redirectadminpath = "/adminpanel";
const redirectteacherpath = "/teacherpanel";
const redirectpupilpath = "/pupilpanel";


import {withStyles} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import * as micon from '@material-ui/icons';

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

      username: "",
      password: "",
      selectedFile: null,
      filesList: [],
      uploadFile: "",
      hideDownloadUrl: true,
    };

    this.loadFillData = this.loadFillData.bind(this);
    this.copyUrl = this.copyUrl.bind(this);

    // this.loginAction = this.loginAction.bind(this);
    // this.onChangeHandler = this.onChangeHandler.bind(this);
    // this.createUser = this.createUser.bind(this);
  }

  componentDidMount() {
    var url =  this.props.location.pathname
    var hash = url.split('/')[2]
    var that = this
    getFileInfo(hash).then(res => {
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
          // debugger
          // console.log(that.state.fileInfo)
          that.loadFillData()
        })
      }
    })
  }

  loadFillData() {
    // var filename = data.file_name + data.file_type
    // var filesize = data.file_size / 1024
    // var size = filesize > 1023 ? filesize/1024 : filesize
    // var sizeMatric = filesize > 1023 ? 'MB' : 'KB'
    // var reqDT = new Date(data.upload_date_time)
    // var requestDate = reqDT.toLocaleString()
    return (
        <div key={this.state.filehash} className='reqDetailsLabel'>
          <label>File Name: {this.state.filename}</label>
          <br/>
          <label>Size: {this.state.filesize} {this.state.sizeMatric} </label>
          <br/>
          <label>Request Date: {this.state.requestDate} </label>
          <br/>
        </div>
    )
  }


  copyUrl(data) {
    debugger;
    console.log(data);
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
              <h3 style={{textShadow: '-4px 3px 2px rgba(162, 155, 254, 0.29)', color: '#005f50'}}>Download file</h3>
              <br />
              <br />
              {console.log("hi")}
              {console.log(this.state.fileInfo)}
              {this.loadFillData()}
            </div>
          </div>

          <button className="btn btn-info upload" onClick={this.uploadFile}>
            Download
          </button>
          <br/>

          <button className="btn btn-info upload" onClick={this.uploadFile}>
            Block
          </button>

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
