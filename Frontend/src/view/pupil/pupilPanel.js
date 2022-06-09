import React from "react";
import {checkUserType, getLoggedinUsername} from "../../api/APIUtils";
import Dropdown from "react-dropdown";
import {
  getClassname,
  getAllAssignedSubjects,
  getAllTests,
  getAllClasses,
} from "../../api/PupilAPI";

import PupilTestDetails from "./PupilTestDetails";
import '../../App.css';

import {withStyles} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import * as micon from '@material-ui/icons';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

const styles = theme => ({
  root: {},
  formControl: {
    // margin: theme.spacing(1),
    minWidth: '100%',
  },
});

const redirectpath = "/login";

const options = [
  {value: "ALL", label: "All Users"},
  {value: "Admin", label: "Admin"},
  {value: "Pupil", label: "Pupil"},
  {value: "Teacher", label: "Teacher"},
];

class pupilPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedClass:'',
      fullName: "",
      uid: this.props.location.state.uid,
      className: "",
      classId: "",
      allClasses: [],
      token: this.props.location.state
          ? "token " + this.props.location.state.token
          : "",
      subjectList: [],
      subjectTestDetailsList: [],
      showPopup: false,
      popupHeaderText: "",
    };

    this.logoutAction = this.logoutAction.bind(this);
    this.loadFillData = this.loadFillData.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.getLoggedInClassname = this.getLoggedInClassname.bind(this);
    this.getAllSUbjects = this.getAllSUbjects.bind(this);
    this.getAllTestResult = this.getAllTestResult.bind(this);
    this.getAllPupilClasses = this.getAllPupilClasses.bind(this);
  }

  componentDidMount() {
    var that = this;
    var pid = that.state.uid;
    var token = this.props.location.state
        ? this.props.location.state.token
        : "";
    if (token) {
      window.onpopstate = function (event) {
        that.props.history.go(1);
      };
    }
    checkUserType("token " + token).then((res) => {
      if (res) {
        if (res.status === "FAILED") that.props.history.push("/");
        else getLoggedinUsername(that.state.uid, "Token " + that.state.token).then(response => {
          that.setState({fullName: response.data["firstname"] + " " + response.data["lastname"]})
        })
      } else {
        that.props.history.push("/");
      }
    });
    that.getLoggedInClassname(pid, token);
    that.getAllPupilClasses(pid, token);
  }

  render() {
    var that = this;
    const {classes} = this.props;
    let optionItems = that.state.allClasses.map((op) =>
        <option key={op.value} aria-label={op.label} value={op.value}>{op.label}</option>
    );

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
              <h4 style={{color: '#8e44ad', textAlign: 'center', margin: '0px 0 10px 12.5%'}}>Achievement</h4>
              <div className="box-container">
                {/*<label>Please select a class to check your marks</label>*/}
                <div className='selection-area'>

                  {/*<Dropdown*/}
                  {/*    classname="style.dropDown"*/}
                  {/*    options={that.state.allClasses}*/}
                  {/*    onChange={that.getAllSUbjects}*/}
                  {/*    placeholder="Select a class"*/}
                  {/*    placeholderClassName="myPlaceholderClassName"*/}
                  {/*/>*/}

                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="outlined-age-native-simple">Class</InputLabel>
                    <Select
                        native
                        // value={that.state.testList[
                        //     this.getIndex(this.state.testList, this.state.selectedTest)
                        //     ]}
                        value={this.state.selectedClass}
                        onChange={(e) => this.getAllSUbjects(e)}
                        label="Tests">
                      <option aria-label="None" value=""/>
                      {optionItems}

                    </Select>
                  </FormControl>

                </div>
                <div className="ag-theme-alpine data-table">
                  <div className="table-scroll">
                    <table className="table table-hover table-striped">
                      <thead style={{backgroundColor: '#30336b', color:'#dff9fb'}}>
                      <tr key={"user_key1"}>
                        <th scope="col">Subject</th>
                        <th scope="col">Avg. Grade</th>
                        <th scope="col"></th>
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
            {that.state.showPopup ? (
                <PupilTestDetails
                    subjectTestDetailsList={that.state.subjectTestDetailsList}
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
    );
  }

  logoutAction() {
    var that = this;
    that.setState({token: ""}, () => {
      that.props.history.push({pathname: redirectpath});
    });
  }

  loadFillData() {
    if (this.state.subjectList.length) {
      return this.state.subjectList.map((data) => {
        if (data.avgGrade || data.sid || data.subjectname) {
          return (
              <tr key={data.sid}>
                <th>{data.subjectname}</th>
                <th>{data.avgGrade}</th>
                {/*<td>*/}
                {/*  {*/}
                {/*    <button*/}
                {/*        className="btn btn-info"*/}
                {/*        onClick={() => this.openDetailsPopup(data)}*/}
                {/*    >*/}
                {/*      View Details*/}
                {/*    </button>*/}
                {/*  }*/}
                {/*</td>*/}
                <td>{<IconButton className="btn btn-info" onClick={() => this.openDetailsPopup(data)}>
                  <micon.Info style={{color: "#22a6b3", frontSize: "30"}}/>
                </IconButton>}</td>
              </tr>
          );
        }
      });
    }
  }

  openDetailsPopup(data) {
    var that = this;
    that.setState({popupHeaderText: "Test Details for " + data.subjectname});
    getAllTests(data.sid, that.state.uid, that.state.token).then((data) => {
      that.setState(
          {
            subjectTestDetailsList: data.data,
          },
          () => {
            that.togglePopup();
          }
      );
    });
  }

  closePopup() {
    this.setState(
        {
          popupHeaderText: "",
          // subjectTestDetailsList:[]
        },
        () => {
          this.togglePopup();
        }
    );
  }

  togglePopup() {
    this.setState({showPopup: !this.state.showPopup});
  }

  getLoggedInClassname(pid, token) {
    var that = this;
    getClassname(pid, "Token " + token).then((data) => {

      if(data) {
        this.setState({className: data.classname, classId: data.cid}, () => { });
      }else{
        alert("You are not assigned to any class. So you can not logged in.");
        that.props.history.push("/");
      }
    });
  }


  getAllPupilClasses(pid, token) {
    var tempList = [];
    getAllClasses(pid, "Token " + token).then((data) => {
      data.forEach((info) => {
        var obj = {value: info.cid, label: info.classname};
        tempList.push(obj);
      });
      this.setState({allClasses: tempList});
    });
  }

  getAllSUbjects(sdata) {
    var that = this;
    var e = sdata ? sdata.target : {value: '', label: ''}
    var cid = e.value;
    var pid = this.state.uid;
    var token = this.state.token;
    that.setState({selectedClass:e.value}, () =>{
      getAllAssignedSubjects(pid, cid, token).then((data) => {
        that.setState({subjectList: data.data});
      });
    });

  }

  getAllTestResult(sid, pid, token) {
    getAllTests(sid, pid, "Token " + token).then((data) => {
      this.setState({subjectTestDetailsList: data.data});
    });
  }
}

export default withStyles(styles, {withTheme: true})(pupilPanel)
