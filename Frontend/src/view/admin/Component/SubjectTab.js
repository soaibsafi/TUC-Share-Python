import React from 'react';
import Dropdown from "react-dropdown";
import {
  getUsersByRole,
  getAllClassWithRemoved,
  getSubjectClassTeacherTogether,
  checkSubjectExists,
  createSubject,
  updateSubject,
  deleteSubject
} from '../../../api/AdminAPI'
import SubjectPopUp from "./SubjectPopUp";

import './UserTab.css'
import '../../../App.css';
import 'react-dropdown/style.css';

import IconButton from '@material-ui/core/IconButton';
import * as micon from '@material-ui/icons';
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


class SubjectTab extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      allClass: [],
      allTeacher: [],
      list: [],
      classIsRemovedStatus: [],
      showPopup: false,
      selectedClass: '',
      popupHeaderText: '',
      popupBtnText: '',
      subjectInfo: {
        classname: '',
        subjectname: '',
        tname: '',
        uid: '',
        status: ''
      },
      token: "token " + this.props.token
    }
    this.onClassSelect = this.onClassSelect.bind(this);
    this.getAllClassWithRemoved = this.getAllClassWithRemoved.bind(this);
    this.loadFillData = this.loadFillData.bind(this);
    /// Popup functions
    this.openAddNewSubjectPopUp = this.openAddNewSubjectPopUp.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  componentDidMount() {
    var token = this.props.token;
    this.getAllClassWithRemoved("tokeon " + token);
    this.getAllTeacher("tokeon " + token);
  }

  render() {
    const {classes} = this.props;
    let optionItems = this.state.allClass.map((op) =>
        <option key={op.value} aria-label={op.label} value={op.value}>{op.label}</option>
    );

    var that = this;
    return (
        <div>
          <h4 style={{color: '#8e44ad', textAlign: 'left', margin: '50px 0 10px 12.5%'}}>Subject Management</h4>
          <div className="box-container">

            <div className="selection-area">
              {/*<Dropdown classname='style.dropDown'*/}
              {/*          options={this.state.allClass}*/}
              {/*          onChange={this.onClassSelect}*/}
              {/*          placeholder="Choose a class"*/}
              {/*          placeholderClassName='myPlaceholderClassName'/>*/}

              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Class</InputLabel>
                <Select
                    native
                    value={that.state.selectedClass}
                    onChange={(e) => this.onClassSelect(e)}
                    label="Role">
                  <option aria-label="None" value=""/>
                  {optionItems}
                </Select>
              </FormControl>
              <br/>
              <button className="btn btn-outline-success" onClick={this.openAddNewSubjectPopUp}>Add</button>
            </div>
            <div className="ag-theme-alpine data-table">
              <div className="table-scroll">
                <table className="table table-hover table-striped">
                  <thead style={{backgroundColor: '#30336b', color: '#dff9fb'}}>
                  <tr key={"user_key1"}>
                    <th scope="col">Class</th>
                    <th scope="col">Subject</th>
                    <th scope="col">Teacher</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.loadFillData()}
                  </tbody>
                </table>
              </div>
            </div>
            {that.state.showPopup ?
                <SubjectPopUp subjectInfo={that.state.subjectInfo}
                              selectedClass={that.state.selectedClass}
                              allTeacher={this.state.allTeacher}
                              popupHeaderText={that.state.popupHeaderText}
                              popupBtnText={that.state.popupBtnText}
                              updateInfo={that.updateInfo}
                              addSubject={that.addSubject}
                              closePopup={that.closePopup}
                /> : null}
          </div>
        </div>
    )
  }


  //******************* Changes On Select ********************/

  onClassSelect(val) {
    var that = this;
    var e = val.target ? val.target : val;
    var classInfo = that.state.allClass.filter(it => it.value === e.value)
    that.setState({
      subjectInfo: {classname: classInfo.length ? classInfo[0].label : ""},
      selectedClass: e.value
    }, () => {
      getSubjectClassTeacherTogether(e.value, that.state.token).then(data => {
        data = data ? data.data : []
        that.setState({list: data})
      })
    })
  }


  //******************* Load Dropdown ********************/

  getAllTeacher(token) {
    var tList = [];
    getUsersByRole("Teacher", token).then(data => {
      if (data.data != null) {
        data.data.forEach(info => {
          var tname = info.firstname + " " + info.lastname
          var obj = {value: info.uid, label: tname}
          tList.push(obj);
        });
        this.setState({allTeacher: tList});
      }
    })
  }

  getAllClassWithRemoved(token) {
    var tList = [];
    var tList2 = [];
    getAllClassWithRemoved(token).then(data => {
      if (data.data != null) {
        data.data.forEach(info => {
          var obj = {value: info.cid, label: info.is_removed === "Yes" ? info.classname + " (Deleted)" : info.classname}
          tList.push(obj);
          var obj2 = {value: info.cid, is_removed: info.is_removed}
          tList2.push(obj2)
        });
        // console.log("tList2:  " + tList2)
        this.setState({allClass: tList, classIsRemovedStatus: tList2});
      }
    })
  }


  //******************* Load Table ********************/

  loadFillData() {
    if (this.state.list.length) {

      return this.state.list.map(data => {
        return (
            <tr key={data.sid}>
              <th>{data.classname}</th>
              <th>{data.subjectname}</th>
              <th>{data.tname}</th>
              <th>{data.status}</th>
              {/*<td>{<button className="btn btn-info" onClick={() => this.openUpdatePopup(data)} disabled={data.status === "Archived" ? true : false}>Update</button>}</td>*/}
              <td>{<IconButton className="btn btn-info" onClick={() => this.openUpdatePopup(data)}
                               disabled={data.status == "Archived" ? true : false}>
                <micon.Update style={{color: "#22a6b3", frontSize: "30"}}/>
              </IconButton>}</td>
              {/*<td>{<button className="btn btn-danger" onClick={() => this.deleteInfo(data.sid)} disabled={data.status === "Archived" ? true : false}>Delete</button>}</td>*/}
              <td>{<IconButton className="btn btn-danger" onClick={() => this.deleteInfo(data.sid)}
                               disabled={data.status === "Archived" ? true : false}>
                <micon.Delete style={{color: "#eb3b5a", frontSize: "30"}}/>
              </IconButton>}</td>
            </tr>
        )
      })
    }
    // else console.log("No data");
  }


  //******************* Show PopUp ********************/

  openAddNewSubjectPopUp() {

    var isClassRemoved = 0;

    //Check if the selected class is removed or not
    for (var i = 0; i < this.state.classIsRemovedStatus.length; i++) {
      if (this.state.classIsRemovedStatus[i].value === this.state.selectedClass) {
        if (this.state.classIsRemovedStatus[i].is_removed === "Yes") {
          isClassRemoved = 1;
        }
        break;
      }
    }

    if (isClassRemoved === 1) {
      alert(this.state.subjectInfo.classname + " has been deleted. You can only see archived subjects");
    } else {
      if (this.state.selectedClass)
        this.setState({
              popupHeaderText: "Add A New",
              popupBtnText: "Add",
              subjectInfo: {
                classname: this.state.subjectInfo.classname,
                subjectname: '',
                uid: '',
                tname: ''
              }
            },
            () => {
              this.togglePopup();
            })
      else alert("Please select a class");
    }
  }


  openUpdatePopup(data) {
    this.setState({
          popupHeaderText: "Update",
          popupBtnText: "Update",
          subjectInfo: {
            classname: data.classname,
            subjectname: data.subjectname,
            uid: data.uid,
            tname: data.tname,
            sid: data.sid
          },
          selectedClass: data.cid
        },
        () => {
          this.togglePopup();
        })
  }

  togglePopup() {
    this.setState({showPopup: !this.state.showPopup});
  }


  //******************* Post PopUp Action ********************/

  addSubject(data) {
    var that = this;
    var tempCid = data.cid;
    checkSubjectExists(data.subjectname, data.uid, data.cid, that.state.token).then(response => {

      if (!response.data.length)
        createSubject(data.sid, data.subjectname, data.status, data.uid, data.cid, that.state.token).then(res => {
          if (res.status === "SUCCESS") {
            that.togglePopup();
            that.setState({
              list: [],
              popupHeaderText: "",
              popupBtnText: "",
              subjectInfo: {
                classname: '',
                subjectname: '',
                tname: '',
                uid: '',
                status: ''
              },
              selectedClass: tempCid
            }, () => {
              that.LoadUpdatedData(tempCid, that.state.token)
            })
          } else {
            alert("Error!!")
          }
        })
      else alert("This Subject already existed");
    })

  }

  updateInfo(data) {
    var that = this;
    var tempCid = data.cid

    updateSubject(data, that.state.token).then(response => {
      if (response.status === "SUCCESS") {
        that.togglePopup();
        that.setState({
          list: [],
          popupHeaderText: "",
          popupBtnText: "",
          subjectInfo: {
            classname: '',
            subjectname: '',
            tname: '',
            uid: '',
            status: ''
          },
          selectedClass: tempCid
        }, () => {
          that.LoadUpdatedData(tempCid, that.state.token)
        })
      } else {
        alert(response.message)
      }
    })
  }

  deleteInfo(sid) {
    var that = this;

    if (!window.confirm("Do you really want to delete it?")) return;
    deleteSubject(sid, that.state.token).then(data => {
      alert(data.status + ": " + data.message);
      that.LoadUpdatedData(that.state.selectedClass, that.state.token);
    })
  }

  closePopup() {
    this.setState({
          subjectInfo: {
            classname: '',
            subjectname: '',
            tname: '',
            uid: '',
            status: ''
          }
        },
        () => {
          this.togglePopup();
        })
  }

  //******************** Load Updated Data After PopUp Action ************/

  LoadUpdatedData(cid, token) {
    getSubjectClassTeacherTogether(cid, token).then(data => {
      this.setState({list: data.data})
    })
  }


}

export default withStyles(styles, {withTheme: true})(SubjectTab);

