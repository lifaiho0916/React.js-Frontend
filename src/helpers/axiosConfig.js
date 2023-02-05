import axios from 'axios'

export const setAxiosConfig = () => {
  const token = localStorage.getItem("token")
  axios.defaults.baseURL = "http://localhost:8000/api/"
  axios.defaults.headers.common["Authorization"] = token
}