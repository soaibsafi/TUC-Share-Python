
import React from "react";
import { Link } from "react-router-dom";
// JavaScript plugin that hides or shows a component based on your scroll
import Headroom from "headroom.js";
// reactstrap components
import {
  Button,
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

class DemoNavbar extends React.Component {
  componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-main"));
    // initialise
    headroom.init();
  }

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      history : props.history
    };

    this.logoutAction = this.logoutAction.bind(this);
    // this.onChange = this.onChange.bind(this);
  }
  state = {
    collapseClasses: "",
    collapseOpen: false
  };

  onExiting = () => {
    this.setState({
      collapseClasses: "collapsing-out"
    });
  };

  onExited = () => {
    this.setState({
      collapseClasses: ""
    });
  };

  logoutAction() {
    var that = this;
    debugger;
    this.state.history.push({pathname: "/"});
    // that.setState({token: ""}, () => {
    //   that.props.history.push({pathname: "/"});
    // });
  };

  render() {
    return (
      <>
        <header className="header-global">
          <Navbar
            className="navbar-main navbar-transparent navbar-light headroom"
            expand="lg"
            id="navbar-main"
          >
            <Container>
              <button className="navbar-toggler" id="navbar_global">
                <span className="navbar-toggler-icon" />
              </button>
              <UncontrolledCollapse
                toggler="#navbar_global"
                navbar
                className={this.state.collapseClasses}

              >
                <Nav className="align-items-lg-center ml-lg-auto" navbar>
                  <NavItem className="d-none d-lg-block ml-lg-4">
                    <Button
                      className="btn-neutral btn-icon"
                      color="default"
                      // href="/Shibboleth.sso/Login?target=https://www.tu-chemnitz.de/urz/www/auth/examples/dir23/"
                      target="_blank"
                      onClick={this.logoutAction}
                    >
                      <span className="btn-inner--icon">
                        <i className="fa fa-power-off mr-2" />
                      </span>
                      <span className="nav-link-inner--text ml-1">
                        Sign Out
                      </span>
                    </Button>
                  </NavItem>
                </Nav>
              </UncontrolledCollapse>
            </Container>
          </Navbar>
        </header>
      </>
    );
  }
}



export default DemoNavbar;
