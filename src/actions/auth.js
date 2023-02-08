import axios from "axios"

export const removeUser = async (id) => {
  try {
    const res = await axios.post("/auth/update-user", { id, delete: true })
    return true
  } catch (err) {
    return false
  }
}

export const updateUser = async (fields) => {
  try {
    const res = await axios.post("/auth/update-user", fields)
    return true
  } catch (err) {
    return false
  }
}