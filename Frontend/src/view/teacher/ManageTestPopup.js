import React from "react";
import "../../App.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  root: {},
  formControl: {
    // margin: theme.spacing(1),
    minWidth: '100%',
  },
});

class ManageTestPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sid: this.props.sid,
      testList: this.props.testList,
      selectedTest: this.props.selectedTest,
      selectedTestName: "",
      selectedTestDate: "",
      selectedTestId: "",
      testDetailsList: this.props.testDetailsList,
    };
    this.oninputChange = this.oninputChange.bind(this);
    this.onTestSelect = this.onTestSelect.bind(this);
    // this.setUserID = this.setUserID.bind(this);
    this.sendData = this.sendData.bind(this);
    this.resetState = this.resetState.bind(this);
    this.close = this.close.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.oninputtestChange = this.oninputtestChange.bind(this);
  }

  componentDidMount() {
    if (this.props.popupBtnText === "Update") {
      var x =
        this.state.testList[
        this.getIndex(this.state.testList, this.state.selectedTest)
        ];

      var dt = this.state.testDetailsList.findIndex((obj) => obj.tid === x.value);
      this.setState(
        {
          selectedTestName: x.label,
          selectedTestDate: this.state.testDetailsList[dt].testdate,
          selectedTestId: this.state.testDetailsList[dt].tid,
        },
        () => {
          console.log(this.state.selectedTestDate);
        }
      );
    }
  }

  render() {
    const {classes} = this.props;
    var that = this;
    return (
      <div className="popup">
        <div className="App popup_inner">
          <div className="custom_pop" >
            {/*<div style={{backgroundColor: '#30336b', color:'#dff9fb', width: '100%', height: '20px'}}></div>*/}
            <h4>{that.props.popupHeaderText}</h4>
            <br />
            <div style={{ alignItem: "left" }}>
              {console.log(that.props.popupHeaderText)}
              {/*<label><b>Test Name</b></label>*/}
              {/*<br />*/}
              {/*<input*/}
              {/*  className="form-control"*/}
              {/*  type="text"*/}
              {/*  name="testname"*/}
              {/*  defaultValue={that.props.popupBtnText === "Add" ? "" : that.state.selectedTestName}*/}
              {/*  onChange={that.oninputChange.bind(this, "testname")}*/}
              {/*/>*/}

              <TextField style={{width: '100%'}} label="Test Name" variant="outlined"
                         value={this.state.selectedTestName} id="testname"
                         onChange={(e) => that.oninputtestChange(e, "testname")}/>
                         <br/>
              <br />
              <label style={{color: '#808080'}}><b>Test Date</b></label>
              <br />
              <input
                  style={{height: '56px'}}
                className="form-control"
                type="date"
                name="testdate"
                defaultValue={that.props.popupBtnText === "Add" ? "" : that.state.selectedTestDate.slice(0, 10)}
                onChange={that.oninputChange.bind(this, "testdate")}
              />

            </div>
            <br />
            <div className="popup-button-area">
              <button className="btn btn-outline-info" onClick={that.sendData}>
                {this.props.popupBtnText}
              </button>
              <button className="btn btn-outline-danger" onClick={this.close}>
                {"Close"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getIndex(arr, testVal) {
    return arr.findIndex((obj) => obj.value === testVal);
  }

  close() {
    this.props.closePopup();
  }

  oninputtestChange(key, e) {
    switch (e) {
      case "testname":
        this.setState({ selectedTestName: key.target.value });
        break;
      case "testdate":
        this.setState({ selectedTestDate: e.target.value }, () => {
          console.log(this.state.testdate);
        });
        break;
      default:
        break;
    }
  }

  oninputChange(key, e) {
    switch (key) {
      case "testname":
        this.setState({ selectedTestName: e.target.value });
        break;
      case "testdate":
        this.setState({ selectedTestDate: e.target.value }, () => {
          console.log(this.state.testdate);
        });
        break;
      default:
        break;
    }
  }

  onTestSelect(e) {
    this.setState({ selectedTest: e.value });
  }

  setUserID() {
    return "TST" + Date.now();
  }

  sendData() {
    var data =
      this.props.popupBtnText === "Add"
        ? {
          tid: this.setUserID(),
          testname: this.state.selectedTestName,
          testdate: this.state.selectedTestDate,
          sid: this.state.sid,
        }
        : {
          tid: this.state.selectedTestId,
          testname: this.state.selectedTestName,
          testdate: this.state.selectedTestDate,
          sid: this.state.sid,
        };
    this.resetState();
    if (this.props.popupBtnText === "Add") {
      if (data.testname.length && data.testdate.length)
        this.props.addTest(data);
      else alert("Please Provide all information");
    } else {
      if (data.testname.length && data.testdate.length)
        this.props.updateTest(data);
      else alert("Please Provide all information");
    }
  }

  resetState() {
    this.setState({
      tid: "",
      testname: "",
      testdate: "",
    });
  }
}

export default withStyles(styles, {withTheme: true})(ManageTestPopup);
