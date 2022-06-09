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

import {createNewUser} from "../API/utils";

class Register extends React.Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }

  constructor(props) {
    super(props);
    this.state = {
      userid: 0,
      username: '',
      password: '',
      fullname: '',
      usertype: 'user'
    };

    this.createUser = this.createUser.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(val, type){
    if(type === "username") {
      this.setState({ username: val })
    }
    else if(type === "password"){
      this.setState({password: val})
    }
    else{
      this.setState({fullname: val})
    }
  }

  createUser(){
    var that = this;
    var data = {
      "user_id" : 10000,
      "fullname": that.state.fullname,
      "user_name": that.state.username,
      "password": that.state.password,
      "user_type": that.state.usertype
    }
    createNewUser(data).then(response => {
      if (response.statusText === 'OK' && response.status === 200) {
        console.log(response.data)
        // if (response.role === "Admin") that.props.history.push({
        //   pathname: redirectadminpath,
        //   state: {token: response.token, uid: response.uid}
        // });
        // else if (response.role === "Teacher") that.props.history.push({
        //   pathname: redirectteacherpath,
        //   state: {token: response.token, uid: response.uid}
        // });
        // else that.props.history.push({pathname: redirectpupilpath, state: {token: response.token, uid: response.uid}});

      } else alert("Login falied!")
    }).catch(err => {
      console.log(err)
    });

  }

  render() {
    return (
      <>
        <DemoNavbar />
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
            <Container className="pt-lg-9">
              <Row className="justify-content-center">
                <Col lg="5">
                  <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-white pb-2">
                      <div className="text-muted text-center mb-3">
                        <h1 className="display-3">Registration</h1>
                      </div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                      <Form role="form">
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Username" type="username" onChange={(e, type) => this.onChange(`${e.target.value}`, "username")}/>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-circle-08" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Full Name" type="text" onChange={(e, type) => this.onChange(`${e.target.value}`, "fullname")}/>
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
                              onChange={(e, type) => this.onChange(`${e.target.value}`, "password")}
                            />
                          </InputGroup>
                        </FormGroup>
                        <div className="text-center">
                          <Button
                            className="mt-4"
                            color="primary"
                            type="button"
                            onClick={this.createUser}
                          >
                            Create account
                          </Button>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
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

export default Register;
