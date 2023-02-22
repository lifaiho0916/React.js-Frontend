import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Media,
  Button,
  CardFooter,
} from "reactstrap"
import sampleAvatar from "../../assets/images/users/user-1.jpg"
// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// Redux
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"

// actions
import { editProfile, resetProfileFlag } from "../../store/actions"

import ReactImagePickerEditor, {
  ImagePickerConf,
} from "react-image-picker-editor"
import "react-image-picker-editor/dist/index.css"
import axios from "axios"

const UserProfile = props => {
  const [email, setemail] = useState("")
  const [name, setname] = useState("")
  const [idx, setidx] = useState(1)

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"))
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        setname(obj.displayName)
        setemail(obj.email)
        setidx(obj.uid)
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        setname(obj.username)
        setemail(obj.email)
        setidx(obj.uid)
      }
      setTimeout(() => {
        props.resetProfileFlag()
      }, 3000)
    }
  }, [props.success])

  function handleValidSubmit(event, values) {
    props.editProfile(values)
  }

  const config2 = {
    borderRadius: "50px",
    language: "en",
    width: "100px",
    height: "100px",
    objectFit: "contain",
    compressInitial: null,
  }
  const [imageSrc, setImageSrc] = useState(null)
  const avatarChanged = async src => {
    setImageSrc(src)
    let formData = new FormData()
    var arr = src.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    const file = new File([u8arr], "avatar.png", { type: mime })
    formData.append("avatar", file)
    const response = await axios.post("/auth/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  }

  const user = JSON.parse(localStorage.getItem("authUser"))
  const avatarUrl = "https://apms.global/uploads/" + user.name + ".png"
  const brand = "BRAND"

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Profile</title>
        </MetaTags>
        <Container fluid>
          <div className="page-title-box timer-page-container mt-5 mx-auto">
            <Row className="align-items-center">
              <Col md={8}>
                <h1 className="page-title" style={{ fontSize: "44px" }}>
                  My Profile
                </h1>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">OVERVIEW</li>
                </ol>
              </Col>

              <Col md="4">
                <div className="float-end d-none d-md-block"></div>
              </Col>
            </Row>
            {/* Render Breadcrumb */}
            {/* <Breadcrumb title="Veltrix" breadcrumbItem="Profile" /> */}

            <div className="timer-page-container mt-5 mx-auto">
              {/* {props.error && props.error ? (
                <Alert color="danger">{props.error}</Alert>
              ) : null}
              {props.success ? (
                <Alert color="success">{props.success}</Alert>
              ) : null} */}

              <h4>Basic Information</h4>

              <Card>
                <CardBody>
                  <div className="list-group list-group-form">
                    <div className="list-group-item">
                      <div className="form-group row align-items-center mb-0">
                        <label className="form-label col-form-label col-sm-3">
                          First name
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            value="Alexander"
                            placeholder="Your first name ..."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="form-group row align-items-center mb-0">
                        <label className="form-label col-form-label col-sm-3">
                          Last name
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            value="Watson"
                            placeholder="Your last name ..."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="form-group row align-items-center mb-0">
                        <label className="form-label col-form-label col-sm-3">
                          Email address
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="email"
                            className="form-control"
                            value="alexander.watson@fake-mail.com"
                            placeholder="Your email address ..."
                          />
                          <small className="form-text text-muted">
                            Note that if you change your email, you will have to
                            confirm it again.
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button className="btn-primary float-right">Save</Button>
                </CardFooter>
              </Card>

              <h4>Profile & Privacy</h4>

              <Card>
                <CardBody>
                  <div className="list-group list-group-form">
                    <div className="list-group-item">
                      <div className="form-group row align-items-center mb-0">
                        <label className="col-form-label form-label col-sm-3">
                          Your photo
                        </label>
                        <div className="col-sm-9 media align-items-center">
                          <a href="" className="media-left mr-16pt">
                            <img
                              src={sampleAvatar}
                              alt="people"
                              width="56"
                              className="rounded-circle"
                            />
                          </a>
                          <div className="media-body">
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input"
                                id="inputGroupFile01"
                              />
                              <label
                                className="custom-file-label"
                                for="inputGroupFile01"
                              >
                                Choose file
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="form-group row align-items-center mb-0">
                        <label className="col-form-label form-label col-sm-3">
                          ameritex profile name
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            value="ameritex.com/alexander"
                            placeholder="Your profile name ..."
                          />
                          <small className="form-text text-muted">
                            Your profile name will be used as part of your
                            public profile URL address.
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="form-group row align-items-center mb-0">
                        <label className="col-form-label form-label col-sm-3">
                          About you
                        </label>
                        <div className="col-sm-9">
                          <textarea
                            rows="3"
                            className="form-control"
                            placeholder="About you ..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          checked
                          id="customCheck1"
                        />
                        <label
                          className="custom-control-label"
                          for="customCheck1"
                        >
                          Display your real name on your profile
                        </label>
                        <small className="form-text text-muted">
                          If unchecked, your profile name will be displayed
                          instead of your full name.
                        </small>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          checked
                          id="customCheck2"
                        />
                        <label
                          className="custom-control-label"
                          for="customCheck2"
                        >
                          Allow everyone to see your profile
                        </label>
                        <small className="form-text text-muted">
                          If unchecked, your profile will be private and no one
                          except you will be able to view it.
                        </small>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button className="btn-primary float-right">Save</Button>
                </CardFooter>
              </Card>

              <h4>Updates from ameritex</h4>
              <Card>
                <CardBody>
                  <div className="list-group list-group-form">
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          checked
                          id="customCheck1"
                        />
                        <label
                          className="custom-control-label"
                          for="customCheck1"
                        >
                          ameritex Newsletter
                        </label>
                        <small className="form-text text-muted">
                          Get the latest on company news.
                        </small>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          checked
                          id="customCheck2"
                        />
                        <label
                          className="custom-control-label"
                          for="customCheck2"
                        >
                          New Content Releases
                        </label>
                        <small className="form-text text-muted">
                          Send me an email when new courses or bonus content is
                          released.
                        </small>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          checked
                          id="customCheck3"
                        />
                        <label
                          className="custom-control-label"
                          for="customCheck3"
                        >
                          Product &amp; Feature Updates
                        </label>
                        <small className="form-text text-muted">
                          Be the first to know when we announce new features and
                          updates.
                        </small>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          checked
                          id="customCheck4"
                        />
                        <label
                          className="custom-control-label"
                          for="customCheck4"
                        >
                          Emails from Teachers
                        </label>
                        <small className="form-text text-muted">
                          Get messages, encouragement and helpful information
                          from your teachers.
                        </small>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customCheck5"
                        />
                        <label
                          className="custom-control-label"
                          for="customCheck5"
                        >
                          Content Suggestions
                        </label>
                        <small className="form-text text-muted">
                          Get daily content suggestions to keep you on track.
                        </small>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button className="btn-primary float-right">Save</Button>
                </CardFooter>
              </Card>

              <h4>Change Password</h4>
              <Card>
                <CardBody>
                  {/* <div className="alert alert-soft-warning">
                  <div className="d-flex flex-wrap align-items-center">
                    <div className="mr-8pt">
                      <i className="material-icons">check_circle</i>
                    </div>
                    <div className="flex" style="min-width: 180px">
                      <small className="text-100">
                        An email with password reset instructions has been sent
                        to your email address, if it exists on our system.
                      </small>
                    </div>
                  </div>
                </div> */}

                  <div className="list-group list-group-form">
                    <div className="list-group-item">
                      <div className="form-group row mb-0">
                        <label className="col-form-label col-sm-3">
                          New password
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Password ..."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="form-group row mb-0">
                        <label className="col-form-label col-sm-3">
                          Confirm password
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm password ..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button className="btn-primary float-right">Save</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

UserProfile.propTypes = {
  editProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, { editProfile, resetProfileFlag })(UserProfile)
)
