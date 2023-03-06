import axios from "axios"

export const updateCityAction = async (city, productionTime) => {
  const res = axios.post("/city/update-city", { city, productionTime })
  return res.data
}

export const getCityAction = async (city, productionTime) => {
  const res = await axios.get("/city/get-city", { params: { city, productionTime } })
  return res.data.city
}