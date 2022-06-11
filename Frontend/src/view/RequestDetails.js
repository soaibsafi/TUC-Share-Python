import React from 'react';
import '../App.css';
import {withStyles} from "@material-ui/core/styles";

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
  }

  approve(){

  }

  close() {
    this.props.closePopup();
  }

  loadFillData() {
    if (this.state.requestDetails.length) {

      return this.state.requestDetails.map(data => {
        console.log(data)
        var filesize = data.file_size / 1024
        var size = filesize > 1023 ? filesize/1024 : filesize
        var sizeMatric = filesize > 1023 ? 'MB' : 'KB'
        var reqDT = new Date(data.upload_date_time)
        var requestDate = reqDT.toLocaleString()
        // debugger
        return (
            <div>
              <label>File Name: {data.file_name}</label>
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
            <div className="popup-button-area">
              <button className='btn btn-outline-primary' onClick={this.approve}>{"Approve"}</button>
              <button className='btn btn-outline-danger' onClick={this.close}>{"Reject"}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default  (RequestDetails);
