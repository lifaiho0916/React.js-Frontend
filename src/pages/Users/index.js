import PropTypes from 'prop-types'
import React, { Fragment, useEffect, useRef, useState } from "react"
import MetaTags from 'react-meta-tags';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
} from "reactstrap"
import { Link, useHistory, useParams } from "react-router-dom"
import axios from 'axios';
import decode from "jwt-decode"

import "chartist/dist/scss/chartist.scss";
import "./style.scss"
//i18n
import { withTranslation } from "react-i18next"
import SweetAlert from 'react-bootstrap-sweetalert';
import { removeUser, updateUser } from 'actions/auth';
import Select from "react-select"
import Pagination from 'components/Common/Pagination';
const Users = props => {

  const [users, setUsers] = useState([])
  const [loading, setLoaing] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { filter } = useParams()
  const history = useHistory()
  const [roles, setRoles] = useState([])
  const [count, setCount] = useState(7)
  const [selectedPersonIndex, setSelectedPersonIndex] = useState(-1)
  const [saveAlert, setSaveAlert] = useState(false)
  const [actionType, setActionType] = useState("")
  const [searchName, setSearchName] = useState("")
  const [firstLoading, setFirstLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPage: 1
  })
  const selectRef = useRef()
  const getAllUsers = async () => {
    try {
      const response = await axios.get(`/auth/all-users?filter=${filter || ""}&count=${count}&page=${pagination.page}&query=${searchName}`)
      setUsers(response.data.users)
      setRoles(response.data.users.map(user => user.role))
      if (filter == 'Pending' && !response.data.users.length && firstLoading)
        history.push(`/users`)
      setIsAdmin(response.data.isAdmin)
      setFirstLoading(false)
      setPagination({
        ...pagination,
        totalPage: Math.ceil(response.data.totalCount / count)
      })
    } catch (err) {
    }
  }
  useEffect(() => {
    getAllUsers()
  }, [filter, pagination.page, count, searchName])
  const token = localStorage.getItem("token")
  let authUser = decode(token)

  const onChangeRole = async (e, index) => {
    if (loading) return
    const response = updateUser({ id: users[index]._id, role: e.target.value })
    setLoaing(true)
    setUsers(users.map((user, _index) => index == _index ? { ...user, role: e.target.value } : user))
    setLoaing(false)
  }
  const convertUserStatus = (value) => {
    return value == -1 || value == 0 ? 1 : 0
  }
  const toggleUserProperty = async (index, field) => {
    if (!isAdmin || loading) return
    setLoaing(true)
    const response = updateUser({ id: users[index]._id, [field]: convertUserStatus(users[index][field]) })
    setLoaing(false)
    setUsers(users.map((user, _index) => index == _index ? { ...user, [field]: convertUserStatus(user[field]) } : user))
  }

  const factoryChanged = async (value, index) => {
    if (loading) return
    setLoaing(true)
    const response = updateUser({ id: users[index]._id, factory: value })
    setLoaing(false)
    setUsers(users.map((user, _index) => index == _index ? { ...user, factory: value } : user))
  }

  const locationChanged = async (value, index) => {
    if (loading) return
    setLoaing(true)
    const response = updateUser({ id: users[index]._id, location: value })
    setLoaing(false)
    setUsers(users.map((user, _index) => index == _index ? { ...user, location: value } : user))
  }

  const deleteAccount = async () => {
    if (loading) return
    setLoaing(true)
    const response = await removeUser(users[selectedPersonIndex]._id)
    setLoaing(false)
    setUsers(users.filter((_, index) => index != selectedPersonIndex))
  }
  const doAction = () => {
    if (actionType == "Delete") deleteAccount()
    else toggleUserProperty(selectedPersonIndex, "restrict")
  }



  const filterChanged = (e) => {
    history.push(`/users/${e.value}`)
  }
  const moveToPage = (_page) => {
    setPagination({
      ...pagination,
      page: _page
    })
  }
  const allOptions = [
    { label: 'Pending Users', value: 'Pending' },
    { label: 'All Users', value: '' },

  ]
  const cityOptions = [
    { label: 'Conroe', value: 'Conroe' },
    { label: 'Seguin', value: 'Seguin' },
    { label: 'Gunter', value: 'Gunter' },

  ]
  const userTypeOptions = [
    { label: 'Production', value: 'Production' },
    { label: 'Personnel', value: 'Personnel' },
    { label: 'Corporate', value: 'Corporate' },
  ]
  const userTypeOptionsforHR = [
    { label: 'Production', value: 'Production' },
    { label: 'Personnel', value: 'Personnel' },
  ]
  const accountUsabilityOptions = [
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
  ]
  const groupedOptions =
    authUser.role == 'Admin' ?
      [
        {
          options: allOptions
        },
        {
          label: "Cities",
          options: cityOptions
        },
        {
          label: "User Types",
          options: userTypeOptions
        },
        {
          label: "Account Usability",
          options: accountUsabilityOptions
        }
      ] :
      authUser.role == 'HR' ?
        isAdmin ?
          [
            {
              options: allOptions
            },
            {
              label: "Cities",
              options: cityOptions
            },
            {
              label: "User Types",
              options: userTypeOptions
            },
            {
              label: "Account Usability",
              options: accountUsabilityOptions
            }
          ] :
          [
            {
              options: allOptions
            },
            {
              label: "User Types",
              options: userTypeOptionsforHR
            },
            {
              label: "Account Usability",
              options: accountUsabilityOptions
            }
          ] :
        [
          {
            options: allOptions
          },
          {
            label: "Account Usability",
            options: accountUsabilityOptions
          }
        ]
    ;
  const userTab = () => {
    if (authUser.role == "Admin" || authUser.role == 'HR' || authUser.role == 'Production')
      return <div className='filter-user-tab'>
        <Select
          onChange={filterChanged}
          ref={selectRef}
          value={filter == 'Pending' ? { label: 'Pending Users', value: 'Pending' } : filter ? { label: filter, value: filter } : { label: "All Users", value: "" }}
          options={groupedOptions}
          defaultValue={filter !== 'Pending' && filter ? { label: filter, value: filter } : filter == 'Pending' ? allOptions[0] : allOptions[1]}
          classNamePrefix="select2-selection w-100"
        /></div>
  }



  return (
    <React.Fragment>
      {authUser.role !== 'Admin' && authUser.role !== 'HR' && authUser.role !== "Production" ? "" :
        <div className="page-content users-page-content" style={{ minHeight: '100vh' }}>
          <MetaTags>
            <title>Users</title>
          </MetaTags>
          <Container fluid>
            {saveAlert ? (
              <SweetAlert
                showCancel
                title="Are you sure?"
                cancelBtnBsStyle="danger"
                confirmBtnBsStyle="success"
                onConfirm={() => {
                  setSaveAlert(false)
                  doAction()
                }}
                onCancel={() => {
                  setSaveAlert(false)
                }}
              >
              </SweetAlert>) : null
            }
            <div className="page-content-header mt-5 user-page-content-header ">
              <h2>Team Members</h2>
              <div className='sub-menu text-uppercase'>
                <span className="parent">Users</span>
                <span className="mx-1"> &gt; </span>
                <span className='sub text-danger'>TEXAS</span>
              </div>
              <div className='divide-line d-flex align-items-center pt-5'>
                <div className='line'></div>
              </div>
            </div>
            <Row>
              <Col xl={12}>
                <Card className='mt-5 border'>
                  <CardBody className='p-0'>
                    <div className="my-4 px-3 d-flex justify-content-between">
                      <div style={{ width: 200 }}>
                        {userTab()}
                      </div>
                      <div className='d-flex align-items-center '>
                        <div className='countshow d-flex align-items-center mx-3' >
                          <span className="me-2">Show</span>
                          <input className="px-2 py-1 bg-light form-control" value={count} style={{ width: 40 }} onChange={e => setCount(e.target.value)} />
                        </div>
                        <div style={{ width: 200 }}>
                          <input className="form-control" placeholder="Search Names..." value={searchName} onChange={e => setSearchName(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex users-table">
                      <div className='table-responsive table-container'>
                        <table className="table table-hover table-centered table-nowrap mb-0">
                          <thead>
                            <tr>
                              <th className='ps-3' scope="col">Id</th>
                              <th scope="col">Name</th>
                              <th scope="col">Email</th>
                              <th scope="col">Location</th>
                              <th scope="col">Factory</th>
                              <th scope="col">Role</th>
                              <th className='pe-3' scope="col">Director</th>
                              <th scope="col" style={{ borderLeft: '2px solid #e9edf2', paddingLeft: '1rem' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              users.map((user, index) => (
                                <tr key={"userFields" + index} style={{ height: 52 }}>
                                  <td className='ps-3' scope="row">{index + 1 + (pagination.page - 1) * count}</td>
                                  <td >
                                    <div className='name'>
                                      <b> {user.firstName + ' ' + user.lastName}</b>
                                    </div>
                                  </td>
                                  <td>{user.email}</td>
                                  <td style={{ width: 82 }}>
                                    {
                                      isAdmin ? user.role == "Admin" ? "Global" : <select className='form-select' onChange={e => locationChanged(e.target.value, index)} value={user.location}>
                                        <option value="Seguin">Seguin</option>
                                        <option value="Conroe">Conroe</option>
                                        <option value="Gunter">Gunter</option>
                                      </select>
                                        : user.location
                                    }
                                  </td>
                                  <td style={{ width: 100 }} >
                                    {
                                      (authUser.role == "Production" || authUser.role == "HR" || authUser.role == "Admin") && (user.role == "Personnel" || user.role == "Production") ?
                                        <select className='form-select' onChange={e => factoryChanged(e.target.value, index)} value={user.factory || ""}>
                                          <option value="" disabled >Select...</option>
                                          <option value="Pipe">Pipe</option>
                                          <option value="Box">Box</option>
                                          <option value="MBK">MBK</option>
                                          <option value="Precast">Precast</option>
                                          <option value="Steel">Steel</option>
                                          <option value="Off-Site">Off-Site</option>
                                        </select>
                                        : user.role !== "Personnel" && user.role !== "Production" ? "Global" : user.factory
                                    }
                                  </td>
                                  <td style={{ maxWidth: 112 }}>
                                    {
                                      authUser.role == "Admin" && (user.role == "Corporate" || user.role == "HR" || user.role == "Sales" || user.role == "Accounting" || user.role == "Admin") ?
                                        <select className="form-select" id="role" value={user.role} onChange={v => onChangeRole(v, index)}>
                                          <option value="Corporate" disabled>Corporate</option>
                                          {
                                            ["HR", "Sales", "Accounting", "Admin"].map(role => <option value={role} key={"usera-" + index + "-" + role}>{role}</option>)
                                          }
                                        </select> : user.role
                                    }
                                  </td>
                                  <td style={{ width: 80 }}>
                                    {
                                      user.role == "HR" ? <span className={`badge cursor-pointer ${user.admin ? "bg-success" : "bg-danger"}`} onClick={() => toggleUserProperty(index, "admin")}>
                                        {user.admin ? "Yes" : "No"}
                                      </span> : ""
                                    }
                                  </td>
                                  <td style={{ width: '96px', paddingInline: '16px', borderLeft: '2px solid #e9edf2' }}>
                                    <span
                                      className={`badge px-2 py-1 ${user.approved == 0 ? "bg-danger" : user.approved == 1 && !user.restrict ? "bg-success" : "bg-warning"}`}
                                      style={{ width: 64 }}
                                    >
                                      {!user.approved ? "Rejected" :
                                        user.restrict ? "Restricted" :
                                          user.approved == 1 ? "Approved" :
                                            user.approved == -1 ? "Pending" : ""

                                      }
                                    </span>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>

                      </div>
                      <div className='dropdown-user' >
                        <div className='border-bottom' style={{ height: 36, width: 20 }}></div>
                        {
                          users.map((user, index) => (
                            <div className='py-2 border-bottom' style={{ height: 52 }}>
                              <b className='position-relative'>
                                <i className='mdi mdi-dots-vertical cursor-pointer' data-bs-toggle="dropdown" aria-expanded="false" id={"userEdit" + index}></i>
                                <div className='dropdown-menu dropdown-menu-end postion-fixed' aria-labelledby={"userEdit" + index} >
                                  <div className='dropdown-item px-3 py-2 border-bottom'>
                                    <Button
                                      className={`px-2 py-1 text-white 
                                      ${user.approved == 1 ? 'bg-danger' : 'bg-success'} 
                                      ${(user.role == 'Production' || user.role == 'Personnel') && !user.factory ? 'disabled' : ''}`}
                                      onClick={() => {
                                        if (((user.role == 'Production' || user.role == 'Personnel') && user.factory) || (user.role !== 'Production' && user.role !== 'Personnel'))
                                          toggleUserProperty(index, "approved")
                                      }}
                                      style={{ width: 66 }}>
                                      {user.approved == 1 ? 'Reject' : 'Approve'}
                                    </Button>
                                  </div>
                                  {!isAdmin ? "" :
                                    <Fragment>
                                      <div className='dropdown-item px-3 py-2 border-bottom'>
                                        <Button className="px-2 py-1 text-white bg-dark" onClick={() => {
                                          setSaveAlert(true)
                                          setSelectedPersonIndex(index)
                                          setActionType("Delete")
                                        }}
                                          style={{ width: 66 }}>
                                          Delete
                                        </Button>
                                      </div>
                                      <div className='dropdown-item px-3 py-2'  >
                                        <Button className={`px-2 py-1 text-white ${user.restrict ? "bg-primary" : "bg-info"}`} onClick={() => {
                                          setSaveAlert(true)
                                          setSelectedPersonIndex(index)
                                          setActionType("Archive")
                                        }}
                                          style={{ width: 66 }}>
                                          {user.restrict ? "Restore" : "Archive"}
                                        </Button>
                                      </div>
                                    </Fragment>
                                  }
                                </div>
                              </b>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <div className='border-0 py-3' style={{ borderRadius: '10px' }}>
                      <Pagination
                        {...pagination}
                        movePage={moveToPage} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      }
    </React.Fragment>
  )
}

Users.propTypes = {
  t: PropTypes.any
}

export default withTranslation()(Users)
