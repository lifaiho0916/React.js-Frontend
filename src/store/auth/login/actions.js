import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  USER_PROFILE,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_AVATAR,
} from "./actionTypes"

export const loginUser = (user, history) => {
  return {
    type: LOGIN_USER,
    payload: { user, history },
  }
}

export const setUserProfile = (user) => {
  return {
    type: USER_PROFILE,
    payload: { user }
  }
}

export const loginSuccess = user => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}

export const logoutUser = history => {
  return {
    type: LOGOUT_USER,
    payload: { history },
  }
}

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  }
}

export const getProfileSuccess = (user) => {
  return {
    type: GET_PROFILE_SUCCESS,
    payload: user
  }
}

export const updateProfile = (updates) => {
  console.log('here')
  return {
    type: UPDATE_PROFILE,
    payload: { updates }
  }
}

export const updateProfileSuccess = (updates) => {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    payload: updates
  }
}

export const updateAvatar = (avatar) => {
  console.log('here')
  return {
    type: UPDATE_AVATAR,
    payload: avatar
  }
}

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: error,
  }
}