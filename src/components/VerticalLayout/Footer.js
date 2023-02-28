import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer" style={{ position: "fixed" }}>
        <Container fluid={true}>
          <Row>
            <div className="col-12">
              © {new Date().getFullYear()} Veltrix<span className="d-none d-sm-inline-block"> - Crafted with 
              {" "}<i className="mdi mdi-heart text-danger"></i> by Ieoko Media.</span>
            </div>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
