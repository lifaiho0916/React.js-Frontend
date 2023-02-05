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
import { Link } from "react-router-dom"
import axios from 'axios';

import "chartist/dist/scss/chartist.scss";

//i18n
import { withTranslation } from "react-i18next"

const Users = props => {

  const [users, setUsers] = useState([])
  const [loading, setLoaing] = useState(false)

  const getAllUsers = async () => {
    try {
      const response = await axios.get("/auth/all-users")
      setUsers(response.data.users)
    } catch (err) {
    
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  const approveUser = async(index) => {
    setLoaing(true)

    try {
      const response = await axios.post("/auth/approve-user", { id: users[index].id })
      setUsers(users.map((user, _index) => index == _index ? {...user, approved: !user.approved} : user))
    } catch (err) {

    }

    setLoaing(false)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Users</title>
        </MetaTags>
        <Container fluid>

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Users</h4>
                  <div className="table-responsive">
                    <table className="table table-hover table-centered table-nowrap mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Id</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Role</th>
                          <th scope="col" colSpan="2">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          users.map((user, index) => (
                            <tr key={"user" + index}>
                              <th scope="row">{index + 1}</th>
                              <td>
                                <div>
                                  { user.name }
                                </div>
                              </td>
                              <td>{ user.email }</td>
                              <td>{ user.role }</td>
                              <td>
                                <span className={`badge ${user.approved ? "bg-success" : "bg-danger"}`}>
                                  { user.approved ? "Approved" : "Under Review" }
                                </span>
                              </td>
                              <td>
                                <Button className={`text-white ${!user.approved ? "bg-success" : "bg-danger"}`} onClick={() => approveUser(index)}>
                                  { user.approved ? 'Reject' : 'Approve' }
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
