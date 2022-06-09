import React from "react";
import "../../../App.css";

import {withStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  root: {},
});

class classpopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classname: this.props.popupHeaderText !== "Update" ? "" :  this.props.classinfo.classname,
      cid: this.props.classinfo.cid,
      selectedClass: this.props.selectedClass,
    };
    this.oninputChange = this.oninputChange.bind(this);
    this.setClassID = this.setClassID.bind(this);

    this.sendData = this.sendData.bind(this);
  }

  render() {
    var that = this;
    return (
      <div className="popup">
        <div className="App popup_inner">
          <div className="custom_pop">
            <h2>
              {that.props.popupHeaderText +  " " +
                (that.props.popupHeaderText !== "Update" ? "" : "")}
            </h2>
            <br />
            <div>
              {/*<label><b>Class Name</b></label>*/}
              {/*<br />*/}
              {/*<input className="form-control" type="text" name="classname" defaultValue={that.state.classname}*/}
              {/*  onChange={that.oninputChange.bind(this, "classname")} />*/}
              <TextField style={{width: '100%'}} label="Class Name" variant="outlined"
                         value={that.state.classname} id="classname"
                         onChange={(e) => that.oninputChange(e, "classname")}/>
            </div>
            <div className="popup-button-area">
              <button className="btn btn-outline-info" onClick={that.sendData}>
                {this.props.popupBtnText}
              </button>
              <button className="btn btn-outline-danger" onClick={that.props.closePopup}>
                {"Close"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  oninputChange(key, lblname) {
    switch (lblname) {
      case "classname":
        this.setState({ classname: key.target.value });
        break;
      default:
        break;
    }
  }

  onClassSelect(e) {
    this.setState({ selectedClass: e.value });
  }

  setClassID() {
    return "CLS" + Date.now();
  }

  sendData() {
    var data =
      this.props.popupBtnText === "Add"
        ? {
          classname: this.state.classname,
          cid: this.setClassID(),
          selectedClass: this.state.selectedClass,
        }
        : {
          classname: this.state.classname,
          cid: this.state.cid,
          selectedClass: this.state.selectedClass,
        };
    this.resetState();
    if (this.props.popupBtnText === "Add") {
      if (data.classname.length) this.props.addClass(data);
      else alert("No name provided");
    } else {
      if (data.classname.length) this.props.updateInfo(data);
      else alert("Please Provide all information");
    }
  }

  close() {
    this.resetState();
    this.props.closePopup();
  }

  resetState() {
    this.setState({
      classname: "",
      cid: "",
      selectedClass: "",
    });
  }
}

export default withStyles(styles, {withTheme: true})(classpopup);
