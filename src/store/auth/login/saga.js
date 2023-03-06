import { call, put, takeEvery, takeLatest } from "redux-saga/effects"

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, UPDATE_PROFILE, USER_PROFILE } from "./actionTypes"
import { apiError, getProfileSuccess, loginSuccess, logoutUserSuccess, updateProfileSuccess } from "./actions"

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
  getProfile,
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
  updateProfileRequest,
} from "../../../helpers/fakebackend_helper"
import jwt from 'jwt-decode'
import { setAxiosConfig } from "helpers/axiosConfig"

const fireBaseBackend = getFirebaseBackend()

function* loginUser({ payload: { user, history } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(
        fireBaseBackend.loginUser,
        user.email,
        user.password
      )
      yield put(loginSuccess(response))
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      let response = yield call(postJwtLogin, {
        email: user.email,
        password: user.password,
      })
      if (response.status != 200 && response.status != 201) throw response.data.msg

      localStorage.setItem("token", response.data.accessToken)
      setAxiosConfig()
      const authUser = jwt(response.data.accessToken)
      localStorage.setItem("authUser", JSON.stringify(authUser))
      yield put(loginSuccess(authUser))
    } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
      const response = yield call(postFakeLogin, {
        email: user.email,
        password: user.password,
      })
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    }
    history.push("/profile-home")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser")

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout)
      yield put(logoutUserSuccess(response))
    }
    history.push("/")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* setUserPorfile({ payload: { user } }) {
  try {
    const response = yield call(getProfile)
    yield put(getProfileSuccess(response))
  } catch (error) {
    yield put(apiError(error))
  }
}

function *updateProfile({ payload: { updates } }) {
  try {
    const response = yield call(updateProfileRequest, updates)
    yield put(updateProfileSuccess( updates ))
  } catch (err) {

  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeEvery(LOGOUT_USER, logoutUser)
  yield takeEvery(USER_PROFILE, setUserPorfile)
  yield takeEvery(UPDATE_PROFILE, updateProfile)
}

export default authSaga
