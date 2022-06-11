import React from 'react'
import {getRequests } from "../api/utils";
// import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
//
// import UserTab from './Component/UserTab'
// import SubjectTab from './Component/SubjectTab'
// import PupilTab from './Component/PupilTab'

// import 'react-tabs/style/react-tabs.css';
// import ClassTable from './Component/ClassTable';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import * as micon from '@material-ui/icons';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import RequestDetailsPopup from "./RequestDetails";
import {getAllTests} from "../api/PupilAPI";

const styles = theme => ({
  root: {},
});

const redirectpath = '/login';

class adminPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      requestList: [],
      requestDetails: [],
      hidePopup:true,
      popupHeaderText: "Details"
    };

    this.loadFillData = this.loadFillData.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.switchPopup = this.switchPopup.bind(this);
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
    if (this.state.requestList.length) {
      return this.state.requestList.map((data) => {
          return (
              <tr key={data.req_id}>
                <th>{data.file_name}</th>
                <td>{<IconButton className="btn btn-info" onClick={() => this.openPopup(data)}>
                  <micon.Info style={{color: "#22a6b3", frontSize: "30"}}/>
                </IconButton>}</td>
              </tr>
          );
      });
    }
  }

  componentDidMount() {
    var that = this;
    var token = that.state.token;
    if (token) {
      window.onpopstate = function (event) {
        that.props.history.go(1);
      };
    }
    getRequests().then(res => {
      console.log(res)
      if (res.status === 200 && res.statusText === "OK") {
        this.setState({requestList: res.data})
      }
    });
  }

  render() {
    var that = this;
    var state = this.state;
    const {classes} = this.props;
    return (
        <div>
          <div className="fill-window">
            <div style={{width: "100%", backgroundColor: "#16a085", height: "60px"}}>
              <div className='main-title-area'
                   style={{}}>
                <h4 style={{color: '#ecf0f1'}}>Welcome {that.state.fullName}</h4>
                <h4 style={{color: '#ecf0f1'}}>Currently in: {that.state.className}</h4>
                {/*<button type="button" className="btn btn-danger" onClick={this.logoutAction}>Logout</button>*/}
                <IconButton aria-label="Logout" className={classes.margin} onClick={this.logoutAction}>
                  <micon.ExitToApp style={{ color: "#ecf0f1" , fontSize: 40 }}  />
                </IconButton>
              </div>
            </div>
            <div className='tab-area'>
              <h4 style={{marginTop: '20px', color: '#8e44ad'}}></h4>
              <p style={{color: '#008720'}}></p>
              <h4 style={{color: '#8e44ad', textAlign: 'center', margin: '0px 0 10px 12.5%'}}>Requests</h4>
              <div className="box-container">
                {/*<div className="ag-theme-alpine data-table">*/}
                  <div className="table-scroll">
                    <table className="table table-hover table-striped">
                      <thead style={{backgroundColor: '#30336b', color:'#dff9fb'}}>
                      <tr key={"user_key1"}>
                        <th scope="col">File Name</th>
                        <th scope="col"></th>
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
                    closePopup={that.closePopup}
                />
            ) : null}
            <div
                style={{width: "100%", backgroundColor: "#16a085", height: "25px", position: "fixed", bottom: "0", textAlign: "right"}}>
              <label style={{color: 'rgb(223, 230, 233)', paddingTop: '0px', textShadow: '-4px 3px 2px rgba(241, 196, 15, 0.29)'}}>You are logged in as pupil</label>
            </div>
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

export default withStyles(styles, {withTheme: true})(adminPanel);
