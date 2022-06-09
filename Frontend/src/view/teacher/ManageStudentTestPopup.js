import React from "react";
import "../../App.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
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

class ManageStudentTestPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      testList: this.props.testList,
      selectedTest: this.props.selectedTest,
      marks: this.props.studentData.marks,
      resid: this.props.studentData.resid,
      studentMarkData: this.props.studentMarkData,
    };

    this.onTestSelect = this.onTestSelect.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.oninputChange = this.oninputChange.bind(this);
    this.sendData = this.sendData.bind(this);
    this.close = this.close.bind(this);
    this.setID = this.setID.bind(this);

  }

  componentDidMount() {}

  render() {
    const {classes} = this.props;
    var that = this;
    let optionItems = that.state.testList.map((op) =>
        <option key={op.value} aria-label={op.label} value={op.value}>{op.label}</option>
    );

    return (
      <div className="popup">
        <div className="App popup_inner">
        <div className="custom_pop">
          <h2>{that.props.popupHeaderText}</h2>
          <br />
          <div style={{ alignItem: "left" }}>
            {/*<Dropdown*/}
            {/*  classname="style.dropDown"*/}
            {/*  value={*/}
            {/*    that.state.testList[*/}
            {/*      this.getIndex(this.state.testList, this.state.selectedTest)*/}
            {/*    ]*/}
            {/*  }*/}
            {/*  options={that.state.testList}*/}
            {/*  onChange={that.onTestSelect}*/}
            {/*  placeholder="Select an option"*/}
            {/*  placeholderClassName="myPlaceholderClassName"*/}
            {/*/>*/}

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">Tests</InputLabel>
              <Select
                  native
                  value={this.state.selectedTest}
                  onChange={(e) => this.onTestSelect(e)}
                  label="Tests">
                {/*<option aria-label="None" value=""/>*/}
                {optionItems}

              </Select>
            </FormControl>

            <br/><br/>
            {/*<label> <b>Marks </b></label>*/}
            {/*<br />*/}
            {/*<input*/}
            {/*  className="form-control"*/}
            {/*  defaultValue={this.state.studentMarkData.marks}*/}
            {/*  type="text"*/}
            {/*  name="marks"*/}
            {/*  onChange={that.oninputChange.bind(this, "marks")}*/}
            {/*/>*/}

            <TextField style={{width: '100%'}} label="Marks" variant="outlined"
                       value={this.state.studentMarkData.marks} id="marks"
                       onChange={(e) => that.oninputChange(e, "marks")}/>
            <br/>
          </div>
          <div className="popup-button-area">
            <button className="btn btn-outline-info" onClick={that.sendData}>Change</button>
            <button className="btn btn-outline-danger" onClick={this.close}>{"Close"}</button>
          </div>
          </div>
        </div>
      </div>
    );
  }

  close() {
    this.props.closePopup();
  }

  getIndex(arr, testVal) {
    return arr.findIndex((obj) => obj.value === testVal);
  }

  //******************* Changes On Select ********************/

  onTestSelect(e) {
    var data = e.target ? e.target : {value: "", label: ""}
    this.setState({ selectedTest: data.value }, () => { });
  }

  oninputChange(key, e) {
    switch (e) {
      case "marks":
        this.setState({
          studentMarkData: {
            aid: this.props.studentMarkData.aid,
            marks: key.target.value,
            name: this.props.studentMarkData.name,
            resid: this.props.studentMarkData.resid,
            uid: this.props.studentMarkData.uid,
            username: this.props.studentMarkData.username,
          },
        });
        break;
      default:
        break;
    }
  }

  //******************* Send Data to Subject Tab Component ********************/

  setID() {
    return "RES" + Date.now();
  }

  sendData() {
    var data = this.state.studentMarkData
    if(data.resid ===  null){
      data.resid = this.setID();
    }
    if (data.marks.length) this.props.updateInfo(data);
    else alert("Please provide all info");
  }
}

export default withStyles(styles, {withTheme: true})(ManageStudentTestPopup);
