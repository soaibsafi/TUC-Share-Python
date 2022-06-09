import React from "react";
import {checkUserType, getLoggedinUsername} from "../../api/APIUtils";
import { getSubjectDetails, getTestDetails } from "../../api/TeacherAPI";
import "react-tabs/style/react-tabs.css";
import {withStyles} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import * as micon from '@material-ui/icons';

const styles = theme => ({
  root: {},
});

var redirectpath = '/manageTestpanel';
const redirectloginpath = "/login";

class teacherPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fullName:"",
      tid: this.props.location.state.uid,
      subjectsDetails: [],
      token: this.props.location.state ? this.props.location.state.token : "",
    };
    this.loadFillData = this.loadFillData.bind(this);
    this.logoutAction = this.logoutAction.bind(this);
    this.tabSelectionAction = this.tabSelectionAction.bind(this);
    this.getAllSUbjectsOfTeacher = this.getAllSUbjectsOfTeacher.bind(this);
    this.openTestManager = this.openTestManager.bind(this);
  }

  componentDidMount() {
    var that = this;
    var tid = that.state.tid;
    var token = that.state.token;
    if (token) {
      window.onpopstate = function (event) {
        that.props.history.go(1);
      };
    }
    checkUserType("token " + token).then((res) => {
      if (res) {
        if (res.status === "FAILED") that.props.history.push("/");
        else getLoggedinUsername(that.state.tid, "Token "+ that.state.token).then(response => {
          that.setState({fullName: response.data["firstname"] +" " + response.data["lastname"]})
        })
      }
      else {
        that.props.history.push("/");

      }
    });
    that.getAllSUbjectsOfTeacher(tid, token);
  }

  render() {
    var that = this;
    const {classes} = this.props;

    return (
      <div>
        <div className="fill-window">
          <div style={{width: "100%", backgroundColor: "#16a085", height: "60px"}}>
          <div className='main-title-area'>
            {/*<h3 style={{ color: '#6e6e6e' }}>Teacher Panel</h3>*/}
            {/*<button type="button" className="btn btn-danger" onClick={this.logoutAction}>Logout</button>*/}
            {/*<h3 style={{color: '#ecf0f1'}}>Welcome Teacher</h3>*/}
            <h4 style={{color: '#ecf0f1'}}>Welcome {that.state.fullName}</h4>
            {/*<button type="button" className="btn btn-danger" onClick={this.logoutAction}>Logout</button>*/}
            <IconButton aria-label="Logout" className={classes.margin} onClick={this.logoutAction}>
              <micon.ExitToApp style={{ color: "#ecf0f1" , fontSize: 40 }}  />
            </IconButton>
          </div>
          </div>
          <div className='tab-area'>
            <h4 style={{ color: '#8e44ad', textAlign: 'center', margin: '20px auto' }}>Manage Test</h4>
            <div className="box-container" style={{justifyContent: 'center' }}>

              <div className="ag-theme-alpine data-table">
                <div className="table-scroll">
                  <table className="table table-hover table-striped">
                    <thead style={{backgroundColor: '#30336b', color:'#dff9fb'}}>
                      <tr key={"user_key1"}>
                        <th scope="col">Class</th>
                        <th scope="col">Subjects</th>
                        <th scope="col">Manage Test</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.loadFillData()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div
              style={{width: "100%", backgroundColor: "#16a085", height: "25px", position: "fixed", bottom: "0", textAlign: "right"}}>
            <label style={{color: 'rgb(223, 230, 233)', paddingTop: '0px', textShadow: '-4px 3px 2px rgba(241, 196, 15, 0.29)'}}>You are logged in as teacher</label>
          </div>
        </div>
      </div>
    );
  }

  loadFillData() {
    var that = this;
    if (that.state.subjectsDetails.length) {
      return this.state.subjectsDetails.map((data, idx) => {
        return (
          <tr key={data.sid}>
            <th>{data.classname}</th>
            <th>{data.subjectname}</th>
            {/*<td>{<button className="btn btn-info" onClick={() => this.openTestManager(data)}>Manage</button>}</td>*/}
            <td>{<IconButton className="btn btn-info" onClick={() => this.openTestManager(data)}>
              <micon.Settings style={{color: "#22a6b3", frontSize: "30"}}/>
            </IconButton>}</td>
          </tr>
        );
      });
    }
  }

  openTestManager(data) {
    var that = this;
    getTestDetails(data.sid, that.state.token).then(response => {
      var testInfo = response.data.filter(it => it.tid === response.data[0].tid);
      that.props.history.push({
        pathname: redirectpath,
        state: {
          info: data,
          token: that.state.token,
          uid: that.state.tid,
          testList: response.data,
          selectedTest: response.data.length ? response.data[0].tid : null,
          selectedTestDT: testInfo.length ? testInfo[0]["testdate"].slice(0, 10) : ''
        }
      })
    })
  }

  logoutAction() {
    var that = this;
    that.setState({ token: "" }, () => {
      that.props.history.push({ pathname: redirectloginpath });
    });
  }

  tabSelectionAction(idx) {
    this.setState({ selectedTab: idx });
  }

  getAllSUbjectsOfTeacher(tid, token) {
    getSubjectDetails(tid, "Token " + token).then((data) => {
      this.setState({ subjectsDetails: data.data });
    });
  }
}

export default withStyles(styles, {withTheme: true})(teacherPanel);
