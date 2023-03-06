import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  USER_PROFILE,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_AVATAR
} from "./actionTypes"

const initialState = {
  error: "",
  loading: false,
  loggedIn: false,
  user: {
    avatar: ""
  }
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      }
      break
    case GET_PROFILE_SUCCESS:
      state = {
        ...state,
        user: action.payload.user,
        loggedIn: false
      }
      break
    case UPDATE_AVATAR:
      state = {
        ...state,
        user: {
          ...state.user,
          avatar: action.payload
        }
      }
      break;
    case LOGIN_SUCCESS:
      state = {
        ...state,
        user: action.payload,
        loading: false,
        loggedIn: true
      }
      break
    case UPDATE_PROFILE_SUCCESS:
      state = {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      }
      break;
    case LOGOUT_USER:
      state = { ...state,
        loggedIn: false
      }
      break
    case LOGOUT_USER_SUCCESS:
      state = { ...state }
      break
    case API_ERROR:
      state = { ...state, error: action.payload, loading: false }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default login
