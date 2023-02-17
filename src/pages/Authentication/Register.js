import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import MetaTags from 'react-meta-tags';
import { Row, Col, CardBody, Card, Alert, Container, Label } from "reactstrap"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// action
import { registerUser, apiError, registerUserFailed } from "../../store/actions"

// Redux
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Select from "react-select"
// import images
import logoSm from "../../assets/images/logo-sm.png";

const Register = props => {

  const roles = [
    {
      label: "Role",
      options: [
        {
          value: 'Admin',
          label: 'Admin'
        },
        {
          value: 'Corporate',
          label: 'Corporate'
        },
        {
          value: 'Production',
          label: 'Production'
        },
        {
          value: 'Personnel',
          label: 'Personnel'
        },
      ]
    }
  ]
  const [role, setRole] = useState(roles[0].options[1])

  const locationOptions = [
    {
      label: "Location",
      options: [
        {
          value: "Seguin",
          label: "Seguin"
        },
        {
          value: "Conroe",
          label: "Conroe"
        },
        {
          value: "Gunter",
          label: "Gunter"
        }
      ]
    }
  ]
  const [location, setLocation] = useState(locationOptions[0].options[0])

  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
    props.registerUser({
      ...values,
      role: role.value,
      location: location.value
    })
  }

  useEffect(() => {
    props.apiError("")
  }, []);

  const [fields, setFields] = useState({
    email: "", name: "", password: "", newPassword: ""
  })
  const valueChanged = (e, field) => {
    const _fields = {
      ...fields,
      [field]: e.target.value
    }
    setFields(_fields)

    const keys = Object.keys(_fields)
    let empty = 0
    for (const key of keys) {
      if (_fields[key] == "") empty++
    }

    if (!empty) setAvailable(true)
    else setAvailable(false)
  }

  const [available, setAvailable] = useState(false)

  return (
    <React.Fragment>
      <MetaTags>
        <title>Register | Veltrix - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2"></i>
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={4}>
              <Card className="overflow-hidden">
                <div className="bg-primary">
                  <div className="text-primary text-center p-4">
                    <h5 className="text-white font-size-20">Free Register</h5>
                    <p className="text-white-50">Get your free Veltrix account now.</p>
                    <a href="index.html" className="logo logo-admin">
                      <img src={logoSm} height="24" alt="logo" />
                    </a>
                  </div>
                </div>
                <CardBody className="p-4">
                  <div className="p-3" style={{overflowX: 'hidden', overflowY: 'auto'}}>
                    <AvForm
                      className="mt-4"
                      onValidSubmit={(e, v) => {
                        handleValidSubmit(e, v)
                      }}
                    >
                      {props.user && props.user ? (
                        <Alert color="success">
                          Register User Successfully
                        </Alert>
                      ) : null}

                      {props.registrationError &&
                        props.registrationError ? (
                          <Alert color="danger">
                            {props.registrationError}
                          </Alert>
                        ) : null}

                      <div className="mb-3">
                        <AvField
                          id="email"
                          name="email"
                          label="Email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          required
                          onChange={(e) => valueChanged(e, "email")}
                        />
                      </div>

                      <div className="mb-3">
                        <AvField
                          name="username"
                          label="Username"
                          type="text"
                          required
                          placeholder="Enter username"
                          onChange={(e) => valueChanged(e, "name")}
                        />
                      </div>
                      <div className="mb-3">
                        <AvField
                          name="password"
                          label="Password"
                          type="password"
                          required
                          placeholder="Enter Password"
                          onChange={(e) => valueChanged(e, "password")}
                        />
                      </div>
                      <div className="mb-3">
                        <AvField
                          name="confirmPassword"
                          label="Confirm Password"
                          type="password"
                          required
                          placeholder="Confirm Password"
                          onChange={(e) => valueChanged(e, "newPassword")}
                        />
                      </div>
                      <div className="mb-3">
                        <Label>Role</Label>
                        <Select
                          value={role}
                          onChange={(v) => {
                            setRole(v)
                          }}
                          options={roles}
                          classNamePrefix="select2-selection"
                        />
                      </div>
                      {
                        role.value != "Admin" ? <div className="mb-3">
                          <Label>Location</Label>
                          <Select
                            value={location}
                            onChange={(v) => {
                              role.value == "production" ? setFacotryLocation(v) : setLocation(v)
                            }}
                            options={locationOptions}
                            classNamePrefix="select2-selection"
                          />
                        </div> : ""
                      }

                      <div className="mb-3 row">
                        <div className="col-12 text-end">
                          <button
                            className="btn btn-primary w-md waves-effect waves-light"
                            type="submit"
                            disabled={!available}
                          >
                            Register
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 mb-0 row">
                        <div className="col-12 mt-4">
                          <p className="mb-0">
                            By registering you agree to the Veltrix{" "}
                            <Link to="#" className="text-primary">
                              Terms of Use
                            </Link>
                          </p>
                        </div>
                      </div>
                    </AvForm>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Already have an account ?{" "}
                  <Link to="/login" className="fw-medium text-primary">
                    {" "}
                    Login
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Veltrix. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Ieoko Media
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

Register.propTypes = {
  registerUser: PropTypes.func,
  registerUserFailed: PropTypes.func,
  registrationError: PropTypes.any,
  user: PropTypes.any,
}

const mapStatetoProps = state => {
  const { user, registrationError, loading } = state.Account
  return { user, registrationError, loading }
}

export default connect(mapStatetoProps, {
  registerUser,
  apiError,
  registerUserFailed,
})(Register)
