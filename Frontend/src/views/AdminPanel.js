
import React from "react";

// reactstrap components
import {Button, Card, Container, Row, Col, NavItem, Nav, Table, CustomInput, FormGroup} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

class AdminPanel extends React.Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      fileName: '',
      invalidFile: false
    };

    this.logoutAction = this.logoutAction.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    // this.onChange = this.onChange.bind(this);
  }

  logoutAction() {
    var that = this;
    debugger;
    this.props.history.push({pathname: "/"});
    // that.setState({token: ""}, () => {
    //   that.props.history.push({pathname: "/"});
    // });
  };


  handleFileChange({target: {files}}) {
    const cancel = !files.length;
    if (cancel) return;

    const [{ size, name }] = files;
    const maxSize = 50000;

    if (size < maxSize) {
      this.setState({ fileName: name, invalidFile: false });
    } else {
      this.setState({ fileName: '', invalidFile: true });
    }
  }


  render() {
    const { fileName, invalidFile } = this.state;
    return (
        <>
          <DemoNavbar history = {this.props.history} />
          <main className="profile-page" ref="main">
            <section className="section-profile-cover section-shaped my-0">
              {/* Circles background */}
              <div className="shape shape-style-1 shape-default alpha-4">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              {/* SVG separator */}
              <div className="separator separator-bottom separator-skew">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    version="1.1"
                    viewBox="0 0 2560 100"
                    x="0"
                    y="0"
                >
                  <polygon
                      className="fill-white"
                      points="2560 0 2560 100 0 100"
                  />
                </svg>
              </div>
            </section>
            <section className="section">
              <Container>
                <Card className="card-profile shadow mt--500">
                  <div className="px-4">

                    <div className="mt-5">
                      <CustomInput
                          type="file"
                          id="exampleCustomFileBrowser"
                          name="customFile"
                          label={fileName || 'choose file'}
                          onChange={this.handleFileChange}
                          invalid={invalidFile} />
                    {/*  <h3>*/}
                    {/*    Jessica Jones{" "}*/}
                    {/*    <span className="font-weight-light">, 27</span>*/}
                    {/*  </h3>*/}
                    {/*  <div className="h6 font-weight-300">*/}
                    {/*    <i className="ni location_pin mr-2" />*/}
                    {/*    Bucharest, Romania*/}
                    {/*  </div>*/}
                    {/*  <div className="h6 mt-4">*/}
                    {/*    <i className="ni business_briefcase-24 mr-2" />*/}
                    {/*    Solution Manager - Creative Tim Officer*/}
                    {/*  </div>*/}
                    {/*  <div>*/}
                    {/*    <i className="ni education_hat mr-2" />*/}
                    {/*    University of Computer Science*/}
                    {/*  </div>*/}
                    </div>

                    <div className="mt-5 py-5 border-top text-center">
                      <Row className="justify-content-center">
                        <Col lg="9">
                          <Table bordered>
                            <thead>
                            <tr>
                              <th>
                                #
                              </th>
                              <th>
                                First Name
                              </th>
                              <th>
                                Last Name
                              </th>
                              <th>
                                Username
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                              <th scope="row">
                                1
                              </th>
                              <td>
                                Mark
                              </td>
                              <td>
                                Otto
                              </td>
                              <td>
                                @mdo
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">
                                2
                              </th>
                              <td>
                                Jacob
                              </td>
                              <td>
                                Thornton
                              </td>
                              <td>
                                @fat
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">
                                3
                              </th>
                              <td>
                                Larry
                              </td>
                              <td>
                                the Bird
                              </td>
                              <td>
                                @twitter
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">
                                3
                              </th>
                              <td>
                                Larry
                              </td>
                              <td>
                                the Bird
                              </td>
                              <td>
                                @twitter
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">
                                3
                              </th>
                              <td>
                                Larry
                              </td>
                              <td>
                                the Bird
                              </td>
                              <td>
                                @twitter
                              </td>
                            </tr>
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Card>
              </Container>
            </section>
          </main>
          <SimpleFooter />
        </>
    );
  }
}

export default AdminPanel;
