import React from "react";

import Dropdown from "react-dropdown";
import {
  getStudentMarkDetails,
  createNewTest,
  getTestDetails,
  checkResultID,
  uploadResult,
  deleteATest,
  updateResult,
  updateATest,
  getAvgMark
} from "../../api/TeacherAPI";

import {CSVReader} from "react-papaparse";

import "../../App.css";
import ManageTestPopup from "./ManageTestPopup";
import ManageStudentTestPopup from "./ManageStudentTestPopup";
import * as micon from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {withStyles} from "@material-ui/core/styles";
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

const buttonRef = React.createRef();

var redirectloginpath = "/teacherpanel"

class manageTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.location.state.token,
      uid: this.props.location.state.uid,
      subjectname: this.props.location.state.info.subjectname,
      sid: this.props.location.state.info.sid,
      cid: this.props.location.state.info.cid,
      classname: this.props.location.state.info.classname,
      testDetailsList: this.props.location.state.testList,
      testList: [],
      studentList: [],
      selectedTest: this.props.location.state.selectedTest,
      studentMarkData: [],
      selectedTestDT: this.props.location.state.selectedTestDT ? "Test Date: " + this.props.location.state.selectedTestDT : '',

      showTestPopup: false,
      showStudentGradePopup: false,
      showPopUp: false,

      popupHeaderText: '',
      popupBtnText: '',
      studentData: '',

      testResult: [],
      tid: "",
      testname: "",
      testdate: "",
      isAvgMarks: false,
    };

    this.getAllTests = this.getAllTests.bind(this);
    this.loadFillData = this.loadFillData.bind(this);
    this.onTestChange = this.onTestChange.bind(this);
    this.gotoBack = this.gotoBack.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.loadStudentList = this.loadStudentList.bind(this);

    this.toggleNewTestPopup = this.toggleNewTestPopup.bind(this);
    this.toggleStudentGradePopup = this.toggleStudentGradePopup.bind(this);

    this.openStudentTestGradeUpdatePopup =
        this.openStudentTestGradeUpdatePopup.bind(this);
    this.openNewTestPopup = this.openNewTestPopup.bind(this);
    this.openUpdatePopup = this.openUpdatePopup.bind(this);

    this.closeStudentGradePopup = this.closeStudentGradePopup.bind(this);
    this.closeTestPopup = this.closeTestPopup.bind(this);
    this.uploadTestResult = this.uploadTestResult.bind(this);
    this.updateInfo = this.updateInfo.bind(this);

    this.addTest = this.addTest.bind(this);
    this.setID = this.setID.bind(this);
    this.deleteInfo = this.deleteInfo.bind(this);
    this.updateTest = this.updateTest.bind(this);
    this.showAvgMarks = this.showAvgMarks.bind(this);
  }

  showAvgMarks() {
    var that = this;
    getAvgMark(that.state.sid, that.state.cid, "Token " + that.state.token).then(response => {
      that.setState({isAvgMarks: true, studentList: response.data, selectedTest: "", selectedTestDT: ''})
    })
  }

  setID() {
    return "RES" + Date.now();
  }

  uploadTestResult() {
    var that = this;
    var countRow = 0;
    if (this.state.studentMarkData.length) {
      this.state.studentMarkData.forEach((stdData, idx) => {
        checkResultID(stdData, "Tokenn " + that.state.token).then(
            (response) => {
              if (response.res.length) {
                stdData.rid = response.res[0].resid;
              } else {
                stdData.rid = that.setID() + idx;
              }

              uploadResult(stdData, "Token " + that.state.token).then(
                  (response) => {
                    if (response.status === "SUCCESS") {
                      that.loadStudentList();
                    }
                  }
              );
            }
        );
      });
    } else {
      alert("Please select a CSV file.");
    }
  }

  openUpdatePopup(data) {
    var that = this;
    if (this.state.selectedTest)
      that.setState(
          {
            popupHeaderText:
                "Update selected Test for " +
                that.state.classname +
                " - " +
                that.state.subjectname,
            popupBtnText: "Update",
          },
          () => {
            that.toggleNewTestPopup();
          }
      );
    else {
      alert("Please select a test")
    }
  }

  toggleNewTestPopup() {
    this.setState({showPopUp: !this.state.showPopUp});
  }

  closeTestPopup() {
    var that = this;
    that.setState(
        {
          popupHeaderText: "",
          popupBtnText: "",
        },
        () => {
          that.toggleNewTestPopup();
        }
    );
  }

  openNewTestPopup() {
    var that = this;
    that.setState({
      popupHeaderText: "Add A new Test for " + that.state.classname + " - " + that.state.subjectname,
      popupBtnText: "Add",
    }, () => {
      that.toggleNewTestPopup();
    })
  }

  toggleStudentGradePopup() {
    this.setState({showStudentGradePopup: !this.state.showStudentGradePopup})
  }

  closeStudentGradePopup() {
    var that = this;
    this.setState({
          popupHeaderText: '',
          popupBtnText: "",
          studentData: '',
        },
        () => {
          that.toggleStudentGradePopup();
        })
  }

  openStudentTestGradeUpdatePopup(data) {
    var that = this;
    that.setState({
      popupHeaderText: data.name + "'s test and grade update",
      popupBtnText: "Update",
      studentMarkData: data,

    }, () => {
      that.toggleStudentGradePopup();
    })
  }

  loadStudentList() {
    var that = this;
    getStudentMarkDetails(that.state.selectedTest, that.state.sid, that.state.cid, that.state.token).then(response => {
      if (response)
        if (response.data) {
          that.setState({studentList: response.data})
        }
    })
  }

  handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  handleOnRemoveFile = (data) => {
    var that = this;
    this.setState({studentMarkData: data ? data : []}, () => {
      console.log(that.state.studentMarkData);
    });
  };

  handleRemoveFile = (e) => {
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  handleOnFileLoad = (data) => {
    var that = this;
    var obj = [];
    if (data) {
      data.forEach((dt, idx) => {
        if (idx !== 0)
          obj.push({
            uid: dt.data[0],
            grade: dt.data[1],
            sid: that.state.sid,
            tid: that.state.selectedTest,
            rid: "",
          });
      });
    }
    this.setState({studentMarkData: obj}, () => {
      console.log(that.state.studentMarkData);
    });
  };

  handleOnError = (err, file, inputElem, reason) => {
  };

  componentDidMount() {
    this.getAllTests();
    this.loadStudentList();
  }

  render() {
    var that = this;
    const {classes} = this.props;
    let optionItems = that.state.testList.map((op) =>
        <option key={op.value} aria-label={op.label} value={op.value}>{op.label}</option>
    );

    return (
        <div>
          <div className="fill-window">
            <div style={{width: "100%", backgroundColor: "#16a085", height: "60px"}}>
              <div className='main-title-area'>
                <IconButton aria-label="Logout" className={classes.margin} onClick={this.gotoBack}>
                  <micon.ArrowBack style={{color: "#ecf0f1", fontSize: 40}}/>
                </IconButton>
                {/*<h3 style={{color: '#dff9fb'}}>Test Management*/}
                {/*  for {that.state.classname} ( {that.state.subjectname} )</h3>*/}
              </div>
            </div>
            <div className='tab-area'>
              <div className="subtitle-area" style={{}}>
                {/*<button className="btn btn-outline-success" onClick={this.gotoBack}>Back</button>*/}
                <h4 style={{color: '#8e44ad', textAlign: 'left', margin: '20px auto'}}>Test Management
                  for {that.state.classname} ( {that.state.subjectname} )</h4>
              </div>
              <div>
                <label style={{frontSize: '18px', fontStyle: 'italic', color: '#01a3a4',paddingBottom: '20px'}}>{this.state.selectedTestDT}</label>
              </div>
              <div className="box-container">
                <div className='selection-area'
                     style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <div>
                    {/*<Dropdown*/}
                    {/*    classname="style.dropDown"*/}
                    {/*    value={*/}
                    {/*      that.state.testList[*/}
                    {/*          this.getIndex(this.state.testList, this.state.selectedTest)*/}
                    {/*          ]*/}
                    {/*    }*/}
                    {/*    options={that.state.testList}*/}
                    {/*    onChange={this.onTestChange}*/}
                    {/*    placeholder="Select a test"*/}
                    {/*    placeholderClassName="myPlaceholderClassName"*/}
                    {/*/>*/}

                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel htmlFor="outlined-age-native-simple">Tests</InputLabel>
                      <Select
                          native
                          // value={that.state.testList[
                          //     this.getIndex(this.state.testList, this.state.selectedTest)
                          //     ]}
                          value={this.state.selectedTest}
                          onChange={(e) => this.onTestChange(e)}
                          label="Tests">
                        {/*<option aria-label="None" value=""/>*/}
                        {optionItems}

                      </Select>
                    </FormControl>
                    <button className="btn btn-outline-success" onClick={this.openNewTestPopup}> Add</button>
                    <button
                        className="btn btn-outline-info"
                        onClick={() => this.openUpdatePopup(that.state.classinfo)}
                    >
                      Update
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => this.deleteInfo(that.state.selectedTest)}
                    >
                      Delete
                    </button>
                    <button
                        className="btn btn-outline-info"
                        onClick={() => this.showAvgMarks(that.state.selectedTest)}
                    >
                      View Avg. Marks
                    </button>
                  </div>
                  <div className="upload-area">
                    <table>
                      <tr>
                        <CSVReader
                            noClick
                            noDrag
                            ref={buttonRef}
                            onFileLoad={this.handleOnFileLoad}
                            onError={this.handleOnError}
                            onRemoveFile={this.handleOnRemoveFile}
                        >

                          {({file}) => (
                              <aside style={{}}>
                                <td><IconButton aria-label="Logout" className={classes.margin}
                                                onClick={this.handleOpenDialog}>
                                  <micon.FolderOpen style={{color: "#f0932b", fontSize: 25}}/>
                                </IconButton></td>
                                <td><IconButton aria-label="Logout" className={classes.margin}
                                                onClick={this.handleRemoveFile}>
                                  <micon.Delete style={{color: "#eb4d4b", fontSize: 25}}/>
                                </IconButton></td>
                                <tr>
                                  <td colSpan="2">{file && file.name}</td>
                                </tr>
                                {/*<button id="browse" type="button" onClick={this.handleOpenDialog}> Browse file</button>*/}
                                {/*<button id="delete" onClick={this.handleRemoveFile}> Remove</button>*/}

                              </aside>
                          )}
                        </CSVReader>
                        {/*<button className="btn btn-danger" onClick={this.uploadTestResult}>*/}
                        {/*  Upload*/}
                        {/*</button>*/}
                        <td>
                          <IconButton aria-label="Logout" className={classes.margin} onClick={this.uploadTestResult}>
                            <micon.CloudUpload style={{color: "#48dbfb", fontSize: 25}}/>
                          </IconButton>
                          <tr><td>&nbsp;&nbsp;&nbsp;</td></tr>
                        </td>

                      </tr>
                    </table>
                  </div>
                </div>

                {that.state.studentList.length ? (
                    <div className="ag-theme-alpine data-table">
                      <div className="table-scroll">
                        <table className="table table-hover table-striped">
                          <thead style={{backgroundColor: '#30336b', color: '#dff9fb'}}>
                          <tr key={"user_key1"}>
                            <th scope="col">Student Name</th>
                            <th scope="col">{that.state.isAvgMarks ? "Avg.Marks" : "Grade"}</th>
                            {that.state.isAvgMarks ? "" : <th scope="col">Action</th>}
                          </tr>
                          </thead>
                          <tbody>{this.loadFillData()}</tbody>
                        </table>
                      </div>
                    </div>
                ) : (
                    <div>
                      <label>No student is in this class and test</label>
                    </div>
                )}
                {that.state.showPopUp ? (
                    <ManageTestPopup
                        testList={that.state.testList}
                        selectedTest={that.state.selectedTest}
                        popupHeaderText={that.state.popupHeaderText}
                        testDetailsList={that.state.testDetailsList}
                        sid={that.state.sid}
                        popupBtnText={that.state.popupBtnText}
                        updateTest={that.updateTest}
                        addTest={that.addTest}
                        closePopup={that.closeTestPopup}
                    />
                ) : null}

                {that.state.showStudentGradePopup ? (
                    <ManageStudentTestPopup
                        testList={that.state.testList}
                        selectedTest={that.state.selectedTest}
                        popupHeaderText={that.state.popupHeaderText}
                        studentData={that.state.studentData}
                        popupBtnText={that.state.popupBtnText}
                        studentMarkData={that.state.studentMarkData}
                        //        addUser={that.addUser}
                        updateInfo={that.updateInfo}
                        closePopup={that.closeStudentGradePopup}
                    />
                ) : null}
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

  getIndex(arr, testVal) {
    return arr.findIndex((obj) => obj.value === testVal);
  }

  gotoBack() {
    this.props.history.push({
      pathname: redirectloginpath,
      state: {token: this.state.token, uid: this.state.uid},
    });
  }

  onTestChange(e) {
    var data = e.target ? e.target : {value: "", label: ""}
    var that = this;
    var testInfo = that.state.testDetailsList.filter(it => it.tid === data.value)
    this.setState({selectedTest: data.value, isAvgMarks: false, selectedTestDT: "Test Date: " +  testInfo[0]["testdate"].slice(0, 10)}, () => {
      that.loadStudentList();
    });
  }

  loadFillData() {
    if (this.state.studentList.length) {
      return this.state.studentList.map((data, idx) => {
        return (
            <tr key={data.username + idx}>
              <td>{data.name}</td>
              <td>{this.state.isAvgMarks ? data.avgGrade : data.marks}</td>
              {/*{this.state.isAvgMarks ? "" : <td>*/}
              {/*  {<button className="btn btn-info"*/}
              {/*           onClick={() => this.openStudentTestGradeUpdatePopup(data)}>Change</button>}*/}
              {/*</td>}*/}

              {this.state.isAvgMarks ? "" :
                  <td>{<IconButton className="btn btn-info" onClick={() => this.openStudentTestGradeUpdatePopup(data)}>
                    <micon.Cached style={{color: "#22a6b3", frontSize: "30"}}/>
                  </IconButton>}</td>}
            </tr>
        );
      });
    }
  }

  getAllTests() {
    var tempList = [];
    var that = this;

    that.state.testDetailsList.forEach((info) => {
      var obj = {value: info.tid, label: info.testname};
      tempList.push(obj);
    });

    that.setState({testList: tempList}, () => {
    });
  }

  addTest(data) {
    var that = this;
    console.log(that.state.token);

    createNewTest(data, "Token " + that.state.token).then((data) => {
      if (data.status === "SUCCESS") {
        that.toggleNewTestPopup();
        that.setState({testList: []}, () => {
          getTestDetails(that.state.sid, "Token " + that.props.token).then(
              (response) => {
                that.setState({testDetailsList: response.data}, () => {
                  that.getAllTests();
                });
              }
          );
        });
      } else {
        // alert("Error!!");
      }
    });

  }

  updateTest(data) {
    var that = this;
    updateATest(data, "Token " + that.state.token).then((response) => {
      if (response.status === "SUCCESS") {
        that.toggleNewTestPopup();
        that.setState({testList: [], selectedTestDT: "Test Date: " +  data.testdate}, () => {
          getTestDetails(that.state.sid, "Token " + that.props.token).then(
              (response) => {
                that.setState({testDetailsList: response.data}, () => {
                  that.getAllTests();
                });
              }
          );
        });
      } else {
        alert("Error!!");
      }
    });
  }

  deleteInfo(data) {
    var that = this;
    console.log(data);
    if (this.state.selectedTest) {
      if (!window.confirm("Do you really want to delete the class?")) return;
      deleteATest(data, "Token " + that.state.token).then((data) => {
        alert(data.message);
        if (data.status === "SUCCESS") {
          that.setState({testList: []}, () => {
            getTestDetails(that.state.sid, "Token " + that.props.token).then(
                (response) => {
                  that.setState({testDetailsList: response.data, selectedTest: null}, () => {
                    that.getAllTests();
                  });
                }
            );
          });
        } else {
          alert("Error!!");
        }
      });
    } else {
      alert("Please select a test to delete")
    }
  }

  updateInfo(data) {
    var that = this;
    var result = {
      rid: data.resid,
      sid: this.state.sid,
      tid: this.state.selectedTest,
      uid: data.uid,
      grade: data.marks,
    };
    updateResult(result, that.state.token).then((response) => {
      console.log(response);
      if (response.status === "SUCCESS") {
        that.toggleStudentGradePopup();
        that.setState({}, () => {
          that.loadStudentList();
        });
      } else {
        alert(response.message);
      }
    });
  }
}

export default withStyles(styles, {withTheme: true})(manageTest);
