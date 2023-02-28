import { useEffect } from "react"
import { cities, factories } from "helpers/globals"
import { useState } from "react"
import MetaTags from "react-meta-tags"
import {
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap"
import Timer from "../components/Timer"
import "./style.scss"
import {
  createTimerAction,
  getProducts,
  Products,
  refreshTimerAction,
  updateTimerAction,
} from "actions/timer"
import { useMemo } from "react"

import AutoCompleteSelect from "components/Common/AutoCompleteSelect"
import { getCurrentTime } from "helpers/functions"
import { CitySelect, FactoryList, MachineClassSelect } from "components/Common/Select"
import io from "socket.io-client"
import TimerLogs from "./component/TimerLogs"
import Pagination from "components/Common/Pagination"
import { BACKEND } from "helpers/axiosConfig"

const socket = io(BACKEND)

const TimerPage = props => {
  const [machineModal, setMachineModal] = useState(false)

  const toggleModal = () => {
    setMachineModal(!machineModal)
  }

  const [city, setCity] = useState("Seguin")
  const [timers, setTimers] = useState([])
  const [compare, setCompare] = useState([false, false, false])
  const [timerPagination, setTimerPagination] = useState({
    page: 1,
    totalPage: 0,
  })

  const moveToTimerPage = (page) => {
    setTimerPagination({
      ...timerPagination,
      page
    })
  }

  useEffect(() => {
    socket.on("connect", () => { console.log('connected') })
    socket.on("disconnect", () => { console.log('dis') })

    socket.on("timerUpdated", (id) => {
      refreshTimer(id)
    })
    return () => {
      socket.off("timerUpdated")
    }
  }, [timers])

  const createTimer = async () => {
    const timerForm = document.getElementById("timer-form")
    const formData = new FormData(timerForm)
    formData.append("city", city)
    toggleModal()
    const res = await createTimerAction(formData)
    setTimers([res.data.timer, ...timers])
  }

  const factoryFilters = [...factories, "All"]
  const [factoryFilter, setFactoryFilter] = useState([
    false,
    false,
    false,
    true,
  ])

  const toggleFilter = (e, filter) => {
    let _filter = [...factoryFilter]
    const index = factoryFilters.findIndex(f => f == filter)
    _filter[index] = !_filter[index]

    if (filter == "All" && factoryFilter[index] == false)
      _filter = [false, false, false, true]

    if (filter != "All" && factoryFilter[index] == false) _filter[3] = false
    setFactoryFilter(_filter)
  }

  const startTimer = (idx, now) => {
    setTimers(
      timers.map((t, index) => {
        return idx != index
          ? t
          : {
            ...t,
            times: [
              ...t.time,
              {
                startTime: now,
                endTime: undefined,
              },
            ],
            status: "Started",
          }
      })
    )
  }

  const stopTimer = (idx, now) => {
    setTimers(
      timers.map((t, index) => {
        let times = [...t.times]
        if (times.length) times[times.length - 1].endTime = now
        return idx != index
          ? t
          : {
            ...t,
            times,
            status: "Pending",
          }
      })
    )
  }

  const [editModal, setEditModal] = useState(false)
  const [editingTimer, setEditingTimer] = useState({
    wegith: 0,
    productionTime: 0,
  })
  const [editingTimerIndex, setEditingTimerIndex] = useState(0)
  const toggleEditModal = () => {
    setEditModal(!editModal)
  }
  const editTimer = idx => {
    setEditingTimer({
      ...timers[idx],
    })
    setEditingTimerIndex(idx)
    setEditModal(true)
  }
  const saveTimer = () => {
    let _timers = [...timers]
    _timers[editingTimerIndex] = {
      ...editingTimer,
    }
    setTimers(_timers)
    updateTimerAction(timers[editingTimerIndex]._id, {
      productionTime: editingTimer.productionTime,
      weight: editingTimer.weight,
    })
    setEditModal(false)
  }
  const updateTimerFields = (f, e) => {
    setEditingTimer({
      ...editingTimer,
      [f]: parseInt(e.target.value),
    })
  }

  const toggleCompare = (idx) => {
    setCompare(compare.map((v, index) => idx == index ? v : !v))
  }

  const [refreshLogs, setRefreshLogs] = useState(false)
  const refreshTimer = async (ids) => {
    let _timers = [...timers]
    for (const id of ids) {
      const timer = await refreshTimerAction(id)
      _timers = _timers.map(t => t._id == timer._id ? timer : t)
    }
    setTimers(_timers)
    setRefreshLogs(true)
  }

  const updateTimers = async () => {
    const _factories = factories.filter((f, idx) => factoryFilter[idx] || factoryFilter[3])
    const res = await getProducts("Timer", -1, { factories: _factories, city })

    setTimers(res.products)
    setTimerPagination({
      ...timerPagination,
      totalPage: Math.ceil(res.totalCount / 9)
    })
  }

  useEffect(() => {
    updateTimers()
  }, [timerPagination.page, factoryFilter, city])

  const [parts, setParts] = useState([])
  const [part, setPart] = useState(null)
  const [machines, setMachines] = useState([])
  const [timerPart, setTimerPart] = useState("")
  const [newTimer, setNewTimer] = useState({
    factory: "",
    part: "",
    machine: ""
  })
  const updateNewTimer = (f, e) => {
    setNewTimer({
      ...newTimer,
      [f]: e.target ? e.target.value : e
    })

  }

  const partChanged = (v) => {
    setTimerPart(v)
    const idx = parts.findIndex(p => v == p._id)
    setPart(parts[idx])
  }

  const getParts = async () => {
    const res = await getProducts("Part", -1)
    setParts(res.products)
  }
  const getMachines = async () => {
    const res = await getProducts("Machine", -1)
    setMachines(res.products)
  }

  useEffect(() => {
    getParts()
  }, [newTimer.factory, city])
  useEffect(() => {
    if (part) {
      getMachines()
    }
  }, [part])

  const classify = [["Radial Press"], ["Steel"], ["Variant", "Variant Perfect"], ["Blizzard", "Tornado", "Perfect System"]]
  const classifiedTimers = useMemo(() => {
    let _timers = []
    classify.forEach(machineClass => {
      const filteredRes = timers
        .filter(timer => machineClass.indexOf(timer.machine.machineClass) != -1)
        .sort((a, b) => {
          return a.machine.name < b.machine.name ? -1 : (a.machine.name > b.machine.name ? 1 : 0)
        })
      _timers.push(filteredRes)
    })
    return _timers
  }, [timers])

  return <div className="page-content">
    <MetaTags>
      <title>Timer Page</title>
    </MetaTags>
    <Container fluid>
      <div className="timer-page-container mt-5 mx-auto">
        <div className="p-0 m-0">
          {/* <div className="col-xl-9 p-0"> */}
          <div className="d-flex justify-content-between timer-page-header page-content-header pb-5">
            <div>
              <h2>Timer and Analytics</h2>
              <div className='sub-menu text-uppercase'>
                <span className="parent">Production</span>
                <span className="mx-1"> &gt; </span>
                <span className='sub text-danger'>TEXAS</span>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="d-flex flex-column align-items-center border-left-right px-4">
                <h3 className="mb-0">{timers.length}</h3>
                <div className="text-black-50">Timers </div>
              </div>
              <button
                className="btn btn-newtimer btn-primary ms-3 "
                onClick={() => setMachineModal(true)}
              >
                NEW TIMER
              </button>
            </div>
          </div>

          <div
            className="mt-3 pb-3"
            style={{
              borderBottom: "2px solid #dddee2",
            }}
          >
            <div className="d-flex city-selector-container row p-0 m-0">
              {cities.map((_city, index) => (
                <div
                  key={'city' + index}
                  className="city text-uppercase col-lg-4 col-md-6 "
                >
                  <div
                    className={`city-selector ${_city == city ? "active" : ""
                      }`}
                    onClick={() => setCity(_city)}
                  >
                    <span className="pt-2">{_city}</span>
                    <span>
                      <i className="mdi mdi-poll"></i>
                    </span>
                  </div>
                  <div
                    className="mt-1 d-flex justify-content-end compare"
                    style={{ marginRight: "20px" }}
                  >
                    <span>COMPARE{" "}</span>
                    <input type="checkbox" className="form-checkbox ms-2" onClick={() => toggleCompare(index)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sort-container">
            <div className="sort-text">
              SHOW ONLY
            </div>
            <div className="d-flex">
              {
                factoryFilters.map((factory, index) => <label key={`factory1-${index}`} className="sort-factory-category mb-0">
                  {factory}
                  <input type="checkbox" className="form-checkbox"
                    onClick={(e) => toggleFilter(e, factory)} id={`factory-filter-${factory}`}
                    onChange={() => { }}
                    checked={factoryFilter[index]} />
                </label>)
              }
            </div>
          </div>
          {
            classifiedTimers.map((cTimers, index) => {
              return cTimers.length ? <>
                <div className="products-container row">
                  <h2 className="text-uppercase"> {index != 3 ? classify[index][0] : "Precast"} - TIMERS </h2>
                  <div className="col-xl-12 row p-0 m-0">
                    {
                      cTimers.map((timer, idx) => (
                        <Timer
                          {...timer}
                          key={`timer1-${timer._id}`}
                          idx={idx}
                          startTimer={startTimer}
                          stopTimer={stopTimer}
                          refreshTimer={refreshTimer}
                          editTimer={editTimer} />)
                      )
                    }
                  </div>
                </div>

                <div className="row m-0 rounded">
                  <div className="search-container mx-0">
                    <div className="flex-1">
                      <div className="row m-0" style={{ paddingTop: 12 }}>
                        <div className="d-flex align-items-center col-xl-3">
                          <h5>PRODUCTION REPORT</h5>
                        </div>
                        <div className="d-flex align-items-center col-xl-3">
                        </div>
                        <div className="d-flex align-items-center col-xl-2">
                          <h5>
                            <div>INCLUDE</div>
                            <div>OPERATOR</div>
                          </h5>
                        </div>
                        <div className="d-flex align-items-center col-xl-4">
                          <h5>REVIEW RANGE</h5>
                        </div>
                      </div>

                      <div className="m-0 search-box row mb-3">
                        <div className="col-xl-3">
                          <MachineClassSelect name="log-filter" placeholder='Machine or Class' />
                        </div>

                        <div className="col-xl-3">
                          <select
                            className="form-select"
                            value={[]}
                          >
                            <option value="" disabled selected>Product or Part</option>
                            {
                              parts.map(part => (
                                <option value={part._id} key={"log-filter1-" + part._id}>{part.name}</option>
                              ))
                            }
                          </select>
                        </div>

                        <div className="col-xl-2 d-flex align-items-center">
                          <div className='d-flex align-items-stretch'>
                            <input type="checkbox" className="form-checkbox" />
                            <h6 className='ms-2 my-auto'>Yes</h6>
                          </div>
                        </div>

                        <div className="col-xl-4 align-items-center  d-flex">
                          <input type="date" className="form-control " />
                          <span className="mx-1">to</span>
                          <input type="date" className="form-control" />
                        </div>
                      </div>
                    </div>

                    <div className="search-action">
                      <span className="mdi mdi-refresh cursor-pointer"></span>
                    </div>
                  </div>
                </div>
                <div className="timerlog-table-container mt-4">
                  <TimerLogs
                    city={city}
                    compare={compare}
                    filteredParts={[]}
                    refreshLogs={refreshLogs}
                    timers={cTimers}
                    afterRefresh={() => setRefreshLogs(false)}
                    factoryFilter={factoryFilter}
                    classify={index != 3 ? classify[index][0] : "Precast"} />
                </div>
              </>
                : <></>
            })
          }
        </div>
      </div>

    </Container>
    <Modal isOpen={machineModal} toggle={toggleModal} >
      <ModalHeader toggle={toggleModal}>Create New Timer</ModalHeader>
      <ModalBody>
        <form id="timer-form">
          <div className="row">
            <div className="col-3">City:</div>
            <div className="col-9"><b>{city}</b></div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Factory:</div>
            <div className="col-9">
              <FactoryList
                onChange={(e) => updateNewTimer("factory", e)}
                value={newTimer.factory}
                placeholder="Factory" />
            </div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Part:</div>
            <div className="col-9">
              <AutoCompleteSelect
                options={parts} onChange={v => partChanged(v)}
                placeholder="Part" />
              <input type="hidden" name="part" value={timerPart} />
            </div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Machine:</div>
            <div className="col-9">
              <select className="form-select" name="machine"
                onChange={(e) => updateNewTimer("machine", e)}
                value={newTimer.machine}>
                <option value="" disabled>Machine</option>
                {
                  machines.map(m => <option value={m._id} key={"machine1-" + m._id} >{m.name}</option>)
                }
              </select>
            </div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Weight:</div>
            <div className="col-9">
              <input className="form-control" readOnly type="number" name="weight" value={part && part.pounds} />
            </div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Production Time:</div>
            <div className="col-9">
              <input className="form-control" readOnly name="productionTime" type="number" value={part && part.avgTime} />
            </div>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={createTimer}>Create</Button>{' '}
        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={editModal} toggle={toggleEditModal} >
      <ModalHeader toggle={toggleModal}>Edit Timer</ModalHeader>
      <ModalBody>
        <form id="timer-form">
          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Weight:</div>
            <div className="col-9">
              <input value={part && part.pounds} type="number" className="form-control" />
            </div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Production Time:</div>
            <div className="col-9">
              <input value={part && part.avgTime} type="number" className="form-control" />
            </div>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={saveTimer}>Save</Button>{' '}
        <Button color="secondary" onClick={toggleEditModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
  </div>
}

export default TimerPage
