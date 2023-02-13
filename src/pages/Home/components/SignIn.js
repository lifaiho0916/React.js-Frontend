import { useState } from "react"
import PropTypes from 'prop-types'

// Redux
import { connect } from "react-redux"
import { useHistory, withRouter } from "react-router-dom"

// actions
import { loginUser, apiError } from "../../../store/actions"

import Logo from "../../../assets/images/logo-dark.png"

const SignIn = (props) => {
  const [data, setData] = useState({email: "", password: ""})
  const [available, setAvailable] = useState(false)
  const history = useHistory()

  const onChangeField = (e, field) => {
    const _data = {
      ...data,
      [field]: e.target.value
    }
    setAvailable(_data.email && _data.password)
    setData(_data)
  }

  const login = () => {
    props.loginUser(data, history)
  }

  return <div className="h-100 d-flex flex-column bg-white sm-vw-100 signin-container">
    <div className="d-flex justify-content-center align-items-center mt-5 flex-column logo-container" style={{height : 200}}>
      <img src={Logo} className="w-75"/>
      <h5 className="mt-3">Welcome</h5>
      <h6>Sign in to APMS</h6>
    </div>

    <div className="d-flex flex-column justify-content-center h-100 signin-form" style={{marginTop: -200}}>
      <div>
        <label>Username</label>
        <input className="form-control" type="email" placeholder="Enter Username" onChange={(e) => onChangeField(e, "email")}/>
      </div>

      <div className="mt-3">
        <label>Password</label>
        <input className="form-control" type="password" placeholder="Enter Password" onChange={(e) => onChangeField(e, "password")}/>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="form-check mt-3">
          <input type="checkbox" className="form-check-input" />
          <label className="form-check-label" >
            Remember Me
          </label>
        </div>

        <div>
          <button className="btn btn-danger" disabled={!available} onClick={login}>Log In</button>
        </div>
      </div>

      <div className="text-center mt-5">
          <div className="position-relative d-inline-flex flex-column">
            <div className="me-3">@2023 AmeriTex - crafted with <i className="bi bi-heart-fill text-danger"></i></div>
            <div className="text-end">
              by leko Media
            </div>
          </div>
        </div>
      </div>
    </div>
}

const mapStateToProps = state => {
  const { error } = state.Login
  return { error }
}

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError })(SignIn)
)

SignIn.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
}
