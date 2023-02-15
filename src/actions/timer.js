import axios from "axios"

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