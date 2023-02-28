import axios from 'axios'

// export const BACKEND = "http://localhost:8000"
export const BACKEND = "https://apms.global"

export const setAxiosConfig = () => {
  const token = localStorage.getItem("token")
  axios.defaults.baseURL = BACKEND+"/api/"
  axios.defaults.headers.common["Authorization"] = token
}