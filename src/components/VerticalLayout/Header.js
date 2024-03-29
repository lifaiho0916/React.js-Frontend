import PropTypes from "prop-types"
import React, { useState } from "react"

import { connect } from "react-redux"
import {
  Form,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Input,
  Button,
} from "reactstrap"

import { Link } from "react-router-dom"

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown"
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"

import logodarkImg from "../../assets/images/logo-dark.png"
import logosmImg from "../../assets/images/logo-sm.png"
import logolightImg from "../../assets/images/logo-light.png"
import Switch from "react-switch"
import './scss/header.scss'
//i18n
import { withTranslation } from "react-i18next"

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions"

const Offsymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      No
    </div>
  )
}

const OnSymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      Yes
    </div>
  )
}

const Header = props => {
  const [search, setsearch] = useState(false)
  const [singlebtn, setSinglebtn] = useState(false)
  const [switch1, setswitch1] = useState(false)

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        )
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    }
  }

  function tToggle() {
    var body = document.body
    if (window.screen.width <= 992) {
      body.classList.toggle("sidebar-enable")
    } else {
      body.classList.toggle("vertical-collpsed")
      body.classList.toggle("sidebar-enable")
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header d-flex justify-content-between" >
          <div className="d-flex">
            <div className="navbar-brand-box" style={{ width: 255 }}>
              <Link to="/" className="logo logo-dark">
                <div className="logo-sm w-100">
                  <img src={logosmImg} alt="" height="22" />
                </div>
                <div className="logo-xl w-100">
                  <img src={logodarkImg} alt="" height="30" />
                </div>
              </Link>

              <Link
                to="/"
                className="logo logo-light"

              >
                <div className="logo-sm w-100">
                  <img src={logosmImg} alt="" height="22" />
                </div>
                <div className="logo-lg w-100">
                  <img src={logodarkImg} alt="" height="18" />
                </div>
              </Link>
            </div>
          </div>

          <div className="d-flex flex-1 row m-0">
            <div className="col-xl-12 d-flex">
              {/* <button type="button" className="btn btn-sm px-3 font-size-24 header-item waves-effect"
                  id="vertical-menu-btn"
                  onClick={() => {
                    tToggle()
                  }}
                  data-target="#topnav-menu-content"
                >
                <i className="mdi mdi-menu"></i>
              </button> */}

              <div className="d-flex">
                <div className="position-relative  ms-3" >
                  <span
                    className="fa fa-search position-absolute"
                    style={{
                      fontSize: "14px",
                      left: "16px",
                      top: "12px",
                    }}
                  ></span>
                  <input
                    type="text"
                    className="form-control navbar-search"
                    placeholder={props.t("Search") + "..."}
                    style={{
                      paddingLeft: "40px",
                    }}
                  />
                </div>

                <div className="form-check form-switch custom-switch d-flex align-items-center ms-5 p-0">
                  <div style={{ width: 24 }}>
                    <input
                      className="form-check-input m-0"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"

                    />
                  </div>
                  <label
                    className="form-check-label mb-0 ms-3"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    <b>LIGHT MODE</b>
                  </label>
                </div>
              </div>
            </div>

            {/* Right part, Profile, Avatar, Notification */}

          </div>
          <div className="d-flex">
            <Dropdown
              className="d-inline-block d-lg-none ms-2"
              onClick={() => {
                setsearch(!search)
              }}
              type="button"
            >

              <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                <Form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <Input
                        type="text"
                        className="form-control navbar-search-box"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <Button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </DropdownMenu>
            </Dropdown>

            <div className="d-flex flex-1 justify-content-end" >
              <ProfileMenu />
              <NotificationDropdown />
              <div className="email-icon-container ps-2" >
                <i className="mdi mdi-email-outline" style={{color:'#525f80'}}></i>
              </div>

              <div className="dropdown d-inline-block" style={{ paddingLeft: 12, paddingRight: 20 }}>
                <button
                  type="button"
                  className="btn header-item noti-icon right-bar-toggle waves-effect p-0"

                >
                  <i className="mdi mdi-gift" style={{ fontSize: "27px" }}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
}

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header))
