import React from 'react';
import '../App.css';
import './Admin.css'

import {checkFileStatus, blockFile, deleteRequest, unblockFile, getFileInfo, saveRequest} from "../api/utils";

const styles = theme => ({
  root: {},
  formControl: {
    minWidth: '100%',
  },
});

class BlockPopUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actionStatus: this.props.actionStatus,
      fileHash: this.props.fileHash,
      reason:'',
      fileInfo: this.props.fileInfo

    }

    this.handleChange=this.handleChange.bind(this);
    this.changeFileStatus=this.changeFileStatus.bind(this);
    this.loadFillData = this.loadFillData.bind(this);
    this.close = this.close.bind(this);
  }

  close() {
    var that = this
    that.props.closePopup();
  }

  reloadFileStatus(hash){
    var that = this
    that.close()
    that.props.checkStatus(hash)
  }

  changeFileStatus(){
    var filehash = this.state.fileHash
    var that = this

    if(this.state.reason.length !== 0){
      saveRequest(this.state.fileInfo.file_id, this.state.reason, this.state.actionStatus).then(res => {
        if(res.status === 200 && res.statusText === "OK") {
          alert("The request has been submitted successfully")
          that.reloadFileStatus(filehash)
        }
      })
    } else{
      alert("Please insert reason")
    }
  }

  checkDocStatus(hash){
    var that = this
    var url =  this.props.location.pathname
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

  handleChange(e){
    this.setState({reason: e.target.value})
  }

  loadFillData() {
    if (this.state.requestDetails.length) {
      return this.state.requestDetails.map(data => {
        var filename = data.file_name+data.file_type
        var filesize = data.file_size / 1024
        var size = filesize > 1023 ? filesize/1024 : filesize
        var sizeMatric = filesize > 1023 ? 'MB' : 'KB'
        var reqDT = new Date(data.upload_date_time)
        var requestDate = reqDT.toLocaleString()
        return (
            <div key={data.file_hash} className='reqDetailsLabel'>
              <label>File Name: {filename}</label>
              <br/>
              <label>Size: {size.toFixed(2)} {sizeMatric} </label>
              <br/>
              <label>Request Date: {requestDate} </label>
              <br/>
              <label>Reason: {data.reason} </label>
            </div>
        )
      })
    }
  }

  render() {
    const {classes} = this.props;

    return (
      <div className='popup'>
        <div className='App popup_inner'>
          <div className="custom_pop">
            <h2>Reason for {this.state.actionStatus}ing</h2>
            <br />
            <textarea value={this.state.reason} onChange={this.handleChange} />
            <div className="btn-group reqButton" role="group">
              <button className='btn reject mr-2' onClick={this.changeFileStatus}>{this.state.actionStatus}</button>
              <button className='btn btn-info cancel' onClick={this.close}>{"Close"}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default  (BlockPopUp);
