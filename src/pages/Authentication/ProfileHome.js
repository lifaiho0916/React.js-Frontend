import React, { useState } from "react"
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap"
// import "./app.css";
const ProfileHome = () => {
  const [menu, setMenu] = useState(false)
  const toggle = () => {
    setMenu(!menu)
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box timer-page-container mt-5 mx-auto">
            <Row className="align-items-center">
              <Col md={8}>
                <h1 className="page-title" style={{ fontSize: "44px" }}>
                  Home Portal
                </h1>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">OVERVIEW</li>
                </ol>
              </Col>

              <Col md="4">
                <div className="float-end d-none d-md-block"></div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ProfileHome
