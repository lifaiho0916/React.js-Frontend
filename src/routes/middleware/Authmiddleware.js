import React from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"
import decode from "jwt-decode"

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  admin,
  ...rest
}) => {

  let user = null

  try {
    const token = localStorage.getItem("token")
    const user = decode(token)
  } catch (err) {}

  if (admin && user && user.role != "admin") 
    return (
      <Redirect
        to={{ pathname: "/dashboard" }}
      />
    )

  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthProtected && !localStorage.getItem("authUser")) {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          )
        }

        return (
          <Layout>
            <Component {...props} />
          </Layout>
        )
      }}
    />
  )
}

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
}

export default Authmiddleware
