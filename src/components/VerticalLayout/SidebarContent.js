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
    const _parent = parent.parentElement
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
            <li className="sidebar-avatar-container p-3 pe-0">
              <div className="sidebar-avatar d-flex align-items-center justify-content-between px-3 py-2">
                <div className=" d-flex align-items-center">
                  <div >
                    <img src={sampleAvatar} className="h-100 rounded-circle" />
                  </div>
                  <div className="text-dark mx-auto ps-2">
                    <h4 className="mb-0 font-size-16">{user.firstName + ' ' + user.lastName}</h4>
                    <div className="text-black-50">{user.role === 'Admin' ? 'Administrator' : user.role}</div>
                  </div>
                </div>
                <div>
                  <span
                    className="mdi mdi-chevron-down font-size-16"
                    style={{ color: '#5b626b' }}
                  ></span>
                </div>
              </div>
            </li>

            <form className="app-search d-none d-lg-block p-0 ps-3">
              <div className="position-relative pb-3">
                <input
                  type="text"
                  className="form-control bg-dark text-white rounded"
                  placeholder={props.t("Search") + "..."}
                  style={{ backgroundColor: "rgb(35, 35, 40) !important" }}
                />
                <span className="fa fa-search"></span>
              </div>
            </form>
            <div>
              <li className="profile-menu" style={{}}>
                <Link to="/profile-home" className="waves-effect text-capitalize" >
                  <span>{props.t("Profile Home")}</span>
                </Link>
              </li>

              <li>
                <Link to="/#" className="has-arrow waves-effect text-capitalize">
                  <span>{props.t("Order Flow")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="true">
                  <li>
                    <Link to="/orderflow/dashboard">{props.t("Project Dashboard")}</Link>
                  </li>
                  <li>
                    <Link to="/orderflow/projects">{props.t("Projects")}</Link>
                  </li>
                  <li>
                    <Link to="/orderflow/drafting">{props.t("Drafting")}</Link>
                  </li>
                  <li>
                    <Link to="/orderflow/inventory">{props.t("Inventory")}</Link>
                  </li>
                  <li>
                    <Link to="/orderflow/production-tracker">
                      {props.t("Production Tracker")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/orderflow/load-out">{props.t("Load out")}</Link>
                  </li>
                  <li>
                    <Link to="/orderflow/project-close">{props.t("Project Close")}</Link>
                  </li>

                </ul>
              </li>

              <li>
                <Link to="/#" className="has-arrow waves-effect text-capitalize">
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
                    <Link to="/production/system-check">{props.t("System Check")}</Link>
                  </li>
                  <li>
                    <Link to="/production/list">{props.t("Product List")}</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/#" className="has-arrow waves-effect text-capitalize">
                  <span>{props.t("Operations")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="true">
                  <li>
                    <Link to="/operations/dashboard">{props.t("Operations Dashboard")}</Link>
                  </li>
                  <li>
                    <Link to="/operations/quality-control">{props.t("Quality Control")}</Link>
                  </li>
                  <li>
                    <Link to="/operations/maintenance">{props.t("Maintenance")}</Link>
                  </li>
                  <li>
                    <Link to="/operations/safety101">{props.t("Safety 101")}</Link>
                  </li>
                  <li>
                    <Link to="/operations/forms">{props.t("Forms")}</Link>
                  </li>
                  <li>
                    <Link to="/operations/line-data">{props.t("Line Data")}</Link>
                  </li>
                  <li>
                    <Link to="/operations/fixx">{props.t("FIXX")}</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/#" className="has-arrow waves-effect text-capitalize">
                  <span>{props.t("Human Resources")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="true">
                  <li>
                    <Link to="/human-resources/dashboard">{props.t("HR Dashboard")}</Link>
                  </li>
                  <li>
                    <Link to="/human-resources/adt">{props.t("ADT")}</Link>
                  </li>
                  <li>
                    <Link to="/human-resources/down-time">{props.t("Down Time")}</Link>
                  </li>
                  <li>
                    <Link to="/human-resources/community">{props.t("Community")}</Link>
                  </li>
                  <li>
                    <Link to="/human-resources/msg-discussions">{props.t("Msg / Discussions")}</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/#" className="has-arrow waves-effect text-capitalize">
                  <span>{props.t("Accounting")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="true">
                  <li>
                    <Link to="/accounting/dashboard">{props.t("Accounting Dashboard")}</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/#" className="has-arrow waves-effect text-capitalize">
                  <span>{props.t("Sales")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="true">
                  <li>
                    <Link to="/sales/dashboard">{props.t("Sales Dashboard")}</Link>
                  </li>
                </ul>
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
