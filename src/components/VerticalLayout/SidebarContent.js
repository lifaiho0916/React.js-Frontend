import PropTypes from "prop-types"
import React, { useEffect, useRef } from "react"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import { withRouter } from "react-router-dom"
import { Link } from "react-router-dom"

import sampleAvatar from "../../assets/images/users/user-1.jpg"
//i18n
import { withTranslation } from "react-i18next"
import "./scss/sidebar.scss"

const SidebarContent = props => {
  const ref = useRef()
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname

    const initMenu = () => {
      new MetisMenu("#side-menu")
      let matchingMenuItem = null
      const ul = document.getElementById("side-menu")
      const items = ul.getElementsByTagName("a")
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem)
      }
    }
    initMenu()
  }, [props.location.pathname])

  useEffect(() => {
    ref.current.recalculate()
  })

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }

  const user = JSON.parse(localStorage.getItem("authUser"))

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="sidebar-avatar-container">
              <div className="sidebar-avatar d-flex align-items-center">
                <div style={{ height: "90%", marginLeft: "4px" }}>
                  <img src={sampleAvatar} className="h-100 rounded-circle" />
                </div>
                <div className="ms-3 text-dark" style={{ marginRight: "auto" }}>
                  <h4 style={{ marginBottom: "0px" }}>{user.name}</h4>
                  <div className="text-black-50">{user.role}</div>
                </div>
                <div>
                  <span
                    className="mdi mdi-chevron-down"
                    style={{ fontSize: 25 }}
                  ></span>
                </div>
              </div>
            </li>

            <form className="app-search d-none d-lg-block sidebar-padding">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control bg-dark text-white rounded"
                  placeholder={props.t("Search") + "..."}
                  style={{ backgroundColor: "rgb(35, 35, 40) !important", padding: "25px", }}
                />
                <span className="fa fa-search"></span>
              </div>
            </form>
            <div>
              <li>
                <Link to="/profile-home" className="waves-effect text-uppercase">
                  <span>{props.t("PROFILEHOME")}</span>
                </Link>
              </li>

              <li>
                <Link to="/#" className="has-arrow waves-effect text-uppercase">
                  <span>{props.t("ORDER FLOW")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="true">
                  <li>
                    <Link to="/#">{props.t("Dashboard")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Projects")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Drafting")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Inventory")}</Link>
                  </li>
                  <li>
                    <Link to="/orderflow/production-tracker">
                      {props.t("Production Tracker")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Load out")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Project Close")}</Link>
                  </li>
                  
                </ul>
              </li>

              <li>
                <Link to="/#" className="has-arrow waves-effect text-uppercase">
                  <span>{props.t("Production")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="true">
                  <li>
                    <Link to="/production/timer">{props.t("Timer")}</Link>
                  </li>
                  <li>
                    <Link to="/production/control-timers">{props.t("Control Timers")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("System Check")}</Link>
                  </li>
                  <li>
                    <Link to="/production/list">{props.t("Product List")}</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/#" className="has-arrow waves-effect text-uppercase">
                  <span>{props.t("Operations")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="true">
                  <li>
                    <Link to="/#">{props.t("Dashboard")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Quality Control")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Maintenance")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Safety 101")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Forms")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Line Data")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("FIXX")}</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/#" className="has-arrow waves-effect text-uppercase">
                  <span>{props.t("Human Resources")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="true">
                  <li>
                    <Link to="/#">{props.t("Dashboard")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("ADT")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Down Time")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Community")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Msg / Discussions")}</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  to="/PROFILEHOME"
                  className="waves-effect d-flex justify-content-between text-uppercase"
                >
                  <span>{props.t("Accounting")}</span>
                  <span className="mdi mdi-chevron-right"></span>
                </Link>
              </li>

              <li>
                <Link
                  to="/PROFILEHOME"
                  className="waves-effect d-flex justify-content-between text-uppercase"
                >
                  <span>{props.t("Sales")}</span>
                  <span className="mdi mdi-chevron-right"></span>
                </Link>
              </li>
            </div>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
