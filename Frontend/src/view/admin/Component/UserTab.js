import React from 'react';
import Dropdown from "react-dropdown";
import {
  getAllUsers,
  createNewUser,
  updateAUser,
  checkDuplicateUsername,
  getUsersByRole,
  deleteAUser
} from '../../../api/AdminAPI'
import IconButton from '@material-ui/core/IconButton';
import * as micon from '@material-ui/icons';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Userpopup from "./Userpopup";

import './UserTab.css'
import '../../../App.css';
import 'react-dropdown/style.css';
import {withStyles} from "@material-ui/core/styles";

const options = [
  {value: 'ALL', label: 'All Users'},
  {value: 'Admin', label: 'Admin'},
  {value: 'Pupil', label: 'Pupil'},
  {value: 'Teacher', label: 'Teacher'}
];

const styles = theme => ({
  root: {},
  formControl: {
    // margin: theme.spacing(1),
    minWidth: '100%',
  },
});

class UserTab extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      list: [],
      showPopup: false,
      selectedRole: '',
      popupHeaderText: '',
      popupBtnText: '',
      userinfo: {
        fname: '',
        lname: '',
        username: '',
        uid: ''
      },
      token: "token " + this.props.token,
      uid: this.props.uid
    }
    this.loadFillData = this.loadFillData.bind(this);
    this.getAllUser = this.getAllUser.bind(this);
    this.openNewUserPopup = this.openNewUserPopup.bind(this);
    this.onRoleSelect = this.onRoleSelect.bind(this);
    this.openUpdatePopup = this.openUpdatePopup.bind(this);
    this.deleteInfo = this.deleteInfo.bind(this);
    this.togglePopup = this.togglePopup.bind(this);

    /// Popup functions
    this.addUser = this.addUser.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.closePopup = this.closePopup.bind(this);
    // this.loadDropDownOptions = this.loadDropDownOptions.bind(this);
  }


  componentDidMount() {
    var token = this.props.token;
    this.getAllUser("tokeon " + token);
  }

  render() {
    const {classes} = this.props;
    let optionItems = options.map((op) =>
        <option key={op.value} aria-label={op.label} value={op.value}>{op.label}</option>
    );

    var that = this;
    return (
        <div>
          <h4 style={{color: '#8e44ad', textAlign: 'left', margin: '50px 0 10px 12.5%'}}>User Management</h4>
          <div className="box-container">
            <div className='selection-area'>
              {/*<Dropdown classname='style.dropDown'*/}
              {/*          options={options}*/}
              {/*          onChange={this.onRoleSelect}*/}
              {/*          value={options[0]}*/}
              {/*          placeholderClassName='myPlaceholderClassName'/>*/}

              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Users</InputLabel>
                <Select
                    native
                     value={that.state.selectedRole}
                     onChange={(e) => this.onRoleSelect(e)}
                    label="Role">
                  {/*<option aria-label="None" value="" />*/}
                  {optionItems}

                </Select>
              </FormControl>
              <br/>
              <button className="btn btn-outline-success" onClick={this.openNewUserPopup}>Add</button>
            </div>
            {that.state.list.length ?
                <div className="ag-theme-alpine data-table">
                  <div className="table-scroll">
                    <table className="table table-hover table-striped">
                      <thead style={{backgroundColor: '#30336b', color:'#dff9fb'}}>
                      <tr key={"user_key1"}>
                        <th scope="col">Username</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Role</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                      </tr>
                      </thead>
                      <tbody>
                      {this.loadFillData()}
                      </tbody>
                    </table>
                  </div>
                </div> : <label>No data</label>}
            {that.state.showPopup ?
                <Userpopup userinfo={that.state.userinfo}
                           selectedRole={that.state.selectedRole}
                           popupHeaderText={that.state.popupHeaderText}
                           popupBtnText={that.state.popupBtnText}
                           updateInfo={that.updateInfo}
                           addUser={that.addUser}
                           closePopup={that.closePopup}
                /> : null}
          </div>
        </div>
    )
  }

  loadFillData() {
    if (this.state.list.length) {

      return this.state.list.map(data => {
        return (
            <tr key={data.uid}>
              <th style={{verticalAlign: 'middle'}}>{data.username}</th>
              <td style={{verticalAlign: 'middle'}}>{data.firstname}</td>
              <td style={{verticalAlign: 'middle'}}>{data.lastname}</td>
              <td style={{verticalAlign: 'middle'}}>{data.role}</td>
              {/*<td>{<button className="btn btn-info" onClick={() => this.openUpdatePopup(data)}>Update</button>}</td>*/}
              <td>{<IconButton className="btn btn-info" onClick={() => this.openUpdatePopup(data)}>
                <micon.Update style={{color: "#22a6b3", frontSize: "30"}}/>
              </IconButton>}</td>
              <td>{<IconButton className="btn btn-danger" onClick={() => this.deleteInfo(data.uid)}>
                <micon.Delete style={{color: "#eb3b5a", frontSize: "30"}}/>
              </IconButton>}</td>
              {/*<td>{<button className="btn btn-danger" onClick={() => this.deleteInfo(data.uid)}>Delete</button>}</td>*/}
            </tr>
        )
      })
    }
  }

  getAllUser(token) {
    getAllUsers(token).then(data => {
      this.setState({list: data.data})
    })
  }

  openNewUserPopup() {
    if (this.state.selectedRole !== "ALL") {
      this.setState({
            popupHeaderText: "Add A New",
            popupBtnText: "Add",
            userinfo: {
              fname: "",
              lname: "",
              uid: "",
              username: ""
            }
          },
          () => {
            this.togglePopup();
          })
    } else alert("Please select a role.");

  }

  onRoleSelect(val) {
    var e = val.target ? val.target : val;
    var that = this;
    this.setState({selectedRole: e.value !== "ALL" ? e.value : ""}, () => {
      if (e.value === 'ALL') {
        that.getAllUser(that.state.token);
      } else {

        getUsersByRole(e.value, that.state.token).then(data => {
          that.setState({list: data.status !== "FAILED" ? data.data : []})
        })
      }
    })
  }

  openUpdatePopup(data) {
    this.setState({
          popupHeaderText: "Update",
          popupBtnText: "Update",
          userinfo: {
            fname: data.firstname,
            lname: data.lastname,
            uid: data.uid,
            username: data.username
          },
          selectedRole: data.role
        },
        () => {
          this.togglePopup();
        })
  }

  addUser(data) {
    var that = this;
    checkDuplicateUsername(data.username, that.state.token).then(response => {
      if (!response.data.length)
        createNewUser(data, that.state.token).then(data => {
          if (data.status === "SUCCESS") {
            that.togglePopup();
            that.setState({
              list: [],
              popupHeaderText: "",
              popupBtnText: "",
              userinfo: {
                fname: "",
                lname: "",
                uid: "",
                username: ""
              },
            }, () => {
              that.onRoleSelect({value: that.state.selectedRole})
            })
          } else {
            alert("Error!!")
          }
        })
      else alert("This username is already existed");
    })

  }

  updateInfo(data) {
    var that = this;
    updateAUser(data, that.state.token).then(response => {
      if (response.status === "SUCCESS") {
        that.props.setFullName(data.firstname, data.lastname)
        that.togglePopup();
        that.setState({
          list: [],
          popupHeaderText: "",
          popupBtnText: "",
          userinfo: {
            fname: "",
            lname: "",
            uid: "",
            username: ""
          },
          selectedRole: "ALL"
        }, () => {
          that.getAllUser(that.state.token)
        })
      }
    })
  }

  deleteInfo(uid) {
    var that = this;
    if (uid !== that.state.uid) {
      if (!window.confirm("Do you really want to delete it?")) return;
      deleteAUser(uid, that.state.token).then(data => {
        alert(data.message);
        that.getAllUser(that.state.token);
      })
    } else {
      alert("You can not delete yourself.")
    }
  }

  closePopup() {
    this.setState({
          popupHeaderText: "",
          popupBtnText: "",
          userinfo: {
            fname: "",
            lname: "",
            uid: "",
            username: ""
          }
        },
        () => {
          this.togglePopup();
        })
  }

  togglePopup() {
    this.setState({showPopup: !this.state.showPopup});
  }
}

export default withStyles(styles, {withTheme: true})(UserTab);
