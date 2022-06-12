import React from "react";
import { getRequests } from "../api/utils";
import "./Admin.css";

import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import * as micon from "@material-ui/icons";
import RequestDetailsPopup from "./RequestDetails";

const styles = (theme) => ({
  root: {},
});

const redirectpath = "/login";

class adminPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      requestList: [],
      requestDetails: [],
      hidePopup: true,
      popupHeaderText: "Details",
    };

    this.loadFillData = this.loadFillData.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.switchPopup = this.switchPopup.bind(this);
    this.loadRequestList = this.loadRequestList.bind(this);
    this.logoutAction = this.logoutAction.bind(this);
  }

  logoutAction() {
    this.props.history.push({ pathname: "/", state: { userType: "" } });
  }

  loadRequestList() {
    getRequests().then((res) => {
      console.log(res);
      if (res.status === 200 && res.statusText === "OK") {
        this.setState({ requestList: res.data });
      }
    });
  }

  switchPopup() {
    this.setState({ hidePopup: !this.state.hidePopup });
  }

  openPopup(data) {
    var that = this;
    var list = [data];
    this.setState({ requestDetails: [data] }, () => {
      that.switchPopup();
    });
  }

  loadFillData() {
    if (this.state.requestList.length) {
      return this.state.requestList.map((data) => {
        // console.log(data)
        var filename = data.file_name + data.file_type;
        return (
          <tr key={data.req_id}>
            <th>{filename}</th>
            <td>
              {
                <IconButton
                  className="btn btn-info"
                  onClick={() => this.openPopup(data)}
                >
                  <micon.Info style={{ color: "#000", frontSize: "100" }} />
                </IconButton>
              }
            </td>
          </tr>
        );
      });
    }
  }

  componentDidMount() {
    var that = this;
    var token = that.state.token;
    if (token) {
      window.onpopstate = function (event) {
        that.props.history.go(1);
      };
    }
    that.loadRequestList();
  }

  render() {
    var that = this;
    var state = this.state;
    const { classes } = this.props;
    return (
      <div>
        <div className="fill-window">
          <div
            style={{
              width: "100%",
              backgroundColor: "#005f50",
              height: "60px",
            }}
          >
            <div className="main-title-area">
            <div class="site-identity">
                <a href="#">
                  <img
                    src="https://www.tu-chemnitz.de/tucal4/img/logo-ua.svg"
                    alt="Site Name"
                  />
                </a>
                <h1 style={{ color: "#ecf0f1" }}>
                  TUC Share {that.state.fullName}
                </h1>
              </div><h4 style={{ color: "#ecf0f1" }}>Admin Portal</h4>
              {/*<button type="button" className="btn btn-danger" onClick={this.logoutAction}>Logout</button>*/}
              <IconButton
                aria-label="Logout"
                className={classes.margin}
                onClick={this.logoutAction}
              >
                <micon.ExitToApp style={{ color: "#ecf0f1", fontSize: 40 }} />
              </IconButton>
            </div>
          </div>

          <div className="form-group">
            <h4 className="reqTitle">Pending Requests</h4>
            {/* <h4 style={{color: '#8e44ad', textAlign: 'center', margin: '0px 0 10px 12.5%'}}>Requests</h4> */}
            <div className="box-container">
              {/*<div className="ag-theme-alpine data-table">*/}
              <div className="table-scroll requestTable">
                <table className="table table-hover table-striped">
                  <thead
                    style={{ backgroundColor: "#005f50", color: "#dff9fb" }}
                  >
                    <tr key={"user_key1"}>
                      <th scope="col">File Name</th>
                      <th scope="col">Details</th>
                    </tr>
                  </thead>
                  <tbody>{this.loadFillData()}</tbody>
                </table>
              </div>
              {/*</div>*/}
            </div>
          </div>
          {!that.state.hidePopup ? (
            <RequestDetailsPopup
              requestDetails={that.state.requestDetails}
              popupHeaderText={that.state.popupHeaderText}
              reloadList={this.loadRequestList}
              closePopup={that.switchPopup}
            />
          ) : null}
          <div
            style={{
              width: "100%",
              backgroundColor: "#005f50",
              height: "60px",
              position: "fixed",
              bottom: "0",
            }}
          ></div>
        </div>
      </div>
    );
  }

  // logoutAction() {
  //   var that = this;
  //   that.setState({token: ''},
  //       () => {
  //         that.props.history.push({pathname: redirectpath});
  //       })
  // }
  //
  // tabSelectionAction(idx) {
  //   this.setState({selectedTab: idx})
  // }
}

export default withStyles(styles, { withTheme: true })(adminPanel);
