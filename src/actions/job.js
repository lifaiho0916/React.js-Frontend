import axios from "axios"
import { extractFormData } from "helpers/functions"

export const createJobAction = async (data) => {
  const job = extractFormData(data)
  const res = await axios.post("/job/create-job", job)
  return res.data.job
}

export const getJobsAction = async () => {
  const res = await axios.get("/job/get-jobs")
  return res.data.jobs
}