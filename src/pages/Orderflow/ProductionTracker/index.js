import { useEffect, useState } from 'react';
import { cities, factories } from 'helpers/globals';
import MetaTags from 'react-meta-tags';
import {
  Container, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from "reactstrap"
import "./style.scss"
import { CitySelect, FactoryList } from 'components/Common/Select';
import { getProducts } from 'actions/timer';
import AutoCompleteSelect from 'components/Common/AutoCompleteSelect';
import { array } from 'prop-types';
import { arraySplice } from 'redux-form';
import { getUsers } from 'actions/auth';
import { createJobAction, getJobsAction } from 'actions/job';
import sampleAvatar from "../../../assets/images/users/user-1.jpg"

import { useMemo } from 'react';
const ProductionTracker = (props) => {

  const [jobModal, setJobModal] = useState(false)
  const [jobDeleteModal, setJobDeleteModal] = useState(false)
  const toggleModal = () => setJobModal(!jobModal)
  const toggleDeleteModal = () => setJobDeleteModal(!jobDeleteModal)

  const [editID, setEditID] = useState(-1)
  const [sortKey, setSortKey] = useState('')
  const [jobs, setJobs] = useState([])
  const [orderBy, setOrderby] = useState(1)
  const compare = (a, b) => {
    if (a[sortKey] < b[sortKey]) {
      return -orderBy;
    }
    if (a[sortKey] > b[sortKey]) {
      return orderBy;
    }
    return 0;
  }

  const sortTable = (key, array) => {
    let _tmp = [...array]
    setSortKey(key)
    _tmp.sort(compare)
    setJobs(_tmp)
    setOrderby(-orderBy)
  }

  const [machines, setMachines] = useState([])
  const [parts, setParts] = useState([])
  const [timerPart, setTimerPart] = useState("")
  const [tab, setTab] = useState(1)
  const [users, setUsers] = useState([])

  useEffect(() => {
    sortTable(sortKey, jobs)
  }, [sortKey])

  useEffect(() => {
    (async () => {
      const _parts = await getProducts("Part")
      const _machines = await getProducts("Machine")
      const _users = await getUsers()
      const _jobs = await getJobsAction()

      setMachines(_machines.products)
      setParts(_parts.products)
      setUsers(_users)
      setJobs(_jobs)
    })()
  }, [])

  const [jobParams, setJobParams] = useState({
    factory: "Pipe And Box",
    city: "Seguin"
  })
  const createJob = async () => {
    const form = document.getElementById("job-form")
    const data = new FormData(form)
    const newJob = await createJobAction(data)
    setJobModal(false)
    setJobs([newJob, ...jobs])
  }
  const filteredJobModalParts = useMemo(() => {
    return parts.filter(part => part.city == jobParams.city)
  }, [jobParams, parts])
  const filteredJobModalMachine = useMemo(() => {
    return machines.filter(machine => machine.city == jobParams.city)
  }, [jobParams, machines])

  const deleteJob = async () => {

  }

  return <div className="page-content">
    <MetaTags>
      <title>Timer Page</title>
    </MetaTags>
    <Container fluid>
      <div className="jobslist-page-container mt-5 w-100 p-2">
        <div className="row p-0 m-0">
          <div className="col-xl-9 p-0">
            <div className="d-flex justify-content-between timer-page-header">
              <div>
                <h1>Production Tracker</h1>
                <div>
                  <span className="text-black-50">PRODUCTION</span>
                  <span className="mx-3"> &gt; </span>
                  <span className="text-danger">TEXAS</span>
                </div>
              </div>
            </div>
            <div className='divide-line d-flex align-items-center'>
              <h3 className='p-3 ps-0 pe-4'>JOBS</h3>
              <div className='line'></div>
            </div>
            <div className='bg-white jobs-table-container'>
              <div className='jobs-table-header d-flex'>
                <div className={`jobs-tab ongoing-job-tab cursor-pointer ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>
                  <div className='number'>3</div>
                  <div>
                    <h4 className="mb-0">ACTIVE</h4>
                    <h6 className="text-secondary">Ongonig jobs</h6>
                  </div>
                </div>
                <div className={`jobs-tab past-job-tab cursor-pointer ${tab === 2 ? 'active' : ''}`} style={{ marginRight: 'auto' }} onClick={() => setTab(2)}>
                  <div className='number'>2</div>
                  <div>
                    <h4 className="mb-0">ARCHIEVED</h4>
                    <h6 className="text-secondary">Past jobs</h6>
                  </div>
                </div>
                <div className='d-flex align-items-center' >
                  <button className='btn btn-newjob ms-3 '
                    onClick={() => {
                      setEditID(-1)
                      toggleModal()
                    }
                    } >
                    NEW JOB
                  </button>
                </div>
              </div>

              <div className="jobs-table">
                <table className='w-100 table table-nowrap mb-0' id='jobstable'>
                  <thead className=''>
                    <tr>
                      <th style={{ paddingLeft: '84px' }} onClick={() => sortTable('name', jobs)}>
                        JOBS
                      </th>
                      <th>PART/MACHINE</th>
                      <th>STATUS</th>
                      <th>STATUS</th>
                      <th>DUE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, index) => (
                      <tr key={index}>
                        <td style={{ paddingLeft: '24px' }}>
                          <div className='d-flex align-items-center'>
                            <img className='job-user' src={sampleAvatar}></img>
                            <div className="job-factory">
                              {job.factory.substring(0, 4)}
                            </div>
                            <div className='ms-2'>
                              <b className='name'>{job.name}</b>
                              <div className="text-secondary">{job.city}</div>
                            </div>
                          </div>
                        </td>
                        <td className=''>
                          <b className='name'>{job.part.name}</b>
                          <div className="text-secondary">{job.machine.name}</div>
                        </td>
                        <td className='name'>
                          {job.producedCount} / {job.count}
                        </td>
                        <td>
                          <span className="job-status name ">QA</span>
                        </td>
                        <td>
                          <b className='name'>{new Date(job.dueDate).toLocaleDateString("en-US")}</b>
                          <div className="text-secondary ">7 Days</div>
                        </td>
                        <td>
                          <b className='position-relative'>
                            <i className='mdi mdi-dots-vertical cursor-pointer' data-bs-toggle="dropdown" aria-expanded="false" id={"expEdit" + index}></i>
                            <div className='dropdown-menu dropdown-menu-end' aria-labelledby={"expEdit" + index} >
                              <div className='dropdown-item p-4 py-3 pb-0 cursor-pointer'
                                onClick={() => {
                                  setEditID(index)
                                  toggleModal()
                                }
                                } >
                                Edit
                              </div>
                              <div className='dropdown-item p-4 py-3 cursor-pointer' onClick={toggleDeleteModal} > Delete </div>
                            </div>
                          </b>
                        </td>
                      </tr>
                    )
                    )
                    }
                    <tr className='border-0 pagination overflow-hidden' style={{ borderRadius: '10px' }}>
                      <td className='pe-0' style={{ paddingLeft: '24px' }}>
                        <div className='d-flex align-items-center border-end pe-2'>
                          <span className='mdi mdi-chevron-left'></span>
                          <span>PREV</span>
                        </div>
                      </td>

                      <td className='px-0'>
                        <div className='d-flex align-items-center border-end px-2'>
                          1
                        </div>
                      </td>

                      <td className='px-2'>
                        <div className='d-flex align-items-center'>

                          <span>NEXT</span>
                          <span className='mdi mdi-chevron-right'></span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Container>

    <Modal isOpen={jobModal} toggle={toggleModal} >
      <ModalHeader toggle={toggleModal}>{editID === -1 ? 'Create A New Job' : 'Edit Job'}</ModalHeader>
      <ModalBody>
        <form id="job-form">
          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="text" placeholder='Job Name' name="name" />
          </div>

          <div className="mt-3 d-flex align-items-center">
            <CitySelect onChange={(e) => setJobParams({...jobParams, city: e.target.value})}/>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <select className="form-control" name="user">
              {
                users.map(user => <option value={user._id} key={user._id}>{user.name}</option>)
              }
            </select>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <FactoryList onChange={(e) => setJobParams({...jobParams, factory: e.target.value})} />
          </div>

          <div className="mt-3 d-flex align-items-center">
            <select className="form-select" name="machine">
              {
                filteredJobModalMachine.map(m => <option value={m._id} key={"machine-" + m._id} >{m.name}</option>)
              }
            </select>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <div className='w-100'>
              <AutoCompleteSelect placeholder="Select Parts" options={filteredJobModalParts} onChange={v => setTimerPart(v)} />
            </div>
            <input type="hidden" name="part" value={timerPart} />
          </div>

          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="number" placeholder='Count' name="count" />
          </div>

          <div className="mt-3 d-flex align-items-center">
            <input
              placeholder="Due Date"
              className="form-control"
              name="dueDate"
              type="text"
              onFocus={(e) => (e.target.type = 'date')}
              id="date" />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={createJob}>{editID == -1 ? 'Create' : 'Edit'}</Button>{' '}
        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={jobDeleteModal} toggle={toggleDeleteModal} >
      <ModalHeader toggle={toggleDeleteModal}>Are you going to delete this job?</ModalHeader>


      <ModalFooter>
        <Button color="primary" onClick={deleteJob}>Delete</Button>{' '}
        <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
  </div>
}

export default ProductionTracker