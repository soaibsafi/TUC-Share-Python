/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

class Login extends React.Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.loginAction = this.loginAction.bind(this);
    this.loadRegistration = this.loadRegistration.bind(this)
    this.onChange = this.onChange.bind(this);
  }

  loadRegistration(){
    this.props.history.push({ pathname: "/register-page" });
    console.log(this.state.username)
  }

  loginAction() {

    // var data = {
    //   'username': that.state.username,
    //   'password': that.state.password
    // }
    this.props.history.push({ pathname: "/profile-page" });
    console.log(this.state.username)
    // login(data).then(response => {
    //   if (response.status === 'SUCCESS') {
    //     if (response.role === "Admin") that.props.history.push({ pathname: redirectadminpath, state: { token: response.token, uid:  response.uid} });
    //     else if (response.role === "Teacher") that.props.history.push({ pathname: redirectteacherpath, state: { token: response.token, uid: response.uid } });
    //     else that.props.history.push({ pathname: redirectpupilpath, state: { token: response.token, uid: response.uid } });
    //
    //   }
    //   else alert("Login falied!")
    // }).catch(err => { console.log(err) });

  }
  onChange(val, type){
    if(type == "email") {
      this.setState({ username: val })
    }
  }
  render() {
    // var that = this
    return (
      <>
        {/*<DemoNavbar />*/}
        <main ref="main">
          <section className="section section-shaped section-lg">
            <div className="shape shape-style-1 bg-gradient-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <Container className="pt-lg-8">
              <Row className="justify-content-center">
                <Col lg="5">
                  <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-white pb-2">
                      <div className="text-muted text-center mb-3">
                        <h1 className="display-3">Sign in</h1>
                      </div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">

                      <Form role="form">
                        <FormGroup className="mb-3">
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Email" type="email" onChange={(e, type) => this.onChange(`${e.target.value}`, "email")} />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-lock-circle-open" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Password"
                              type="password"
                              autoComplete="off"
                            />
                          </InputGroup>
                        </FormGroup>
                        <div className="text-center">
                          <Button
                            className="my-4"
                            color="primary"
                            type="button"
                            onClick={this.loginAction}
                          >
                            Sign in
                          </Button>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                  <Row className="mt-3">
                    <Col xs="6">
                      <a
                        className="text-light"
                        href="#pablo"
                        onClick={this.loginAction}
                      >
                        <small>Or upload as guest</small>
                      </a>
                    </Col>
                    <Col className="text-right" xs="6">
                      <a
                        className="text-light"
                        href="#pablo"
                        onClick={this.loadRegistration}
                      >
                        <small>Create new account</small>
                      </a>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </section>
        </main>
        {/*<SimpleFooter />*/}
      </>
    );
  }
}

export default Login;
