import axios from 'axios'

export const setAxiosConfig = () => {
  const token = localStorage.getItem("token")
  axios.defaults.baseURL = "http://apms.global/api/"
  axios.defaults.headers.common["Authorization"] = token
}