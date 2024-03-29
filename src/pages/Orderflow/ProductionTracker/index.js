import { useEffect, useRef, useState } from 'react';
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
import { createJobAction, deleteJobAction, editJobAction, getJobsAction } from 'actions/job';
import sampleAvatar from "../../../assets/images/person.svg"

import { useMemo } from 'react';
const ProductionTracker = (props) => {

  const [jobModal, setJobModal] = useState(false)
  const [jobDeleteModal, setJobDeleteModal] = useState(false)
  const toggleModal = () => setJobModal(!jobModal)
  const toggleDeleteModal = () => setJobDeleteModal(!jobDeleteModal)
  const queryRef = useRef()

  const [editID, setEditID] = useState(-1)
  const [removeID, setRemoveID] = useState(-1)
  const [inputType, setInputType] = useState('text')

  const [sortKey, setSortKey] = useState('')
  const [jobs, setJobs] = useState([])
  const [job, setJob] = useState({})
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')


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
  const sortTable = (array) => {
    let _tmp = [...array]
    _tmp.sort(compare)
    setJobs(_tmp)
  }

  const [machines, setMachines] = useState([])
  const [parts, setParts] = useState([])
  const [timerPart, setTimerPart] = useState("")
  const [count, setCount] = useState(7)

  const [tab, setTab] = useState(1)
  const [users, setUsers] = useState([])


  const subStractDate = (date1, date2) => {
    const diffTime = date1 - date2;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
  }


  useEffect(() => {
    (async () => {
      const _parts = await getProducts("Part")
      const _machines = await getProducts("Machine")
      const _users = await getUsers()

      setMachines(_machines.products)
      setParts(_parts.products)
      setUsers(_users)
    })()
  }, [])

  const [activeJobCount, setActiveJobCount] = useState(0)
  const [finishedJobCount, setFinishedJobCount] = useState(0)
  const [resultCount, setResultCount] = useState(0)
  useEffect(() => {
    (async () => {
      const getJobData = await getJobsAction(page, query, tab, count, orderBy)
      const _jobs = getJobData.jobs
      setActiveJobCount(getJobData.totalActiveCount)
      setFinishedJobCount(getJobData.totalFinishedCount)
      setResultCount(getJobData.resultCount)
      setJobs(_jobs)
    })()
  }, [page, query, tab, orderBy, count])

  const [jobParams, setJobParams] = useState({
    factory: "Pipe And Box",
    city: "Seguin"
  })
  const updateTempJobField = (e, field) => {
    const _v = { ...job, [field]: e.target ? e.target.value : e }
    setJob(_v)
  }
  const manageJob = async () => {
    const form = document.getElementById("job-form")
    const data = new FormData(form)
    if (editID === -1) {
      const newJob = await createJobAction(data)
      setJobModal(false)
      setJobs([newJob, ...jobs])
    }
    else {
      const editedJob = await editJobAction(data, jobs[editID]._id)
      setJobModal(false)
      let _jobs = [...jobs]

      _jobs[editID] = editedJob
      setJobs(_jobs)
    }
  }
  const factoryStyle = {
    stee: 'bg-light text-dark',
    Stee: 'bg-light text-dark',
    prec: 'bg-warning',
    Prec: 'bg-warning',
    pipe: 'bg-info',
    Pipe: 'bg-info',
    box: 'bg-primary',
    Box: 'bg-primary',
    cage: 'bg-dark',
    Cage: 'bg-dark'
  }
  const filteredJobModalParts = useMemo(() => {
    return parts.filter(part => part.city == jobParams.city)
  }, [jobParams, parts])
  const filteredJobModalMachine = useMemo(() => {
    return machines.filter(machine => machine.city == jobParams.city)
  }, [jobParams, machines])

  const deleteJob = async () => {
    const res = await deleteJobAction(jobs[removeID]._id)
    let _jobs = [...jobs]
    _jobs = _jobs.filter((job, index) =>
      index !== removeID
    )

    setJobs(_jobs)
    setJobDeleteModal(false)
  }

  const onKey = (event) => {
    if (event.keyCode === 13)
      setQuery(queryRef.current.value)
  }
  const user = JSON.parse(localStorage.getItem("authUser"))

  return <div className="page-content production-tracker">
    <MetaTags>
      <title>Timer Page</title>
    </MetaTags>
    <Container fluid>
      <div className="jobslist-page-container mt-5 w-100">
        <div className="p-0 m-0 w-100">
          <div className="d-flex justify-content-between page-content-header production-tracker-page-header">
            <div>
              <h2>Production Tracker</h2>
              <div className='sub-menu'>
                <span className="parent">ORDER FLOW</span>
                <span className="mx-1"> &gt; </span>
                <span className="sub text-danger">TEXAS</span>
              </div>
            </div>

          </div>
          <div className='divide-line d-flex align-items-center pt-5'>
            <div className='pe-4'>JOBS</div>
            <div className='line'></div>
          </div>
          <div>
            {user.role == 'Personnel' ?
              <h4 className='mt-5'>Not authorized to see content</h4> :
  
              <div>

                <div className='bg-white jobs-table-container w-100'>
                  <div className='d-flex jobs-table-header'>
                    <div className='d-flex tab-container'>
                      <div className={`jobs-tab ongoing-job-tab cursor-pointer ${tab === 1 ? 'active' : ''}`} onClick={() => {
                        setTab(1)
                        setPage(1)
                      }}>
                        <h3 className='number'>{activeJobCount}</h3>
                        <div>
                          <h4 className="mb-0">Active</h4>
                          <div className="text-secondary">Ongonig jobs</div>
                        </div>
                      </div>
                      <div className={`jobs-tab past-job-tab cursor-pointer ${tab === 0 ? 'active' : ''}`}
                        onClick={() => {
                          setTab(0)
                          setPage(1)
                        }}
                      >
                        <h3 className='number'>{finishedJobCount}</h3>
                        <div>
                          <h4 className="mb-0">Archieved</h4>
                          <div className="text-secondary">Past jobs</div>
                        </div>
                      </div>
                    </div>
                    <div className='d-flex flex-fill'>
                      <div className='d-flex align-items-center ms-4 me-auto ' >
                        <div className='position-relative'>
                          <input className='form-control bg-light ps-5' placeholder='Search...' ref={queryRef} onKeyUp={onKey} />
                          <i className="bi bi-search position-absolute"></i>
                        </div>
                      </div>
                      <div className='countshow d-flex align-items-center mx-3' >
                        <span className="me-2">Show</span>
                        <input className="px-2 py-1 bg-light form-control" value={count} style={{ width: 32 }} onChange={e => setCount(e.target.value)} />
                      </div>
                      <div className='d-flex align-items-center' >
                        <button className='btn btn-newjob ms-3 me-3'
                          onClick={() => {
                            setEditID(-1)
                            setInputType('text')
                            setJob({})
                            toggleModal()
                          }
                          } >
                          NEW JOB
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="jobs-table w-100 overflow-auto">
                    <table className='w-100 table table-nowrap mb-0' id='jobstable'>
                      <thead className=''>
                        <tr>
                          <th></th>
                          <th style={{ paddingLeft: '56px' }} onClick={() => {
                            setOrderby(-orderBy)
                            setSortKey('name')
                          }
                          }>
                            JOBS
                          </th>
                          <th>PART/MACHINE</th>
                          <th style={{ width: 64 }}>DRAWING NUMBER</th>
                          <th style={{ width: '48px' }}>COUNT</th>
                          <th style={{ width: '48px' }}>STATUS</th>
                          <th style={{ width: '48px' }}>DUE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job, index) => (
                          <tr key={'job' + index}>
                            <td style={{ paddingLeft: '20px' }}>{index + 1}</td>
                            <td>
                              <div className='d-flex align-items-center'>
                                {job.user ? <img className='job-user bg-light' src={user.avatar || sampleAvatar}></img> : <div className='job-user'> UA</div>}
                                <div className={`job-factory ${job.factory ? factoryStyle[job.factory.substring(0, 4)] : ''}`}>
                                  {job.factory.substring(0, 4).toUpperCase()}
                                </div>
                                <div className='ms-2'>
                                  <div style={{ lineHeight: '14px' }}><b className='job-name name text-capitalize'>{job.name.toLowerCase()}</b></div>
                                  <div className="text-secondary pt-1" >{job.city}</div>
                                </div>
                              </div>
                            </td>
                            <td className=''>
                              <div style={{ width: '232px' }}>
                                <div><b className='name'>{job.part && job.part.name}</b></div>
                                <div className="text-secondary">{job.machine && job.machine.name}</div>
                              </div>
                            </td>
                            <td>
                              <div className='name' style={{ width: '140px' }}>
                                {job.drawingNumber}
                              </div>
                            </td>
                            <td className='name'>
                              <div>{job.producedCount} / {job.count}</div>
                            </td>
                            <td>
                              <span className="job-status name">{job.active === true ? "Active" : "Finished"}</span>
                              <span className={`${job.active === true ? 'bg-primary' : 'bg-info'} rounded indicator-line`}> </span>
                            </td>
                            <td >
                              <b className=''>{job.dueDate.replace(/T.*$/, '')}</b>
                              <div className="text-secondary ">{
                                subStractDate(new Date(job.dueDate), new Date()) < 0 ?
                                  (<span className='text-danger'>Overdue</span>) : subStractDate(new Date(job.dueDate), new Date()) + " Days"
                              }
                              </div>
                            </td>
                            <td>
                              <b className='position-relative'>
                                <i className='mdi mdi-dots-vertical cursor-pointer' data-bs-toggle="dropdown" aria-expanded="false" id={"expEdit" + index}></i>
                                <div className='dropdown-menu dropdown-menu-end' aria-labelledby={"expEdit" + index} >
                                  <div className='dropdown-item p-4 py-2 cursor-pointer'
                                    onClick={() => {
                                      setJob(job)
                                      setEditID(index)
                                      setInputType('date')
                                      toggleModal()
                                    }
                                    } >
                                    Edit
                                  </div>
                                  <div className='dropdown-item p-4 py-2 cursor-pointer'
                                    onClick={() => {
                                      setRemoveID(index)
                                      toggleDeleteModal()
                                    }
                                    }
                                  >
                                    Delete
                                  </div>
                                </div>
                              </b>
                            </td>
                          </tr>
                        )
                        )
                        }
                      </tbody>
                    </table>
                  </div>
                  <div className='border-0 pagination py-3' style={{ borderRadius: '10px' }}>
                    <div className='pe-0 cursor-pointer' style={{ paddingLeft: '24px' }}>
                      <div className='d-flex align-items-center border-end pe-2'

                        onClick={() => {
                          if (page > 1) {
                            setPage(page - 1)
                          }
                        }
                        }
                      >
                        <span className='mdi mdi-chevron-left'></span>
                        <span>PREV</span>
                      </div>
                    </div>

                    <div className='px-0 cursor-pointer'>
                      <div className='d-flex align-items-center border-end px-2 position-relative'>
                        {page}
                        <i className='mdi mdi-menu-down' data-bs-toggle="dropdown" aria-expanded="false" id="setpage" ></i>
                        <span> of {Math.round(resultCount / count)}</span>
                        <div className='dropdown-menu dropdown-menu-end border-0 p-0' aria-labelledby="setpage">
                          <input className='form-control' type='number'
                            onChange={(e) => {
                              if (e.target.value > 0)
                                setPage(e.target.value)
                            }}
                            style={{ width: '64px' }} />
                        </div>
                      </div>
                    </div>

                    <div className='px-2 cursor-pointer'>
                      <div className='d-flex align-items-center' onClick={() => setPage(page + 1)}>
                        <span>NEXT</span>
                        <span className='mdi mdi-chevron-right'></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            }
          </div>
        </div>
      </div>
    </Container>

    <Modal isOpen={jobModal} toggle={toggleModal} >
      <ModalHeader toggle={toggleModal}>{editID === -1 ? 'Create A New Job' : 'Edit Job'}</ModalHeader>
      <ModalBody>
        <form id="job-form">
          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="text" value={job.name || ''} placeholder='Job Name' name="name" onChange={(e) => updateTempJobField(e, "name")} />
          </div>

          <div className="mt-3 d-flex align-items-center">
            <CitySelect
              value={job.city || ''}
              placeholder="Select City"
              onChange={(e) => {
                setJobParams({ ...jobParams, city: e.target.value })
                updateTempJobField(e, "city")
              }
              }
            />
          </div>
          <div className="mt-3 d-flex align-items-center">
            <select className="form-control" name="user" value={job.user ? job.user._id : ''} onChange={(e) => updateTempJobField(e, "user")}>
              {
                users.map(user => <option value={user._id} key={user._id}>{user.firstName + ' ' + user.lastName}</option>)
              }
            </select>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <FactoryList placeholder="Select Factory" value={job.factory || ''} onChange={(e) => {
              setJobParams({ ...jobParams, factory: e.target.value })
              updateTempJobField(e, "factory")
            }} />
          </div>

          <div className="mt-3 d-flex align-items-center">
            <select className="form-select" name="machine" value={job.machine ? job.machine._id : ''} onChange={(e) => updateTempJobField(e, "machine")}>
              <option value="" disabled >Select Machine</option>
              {
                filteredJobModalMachine.map(m => <option value={m._id} key={"machine-" + m._id} >{m.name}</option>)
              }
            </select>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <div className='w-100'>
              <AutoCompleteSelect
                name="part"
                placeholder="Select Parts"
                option={job.part ? { value: job.part._id, label: job.part.name } : ''}
                options={filteredJobModalParts}
              />
            </div>
          </div>
          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" value={job.drawingNumber || ''} placeholder='Drawing Number' name="drawingNumber" onChange={(e) => updateTempJobField(e, "drawingNumber")} />
          </div>
          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type={editID === -1 ? 'hidden' : 'number'} value={job.producedCount || 0} placeholder='Produced Count' name="producedCount" onChange={(e) => updateTempJobField(e, "producedCount")} />
            <div className={`px-3 ${editID === -1 ? 'd-none' : ''}`}>/</div>
            <input className="form-control" type="number" value={job.count || ''} placeholder='Total Count' name="count" onChange={(e) => updateTempJobField(e, "count")} />
          </div>
          <div className="mt-3 d-flex align-items-center">
            <input
              placeholder="Due Date"
              className="form-control"
              name="dueDate"
              type={inputType}
              value={job.dueDate ? job.dueDate.replace(/T.*$/, '') : ''}
              onFocus={(e) => (e.target.type = 'date')}
              id="date"
              onChange={(e) => {
                updateTempJobField(e, "dueDate")
              }} />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={manageJob}>{editID == -1 ? 'Create' : 'Edit'}</Button>{' '}
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