import React from 'react'
import {checkUserType, getLoggedinUsername } from "../../api/APIUtils";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import UserTab from './Component/UserTab'
import SubjectTab from './Component/SubjectTab'
import PupilTab from './Component/PupilTab'

import 'react-tabs/style/react-tabs.css';
import ClassTable from './Component/ClassTable';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import * as micon from '@material-ui/icons';

const styles = theme => ({
  root: {},
});

const redirectpath = '/login';

class adminPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // token: this.props.location.state ? this.props.location.state.token : '',
      // uid: this.props.location.state ? this.props.location.state.uid : '',
      // selectedTab: 0,
      // fullName:"",
    };

    this.logoutAction = this.logoutAction.bind(this);
    this.tabSelectionAction = this.tabSelectionAction.bind(this);
    this.setFullName = this.setFullName.bind(this);
  }

  setFullName(fname, lname){
    this.setState({fullName: fname + " "+ lname})
  }

  componentDidMount() {
    var that = this;
    var token = that.state.token;
    if (token) {
      window.onpopstate = function (event) {
        that.props.history.go(1);
      };
    }
    // checkUserType('token ' + token).then(res => {
    //   if (res.status === "FAILED") that.props.history.push("/login");
    //   else getLoggedinUsername(that.state.uid, "Token "+ that.state.token).then(response => {
    //     that.setState({fullName: response.data["firstname"] +" " + response.data["lastname"]})
    //   })
    // });
  }

  render() {
    var that = this;
    var state = this.state;
    const {classes} = this.props;
    return (
        <div className="fill-window">
          <div style={{width: "100%", backgroundColor: "#16a085", height: "60px"}}>
            <div className='main-title-area'>
              {/*<h3 style={{color: '#ecf0f1'}}> Admin</h3>*/}
              <h4 style={{color: '#ecf0f1'}}>Welcome {that.state.fullName}</h4>
              {/*<button type="button" className="btn btn-danger" onClick={this.logoutAction}>Logout</button>*/}
              <IconButton aria-label="Logout" className={classes.margin} onClick={this.logoutAction}>
                <micon.ExitToApp style={{ color: "#ecf0f1" , fontSize: 40 }}  />
              </IconButton>
            </div>
          </div>
          {/*<div className='tab-area'>*/}
          {/*  <Tabs selectedIndex={state.selectedTab} onSelect={index => that.tabSelectionAction(index)}>*/}
          {/*    <TabList>*/}
          {/*      /!*<Tab>User</Tab>*!/*/}
          {/*      <Tab><IconButton><micon.Person  style={{color: "#22a6b3", frontSize: "30"}}/></IconButton></Tab>*/}
          {/*      <Tab><IconButton><micon.Class style={{color: "#22a6b3", frontSize: "30"}}/></IconButton></Tab>*/}
          {/*      <Tab><IconButton><micon.Subject style={{color: "#22a6b3", frontSize: "30"}}/></IconButton></Tab>*/}
          {/*      <Tab><IconButton><micon.PeopleAlt style={{color: "#22a6b3", frontSize: "30"}}/></IconButton></Tab>*/}
          {/*    </TabList>*/}
          {/*    <TabPanel>*/}
          {/*      <UserTab token={state.token} uid={state.uid} setFullName={that.setFullName}/>*/}
          {/*    </TabPanel>*/}
          {/*    <TabPanel>*/}
          {/*      <ClassTable token={state.token}/>*/}
          {/*    </TabPanel>*/}
          {/*    <TabPanel>*/}
          {/*      <SubjectTab token={state.token}/>*/}
          {/*    </TabPanel>*/}
          {/*    <TabPanel>*/}
          {/*      <PupilTab token={state.token}/>*/}
          {/*    </TabPanel>*/}
          {/*  </Tabs>*/}
          {/*</div>*/}
          <div
              style={{width: "100%", backgroundColor: "#16a085", height: "25px", position: "fixed", bottom: "0", textAlign: "right"}}>
            <label style={{color: 'rgb(223, 230, 233)', paddingTop: '0px', textShadow: '-4px 3px 2px rgba(241, 196, 15, 0.29)'}}>You are logged in as admin</label>
          </div>
        </div>
    )
  }

  logoutAction() {
    var that = this;
    that.setState({token: ''},
        () => {
          that.props.history.push({pathname: redirectpath});
        })
  }

  tabSelectionAction(idx) {
    this.setState({selectedTab: idx})
  }
}

export default withStyles(styles, {withTheme: true})(adminPanel);
