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

export const getProducts = async(type, page = 1, filters) => {
  const res = await axios.post("/timer/get-products", { type, page, filters })
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

export const startTimerAction = async (id, city) => {
  const time = new Date()
  const res = await axios.post("/timer/start-timer", { id, city, time: time.toISOString() })
  return res
}

export const endTimerAction = async (id, city) => {
  const time = new Date()
  const res = await axios.post("/timer/end-timer", { id, city, time })
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

export const refreshTimerAction = async(id) => {
  const res = await axios.get("/timer/get-timer?id="+id)
  return res.data.timer
}

export const searchMacheinsAction = async (machineClass) => {
  const res = await axios.get("/timer/search-machines", {params: { machineClass }})
  return res.data.machines
}

export const getTimerLogsOfMachine = async (machine, part, from, to, page, includeOperator, machineClass = 0, city = 0, items_per_page) => {
  const res = await axios.get("/timer/timer-logs-of-machine", {params: { machine, part, from, to, page, includeOperator, machineClass, city, items_per_page }})
  return res.data
}

export const getLogsToPrintAction = async (machine, part, from, to, page, includeOperator, machineClass = 0, city = 0, items_per_page) => {
  const res = await axios.get("/timer/timer-logs-to-print", {params: { machine, part, from, to, page, includeOperator, machineClass, city, items_per_page }})
  return res.data
}


export const startProductionTimeAction = async (city) => {
  const res = await axios.get("/timer/start-of-production-time", { params: { city } })
  return res.data.log
}