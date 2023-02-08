import PropTypes from 'prop-types'
import React,{useEffect, useState} from "react"
import MetaTags from 'react-meta-tags';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
} from "reactstrap"
import { Link, useHistory, useParams } from "react-router-dom"
import axios from 'axios';
import decode from "jwt-decode"

import "chartist/dist/scss/chartist.scss";

//i18n
import { withTranslation } from "react-i18next"
import SweetAlert from 'react-bootstrap-sweetalert';
import { removeUser, updateUser } from 'actions/auth';

const Users = props => {

  const [users, setUsers] = useState([])
  const [loading, setLoaing] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { filter } = useParams()

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`/auth/all-users?filter=${filter}`)
      setUsers(response.data.users)
      setRoles(response.data.users.map(user => user.role))
      setIsAdmin(response.data.isAdmin)
    } catch (err) {
    
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [filter])

  const token = localStorage.getItem("token")
  let authUser = decode(token)

  const [roles, setRoles] = useState([])
  const onChangeRole = async(e, index) => {
    if (loading) return
    const response = updateUser({ id: users[index].id, role: e.target.value })
    setLoaing(true)
    setUsers(users.map((user, _index) => index==_index ? {...user, role: e.target.value} : user))
    setLoaing(false)
  }
  const toggleUserProperty = async (index, field) => {
    if (!isAdmin || loading) return
    setLoaing(true)
    const response = updateUser({ id: users[index].id, [field]: !users[index][field] })
    setLoaing(false)
    setUsers(users.map((user, _index) => index == _index ? {...user, [field]: !user[field]} : user))
  }

  const factoryChanged = async (value, index) => {
    if (loading) return
    setLoaing(true)
    const response = updateUser({ id: users[index].id, factory: value })
    setLoaing(false)
    setUsers(users.map((user, _index) => index == _index ? {...user, factory: value} : user))
  }

  const locationChanged = async (value, index) => {
    if (loading) return
    setLoaing(true)
    const response = updateUser({ id: users[index].id, location: value })
    setLoaing(false)
    setUsers(users.map((user, _index) => index == _index ? {...user, location: value} : user))
  }

  const deleteAccount = async () => {
    if (loading) return
    setLoaing(true)
    const response = await removeUser(users[selectedPersonIndex].id)
    setLoaing(false)
    setUsers(users.filter((_, index) => index != selectedPersonIndex))
  }
  const doAction = () => {
    if (actionType == "Delete") deleteAccount()
    else toggleUserProperty(selectedPersonIndex, "restrict")
  }

  const [selectedPersonIndex, setSelectedPersonIndex] = useState(-1)
  const [saveAlert, setSaveAlert] = useState(false)
  const [actionType, setActionType] = useState("")
  const history = useHistory()
  const filterChanged = (e) => {
    history.push(`/users/${e.target.value}`)
  }

  const userTab = () => {
    if (authUser.role == "Admin")
      return <select className='form-select' onChange={filterChanged}>
        <option value="Conroe">
          {props.t("Conroe")}
        </option>
        <option value="Seguin">
          {props.t("Seguin")}
        </option>
        <option value="Gunter">
          {props.t("Gunter")}
        </option>
        <option value="Production">
          {props.t("Production")}
        </option>
        <option value="Corporate">
          {props.t("Corporate")}
        </option>
      </select>
    else if (authUser.role == "Production")
      return <select className='form-select' onChange={filterChanged}>
        <option value="Active Personnel">
          {props.t("Active Personnel")}
        </option>
        <option value="Pending Personnel">
          {props.t("Pending Personnel")}
        </option>
      </select>
    else if (authUser.role == "HR")
      return <select className='form-select' onChange={filterChanged}>
        <option value="Active Members">
          {props.t("Active Members")}
        </option>
        <option value="Pending Members">
          {props.t("Pending Members")}
        </option>
        <option value="Precast">
          {props.t("Precast")}
        </option>
        <option value="Pipe And Box">
          {props.t("Pipe And Box")}
        </option>
        <option value="Steel">
          {props.t("Steel")}
        </option>
      </select> 
  }
  const [searchName, setSearchName] = useState("")

  return (
    <React.Fragment>
      <div className="page-content">
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
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <div className="card-title mb-4 d-flex justify-content-between">
                    <div style={{width: 200}}>
                      {userTab()}
                    </div>
                    <div style={{width: 200}}>
                      <input class="form-control" placeholder="Search Names..." value={searchName} onChange={e => setSearchName(e.target.value)}/>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover table-centered table-nowrap mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Id</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Location</th>
                          <th scope="col">Factory</th>
                          <th scope="col">Role</th>
                          <th scope="col">Director</th>
                          <th scope="col">Status</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          users.filter(user => user.name.toLocaleLowerCase().indexOf(searchName.toLocaleLowerCase()) != -1).map((user, index) => (
                            <tr key={"user" + index} key={"user-"+index}>
                              <th scope="row">{index + 1}</th>
                              <td>
                                <div>
                                  { user.name }
                                </div>
                              </td>
                              <td>{ user.email }</td>
                              <td>
                                {
                                  isAdmin ? <select className='form-select' onChange={e => locationChanged(e.target.value, index)} value={user.location}>
                                      <option value="Seguin">Seguin</option>
                                      <option value="Conroe">Conroe</option>
                                      <option value="Gunter">Gunter</option>
                                    </select>
                                  : user.location
                                }
                              </td>
                              <td>
                                {
                                  authUser.role == "Production" ?
                                    <select className='form-select' onChange={e => factoryChanged(e.target.value, index)} value={user.factory}>
                                      <option value="Pipe And Box">PIPE AND BOX</option>
                                      <option value="Steel">STEEL</option>
                                      <option value="Precast">PRECAST</option>
                                    </select>
                                  : user.factory
                                }
                              </td>
                              <td>
                                {
                                  authUser.role=="Admin" && (user.role == "Corporate" || user.role == "HR" || user.role == "Sales" || user.role == "Accounting") ? <select className="form-select" id="role" value={user.role} onChange={v => onChangeRole(v, index)}>
                                    {
                                      ["Corporate", "HR", "Sales", "Accounting"].map(role => <option value={role} key={"user-"+index+"-"+role}>{role}</option>)
                                    }
                                  </select> : user.role
                                }
                              </td>
                              <td>
                                {
                                  user.role == "HR" ? <span className={`badge cursor-pointer ${user.admin ? "bg-success" : "bg-danger"}`} onClick={() => toggleUserProperty(index, "admin")}>
                                    { user.admin ? "Yes" : "No" }
                                  </span> : ""
                                }
                              </td>
                              <td>
                                <span className={`badge cursor-pointer ${user.approved ? "bg-success" : "bg-danger"}`} onClick={() => toggleUserProperty(index, "approved")}>
                                  { user.approved ? "Approved" : "Under Review" }
                                </span>
                              </td>
                              <td>
                                <Button className="text-white bg-danger ms-3" disabled={!isAdmin} onClick={() => {
                                  setSaveAlert(true)
                                  setSelectedPersonIndex(index)
                                  setActionType("Delete")
                                }}>
                                  Delete
                                </Button>
                                <Button className="text-white bg-info ms-3" disabled={!isAdmin} onClick={() => {
                                  setSaveAlert(true)
                                  setSelectedPersonIndex(index)                                  
                                  setActionType("Archieve")
                                }}>
                                  Archieve
                                </Button>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

    </React.Fragment>
  )
}

Users.propTypes = {
  t: PropTypes.any
}

export default withTranslation()(Users)
