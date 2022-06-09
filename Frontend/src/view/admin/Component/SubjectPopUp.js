import React from 'react';
import '../../../App.css';
import Dropdown from "react-dropdown";

import {withStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {},
  formControl: {
    // margin: theme.spacing(1),
    minWidth: '100%',
  },
});

import 'react-dropdown/style.css';

const StatusOptions = [
  {value: 'Archived', label: 'Archived'},
  {value: 'Not Archived', label: 'Not Archived'}
];

class SubjectPopUp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classname: this.props.subjectInfo.classname,
      subjectname: this.props.subjectInfo.subjectname,
      tname: this.props.subjectInfo.tname,
      //Here uid is the teacher id
      uid: this.props.subjectInfo.uid,
      sid: this.props.subjectInfo.sid,
      selectedClass: this.props.selectedClass,
      allTeacher: this.props.allTeacher,
      selectedStatus: 'Not Archived'
    }
    this.oninputChange = this.oninputChange.bind(this);
    this.onTeacherSelect = this.onTeacherSelect.bind(this);
    this.onStatusSelect = this.onStatusSelect.bind(this);
    this.setSubjectID = this.setSubjectID.bind(this);
    this.sendData = this.sendData.bind(this);
    this.resetState = this.resetState.bind(this);
    this.close = this.close.bind(this);
  }

  render() {
    const {classes} = this.props;
    var that = this;

    let optionItems = that.state.allTeacher.map((op) =>
        <option key={op.value} aria-label={op.label} value={op.value}>{op.label}</option>
    );

    let statusoptionItems = StatusOptions.map((op) =>
        <option key={op.value} aria-label={op.label} value={op.value}>{op.label}</option>
    );

    return (
        <div className='popup'>
          <div className='App popup_inner'>
            <div className="custom_pop">
              <h2>{that.props.popupHeaderText + " " + (that.props.popupHeaderText !== "Update" ? 'Subject' : '')}</h2>
              <br/>
              <div>
                {/*<label> <b>Class name</b></label>*/}
                {/*<br />*/}
                {/*<input className="form-control" type="text" name="classname" defaultValue={that.state.classname} disabled />*/}
                {/*<br />*/}

                <TextField style={{width: '100%'}} disabled label="Class name" variant="outlined"
                           value={this.state.classname} id="classname"
                           onChange={(e) => that.oninputChange.bind(e, "classname")}/>
                <br/><br/>
                {/*<label><b> Subject Name</b></label>*/}
                {/*<input className="form-control" type="text" name="subjectname"
                defaultValue={that.props.popupHeaderText === "Update" ? that.state.subjectname : ""}*/}
                {/*  onChange={that.oninputChange.bind(this, "subjectname")}*/}
                {/*/>*/}
                {/*<br />*/}

                <TextField style={{width: '100%'}} label="Subject name" variant="outlined"
                           value={that.state.subjectname}
                           id="subjectname"
                           onChange={(e) => that.oninputChange(e, "subjectname")}/>

                <br/><br/>

                {/*<label><b> Teacher </b></label>*/}
                {/*<br />*/}
                {/*<Dropdown classname='style.dropDown'*/}
                {/*  options={this.state.allTeacher}*/}
                {/*  value={this.state.uid}*/}
                {/*  onChange={this.onTeacherSelect}*/}
                {/*  placeholder="Choose a Teacher"*/}
                {/*  placeholderClassName='myPlaceholderClassName' />*/}
                {/*<br />*/}

                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="outlined-age-native-simple">Teacher</InputLabel>
                  <Select
                      native
                      value={this.state.uid}
                      onChange={(e) => this.onTeacherSelect(e)}
                      label="Teacher"
                  >
                    <option aria-label="None" value=""/>
                    {optionItems}
                  </Select>
                </FormControl>

                {that.props.popupHeaderText === "Update" ?
                    <div>
                      {/*<label><b> Status </b></label>*/}
                      {/*<Dropdown classname='style.dropDown'*/}
                      {/*          options={StatusOptions}*/}
                      {/*          value={"Not Archived"}*/}
                      {/*          onChange={this.onStatusSelect}*/}
                      {/*          placeholder="Set a status"*/}
                      {/*          placeholderClassName='myPlaceholderClassName'/>*/}
                      {/*<br/>*/}
                      <br/>
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">Status</InputLabel>
                        <Select
                            native
                            value={this.state.selectedStatus}
                            onChange={(e) => this.onStatusSelect(e)}
                            label="Teacher"
                        >
                          <option aria-label="None" value=""/>
                          {statusoptionItems}

                        </Select>
                      </FormControl>
                    </div> : null}
              </div>
              <div className="popup-button-area">
                <button className='btn btn-outline-info' onClick={that.sendData}>{this.props.popupBtnText}</button>
                <button className='btn btn-outline-danger' onClick={this.close}>{"Close"}</button>
              </div>
            </div>
          </div>
        </div>
    )
  }


  //******************* Changes On Select/Input ********************/

  oninputChange(key, e) {
    switch (e) {
      case "subjectname":
        this.setState({subjectname: key.target.value});
        break;
      default:
        break;
    }
  }

  onTeacherSelect(e) {
    this.setState({uid: e.target.value})
  }

  onStatusSelect(e) {
    this.setState({selectedStatus: e.target.value})
  }


  //******************* Send Data to Subject Tab Component ********************/

  setSubjectID() {
    return "SUB" + Date.now()
  }

  sendData() {
    var tempStatus = this.state.selectedStatus;
    if (this.state.selectedStatus === "")
      tempStatus = "Not Archived"

    var data = this.props.popupBtnText === "Add" ? {
      "classname": this.state.classname,
      "subjectname": this.state.subjectname,
      "uid": this.state.uid,
      "cid": this.state.selectedClass,
      "status": "Not Archived",
      "sid": this.setSubjectID()

    } : {
      "classname": this.state.classname,
      "subjectname": this.state.subjectname,
      "uid": this.state.uid,
      "cid": this.state.selectedClass,
      "status": tempStatus,
      "sid": this.state.sid
    }

    //this.resetState();

    if (this.props.popupBtnText === "Add") {
      if (data.subjectname.length && data.uid.length)
        this.props.addSubject(data)

      else alert("Subject and Teacher name cannot be empty");
    } else {
      if (data.subjectname.length && data.uid.length && data.status.length)
        this.props.updateInfo(data);
      else alert("Please provide all info")
    }
  }


  //******************* Close PopUp & Reset State ********************/

  close() {
    this.props.closePopup();
  }

  resetState() {
    this.setState({
      classname: '',
      subjectname: '',
      tname: '',
      //Here uid is the teacher id
      uid: '',
      sid: '',
      selectedClass: '',
      allTeacher: '',
      selectedStatus: ''
    })
  }

}

export default withStyles(styles, {withTheme: true})(SubjectPopUp);
