import axios from "axios"
import { extractFormData, getCurrentTime } from "helpers/functions"

export const createMachineAction = async (form) => {
  const res = await axios.post("/timer/create-machine", form, { 
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const createPartAction = async (form) => {
  const res = await axios.post("/timer/create-part", form, { 
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const getProducts = async(type) => {
  const res = await axios.post("/timer/get-products", { type })
  return res.data
}

export const deleteProductAction = async (type, id) => {
  const res = await axios.delete("/timer/delete-product", {
    headers: {},
    data: { type, id } 
  })
  return res.data
}

export const editProductAction = async (type, id, updates) => {
  const res = await axios.post("/timer/edit-product", { type, id, updates })
  return res.data
}

export const createTimerAction = async (data) => {
  const timer = extractFormData(data)
  const res = await axios.post("/timer/create-timer", timer)
  return res
}

export const startTimerAction = async (id) => {
  const time = new Date()
  const res = await axios.post("/timer/start-timer", { id, time: time.toISOString() })
  return res
}

export const endTimerAction = async (id) => {
  const time = new Date()
  const res = await axios.post("/timer/end-timer", { id, time })
  return res
}

export const stopTimerAction = async (id) => {
  const time = new Date()
  const res = await axios.post("/timer/stop-timer", { id, time })
  return res
}

export const updateTimerAction = async (id, updates) => {
  const res = await axios.post("/timer/update-timer", { id, updates })
  return res
}