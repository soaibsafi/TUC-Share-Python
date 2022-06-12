import React from 'react';
import '../App.css';
import './Admin.css'

import {checkFileStatus, blockFile, deleteRequest} from "../api/utils";

const styles = theme => ({
  root: {},
  formControl: {
    // margin: theme.spacing(1),
    minWidth: '100%',
  },
});

class RequestDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      requestDetails: this.props.requestDetails,
     // popupHeaderText: this.props.popupHeaderText
    }
    this.loadFillData = this.loadFillData.bind(this);
    this.close = this.close.bind(this);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }

  approve(){
    var that = this
    var hashid = this.state.requestDetails[0].file_hash
    var reqID = this.state.requestDetails[0].req_id

    checkFileStatus(hashid).then(res => {
      if(res.status === 200 && res.statusText === 'OK'){
        if(res.data.filestatus === "Blocked"){
          blockFile(hashid).then(res => {
            if(res.data.code === 210){
              deleteRequest(reqID).then(res => {
                alert("This file has been blocked successfully")
                that.close()
              })
            }
          })
        }
      }
    })
  }

  reject(){
    var that = this
    var reqID = this.state.requestDetails[0].req_id

    deleteRequest(reqID).then(res => {
      alert("This file has been rejected successfully")
      that.close()
    })
  }

  close() {
    var that = this
    that.props.closePopup();
    that.props.reloadList();
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
            <h2>Request Details</h2>
            <br />
            <div className="ag-theme-alpine" >
              {this.loadFillData()}
            </div>
            <div className="btn-group reqButton" role="group">
              <button className='btn mr-2 approve' onClick={this.approve}>{"Approve"}</button>
              <button className='btn reject mr-2' onClick={this.reject}>{"Reject"}</button>
              <button className='btn btn-info cancel' onClick={this.close}>{"Close"}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default  (RequestDetails);
