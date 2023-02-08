import axios from 'axios'

export const setAxiosConfig = () => {
  const token = localStorage.getItem("token")
  axios.defaults.baseURL = "https://artemix-backend.herokuapp.com/api/"
  axios.defaults.headers.common["Authorization"] = token
}