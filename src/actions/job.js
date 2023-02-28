import axios from "axios"
import { extractFormData } from "helpers/functions"

export const createJobAction = async (data) => {
  const job = extractFormData(data)
  const res = await axios.post("/job/create-job", job)
  return res.data.job
}

export const editJobAction = async (data, editID) => {
  const job = extractFormData(data)
  const res = await axios.post("/job/update-job", { update: job, id: editID })
  return res.data.job
}
export const deleteJobAction = async (id) => {
  const res = await axios.delete("/job/delete-job", {
    headers: {},
    data: { id }
  })
  return res.data.result
}

export const getJobsAction = async (page, query, tab, count = 7, order = 0) => {
  const res = await axios.get("/job/get-jobs?page=" + page + '&query=' + query + '&tab=' + tab + '&order=' + order + '&count=' + count)
  return res.data
}