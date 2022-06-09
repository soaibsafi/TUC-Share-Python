import React from "react";
import Dropdown from "react-dropdown";
import {
  getAllClass,
  getSubjectsDetails,
  createNewClass,
  updateAClass,
  deleteAClass
} from "../../../api/AdminAPI";
import Tablepopup from "./Tablepopup";

import "./UserTab.css";
import "../../../App.css";
import "react-dropdown/style.css";

import IconButton from '@material-ui/core/IconButton';
import * as micon from '@material-ui/icons';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
  root: {},
  formControl: {
    // margin: theme.spacing(1),
    minWidth: '100%',
  },
});

class ClassTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subjectsDetails: [],
      allClasses: [],
      showPopup: false,
      selectedClass: "",
      popupHeaderText: "",
      popupBtnText: "",
      classinfo: {
        classname: "",
        cid: "",
      },
      token: "token " + this.props.token
    };
    this.loadFillData = this.loadFillData.bind(this);
    this.getAllClasses = this.getAllClasses.bind(this);
    this.getAllSubjectsDetails = this.getAllSubjectsDetails.bind(this);
    this.openNewClassPopup = this.openNewClassPopup.bind(this)

    //Popup functions
    this.addClass = this.addClass.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.closePopup = this.closePopup.bind(this);

  }

  componentDidMount() {
    var token = this.props.token;
    this.getAllClasses("tokeon " + token);
  }

  render() {
    const {classes} = this.props;
    let optionItems = this.state.allClasses.map((op) =>
        <option key={op.value} label={op.label} value={op.value}>{op.label}</option>
    );
    var that = this;
    //console.log(that.state.allClasses);
    return (
        <div>
          <h4 style={{color: '#8e44ad', textAlign: 'left', margin: '50px 0 10px 12.5%'}}>Class Management</h4>
          <div className="box-container">
            <div className='selection-area'>
              {/*<Dropdown*/}
              {/*  classname="style.dropDown"*/}
              {/*  options={that.state.allClasses}*/}
              {/*  onChange={this.getAllSubjectsDetails}*/}
              {/*  placeholder="Select a class"*/}
              {/*  placeholderClassName="myPlaceholderClassName"*/}
              {/*/>*/}
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Class</InputLabel>
                <Select
                    native
                    value={that.state.selectedRole}
                    onChange={(e) => this.getAllSubjectsDetails(e)}
                    label="Role">
                  <option aria-label="None" value=""/>
                  {optionItems}

                </Select>
              </FormControl>
              <br/>
              <button className="btn btn-outline-success" onClick={this.openNewClassPopup}>
                Add
              </button>
              <button className="btn btn-outline-info" onClick={() => this.openUpdatePopup(that.state.classinfo)}>
                Update
              </button>

              <button className="btn btn-outline-danger" onClick={() => this.deleteInfo(that.state.classinfo.cid)}>
                Delete
              </button>
            </div>
            <div className="ag-theme-alpine data-table">
              <div className="table-scroll">
                <table className="table table-hover table-striped">
                  <thead style={{backgroundColor: '#30336b', color: '#dff9fb'}}>
                  <tr key={"user_key1"}>
                    <th scope="col">Subject</th>
                    <th scope="col">Status</th>
                    <th scope="col">Teacher</th>
                  </tr>
                  </thead>
                  <tbody>{this.loadFillData()}</tbody>
                </table>
              </div>
            </div>
            {that.state.showPopup ? (
                <Tablepopup
                    classinfo={that.state.classinfo}
                    selectedClass={that.state.selectedClass}
                    closePopup={that.togglePopup.bind(this)}
                    popupHeaderText={that.state.popupHeaderText}
                    popupBtnText={that.state.popupBtnText}
                    updateInfo={that.updateInfo}
                    addClass={that.addClass}
                />
            ) : null}
          </div>
        </div>
    );
  }

  loadFillData() {
    if (this.state.subjectsDetails.length) {
      return this.state.subjectsDetails.map((data, idx) => {
        return (
            <tr key={idx}>
              <th>{data.subjectname}</th>
              <th>{data.status}</th>
              <td>{data.fullname}</td>
            </tr>
        );
      });
    }
  }

  getAllClasses(token) {
    var tempList = [];
    getAllClass(token).then((data) => {
      data.data.forEach((info) => {
        var obj = {value: info.cid, label: info.classname};
        tempList.push(obj);
      });
      this.setState({allClasses: tempList});
    });
  }

  getAllSubjectsDetails(val) {
    var that = this;
    var e = val.target ? val.target : val;
    getSubjectsDetails("token " + that.props.token, e.value).then((data) => {
      data = data ? data.data : [];
      var classInfo = that.state.allClasses.filter(it => it.value === e.value)
      var obj = {
        cid: classInfo.length ? classInfo[0].value : "",/// e.value,
        classname: classInfo.length ? classInfo[0].label : ""//e.label
      }
      that.setState({classinfo: obj, subjectsDetails: data})
    });
  }

  addClass(data) {
    var that = this;
    console.log(data)
    getAllClass("Token " + that.props.token).then((cinfo) => {
      console.log(cinfo.data)
      if ((cinfo.data.filter(e => e.classname === data.classname).length > 0))
        alert("The class already exists!")
      else {
        createNewClass(data, "token " + that.props.token).then((data) => {
          if (data.status === "SUCCESS") {
            that.togglePopup();
            that.setState({allClasses: []}, () => {
              that.getAllClasses("Token " + that.props.token);
            });
          } else {
            alert("Error!!");
          }
        });
      }
    })
  }

  updateInfo(data) {
    var that = this;
    //console.log(data)
    updateAClass(data, that.state.token).then(response => {
      if (response.status === "SUCCESS") {
        that.togglePopup();
        that.setState({
          //allClasses: [],
          popupHeaderText: "",
          popupBtnText: "",
          classinfo: {
            cid: "",
            classname: ""
          },
          allClasses: []
        }, () => {
          that.getAllClasses("Token " + that.props.token)
        })
      }
    })
  }

  openNewClassPopup() {
    this.setState(
        {
          popupHeaderText: "Add A New Class",
          popupBtnText: "Add",
          // classinfo: {
          //   cid: "",
          //   classname: ""
          // }
        },
        () => {
          this.togglePopup();
        }
    );
  }

  openUpdatePopup(data) {
    if (data.cid === "") {
      alert("Please select a class.")
    } else {
      this.setState({
            popupHeaderText: "Update",
            popupBtnText: "Update",
            classinfo: {
              cid: data.cid,
              classname: data.classname
            }
          },
          () => {
            this.togglePopup();
          })
    }

  }

  closePopup() {
    this.setState({
          popupHeaderText: "",
          popupBtnText: "",
          classinfo: {
            classname: "",
            cid: ""
          },
          selectedClass: ""

        },
        () => {
          this.togglePopup();
        })
  }

  deleteInfo(cid) {
    var that = this;
    if (cid === "") {
      alert("Please select a class.")
    } else {
      if (!window.confirm("Do you really want to delete the class?")) return;
      deleteAClass(cid, that.state.token).then(data => {
        alert(data.message);
        that.getAllClasses(that.state.token);
      })

    }
  }

  togglePopup() {
    this.setState({showPopup: !this.state.showPopup});
  }
}

export default withStyles(styles, {withTheme: true})(ClassTable);
