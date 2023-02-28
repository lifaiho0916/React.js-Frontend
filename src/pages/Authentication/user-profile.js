import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useState, useEffect, useRef } from "react"
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
import './styles.scss'
// Redux
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Import Breadcrumb

// actions
import { editProfile, resetProfileFlag } from "../../store/actions"

import "react-image-picker-editor/dist/index.css"
import axios from "axios"

const UserProfile = props => {
  const authuser = JSON.parse(localStorage.getItem("authUser"))
  const [user, setUser] = useState(authuser)
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
  const userAvatarRef = useRef()
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


  const avatarUrl = "https://apms.global/uploads/" + authuser.name + ".png"
  const brand = "BRAND"
  const updateUser = (e, field) => {
    const _user = { ...user, [field]: e.target ? e.target.value : e }
    setUser(_user)
  }
  console.log(user)
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Profile</title>
        </MetaTags>
        <Container fluid>
          <div className="eidt-account-page-container mt-5 mx-auto">
            <div className='page-content-header'>
              <h2>My Profile</h2>
              <div className='sub-menu text-uppercase'>
                <span className="parent">OVERVIEW</span>
                <span className="mx-1"> &gt; </span>
                <span className='sub text-danger'>EDIT ACCOUNT</span>
              </div>
              <div className='divide-line d-flex align-items-center pt-5'>
                <div className='line'></div>
              </div>
            </div>


            <div className="mt-5 mx-auto">

              <h3>Basic Information</h3>

              <Card>
                <CardBody>
                  <div className="list-group list-group-form">
                    <div className="list-group-item ">
                      <div className="form-group row align-items-center mb-0">
                        <label className="form-label col-form-label col-sm-3">
                          First name
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            value={user.firstName}
                            placeholder="Your first name ..."
                            onChange={e => updateUser(e, 'firstName')}
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
                            value={user.lastName}
                            placeholder="Your last name ..."
                            onChange={e => updateUser(e, 'lastName')}

                          />
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item rounded-0">
                      <div className="form-group row align-items-center mb-0">
                        <label className="form-label col-form-label col-sm-3">
                          Email address
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="email"
                            className="form-control"
                            value={user.email}
                            placeholder="Your email address ..."
                            onChange={e => updateUser(e, 'email')}
                          />
                          <div className="mt-1 text-black-50">
                            Note that if you change your email, you will have to
                            confirm it again.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button className="btn-primary float-right">SAVE CHANGES</Button>
                </CardFooter>
              </Card>

              <h3>Profile & Privacy</h3>

              <Card>
                <CardBody>
                  <div className="list-group list-group-form">
                    <div className="list-group-item">
                      <div className="form-group row align-items-center mb-0">
                        <label className="col-form-label form-label col-sm-3">
                          Your photo
                        </label>
                        <div className="col-sm-9 media d-flex align-items-center">
                          <a href="" className="media-left mr-16pt">
                            <img
                              src={sampleAvatar}
                              alt="people"
                              width="56"
                              className="rounded-circle"
                            />
                          </a>
                          <div className="media-body ps-3 flex-fill">
                            <div className="custom-file w-100 ">
                              <input
                                type="file"
                                ref={userAvatarRef}
                                className="custom-file-input d-none"
                                id="inputGroupFile01"
                              />
                              <div className="d-flex align-items-center cursor-pointer" onClick={() => userAvatarRef.current.click()}>
                                <div className="form-control rounded-0 rounded-start">
                                  Choose File
                                </div>
                                <div
                                  className="custom-file-label form-control border-start-0 rounded-0 rounded-end text-white"
                                  htmlFor="inputGroupFile01"
                                  style={{ background: '#868e96', width: 80, borderWidth: 1, borderColor: 'rgb(134, 142, 150)' }}
                                >
                                  Browse
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="form-group row align-items-center mb-0">
                        <label className="col-form-label form-label col-sm-3">
                          Ameritex profile name
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            defaultValue=""
                            placeholder="Your profile name ..."
                          />

                        </div>
                      </div>
                      <div className="row justify-content-end">
                        <div className="mt-1 text-black-50 col-sm-9">
                          Your profile name will be used as part of your
                          public profile URL address.
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
                          id="displayrealname"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="displayrealname"
                        >
                          Display your real name on your profile
                        </label>

                      </div>
                      <div className=" text-muted">
                        If unchecked, your profile name will be displayed
                        instead of your full name.
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="profilevisibility"
                          checked
                          readOnly
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="profilevisibility"
                        >
                          Allow everyone to see your profile
                        </label>

                      </div>
                      <div className=" text-muted">
                        If unchecked, your profile will be private and no one
                        except you will be able to view it.
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button className="btn-primary float-right">SAVE CHANGES</Button>
                </CardFooter>
              </Card>

              <h3>Updates from Ameritex</h3>
              <Card>
                <CardBody>
                  <div className="list-group list-group-form">
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="ameritexnews"
                          defaultChecked
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="ameritexnews"
                        >
                          Ameritex Newsletter
                        </label>

                      </div>
                      <div className=" text-muted">
                        Get the latest on company news.
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="newcontent"
                          defaultChecked
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="newcontent"
                        >
                          New Content Releases
                        </label>

                      </div>
                      <div className=" text-muted">
                        Send me an email when new courses or bonus content is
                        released.
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="featureupdated"
                          defaultChecked
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="featureupdated"
                        >
                          Product &amp; Feature Updates
                        </label>

                      </div>
                      <div className=" text-muted">
                        Be the first to know when we announce new features and
                        updates.
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="emailfromteam"
                          defaultChecked
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="emailfromteam"
                        >
                          Emails from Team Memebers
                        </label>

                      </div>
                      <div className=" text-muted">
                        Get messages, encouragement and helpful information
                        from your teachers.
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="contentsuggestions"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="contentsuggestions"
                        >
                          Content Suggestions
                        </label>

                      </div>
                      <div className=" text-muted">
                        Get daily content suggestions to keep you on track.
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button className="btn-primary float-right">SAVE CHANGES</Button>
                </CardFooter>
              </Card>

              <h3>Change Password</h3>
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
                        <label className="form-label col-form-label col-sm-3">
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
                      <div className=" form-group row mb-0">
                        <label className="form-label col-form-label col-sm-3">
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
                  <Button className="btn-primary float-right">SAVE CHANGES</Button>
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
