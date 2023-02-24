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
import { CitySelect, FactoryList } from "components/Common/Select"
import io from "socket.io-client"
import TimerLogs from "./component/TimerLogs"
import Pagination from "components/Common/Pagination"

const socket = io("http://localhost:8000")

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
    socket.on("connect", () => {console.log('connected')})
    socket.on("disconnect", () => {console.log('dis')})

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
  const refreshTimer = async (id) => {
    const timer = await refreshTimerAction(id)
    setTimers(timers.map(t => t._id == timer._id ? timer : t))
    setRefreshLogs(true)
  }

  const updateTimers = async () => {
    const _factories = factories.filter((f, idx) => factoryFilter[idx]||factoryFilter[3])
    const res = await getProducts("Timer", timerPagination.page, { factories: _factories, city })

    setTimers(res.products)
    setTimerPagination({
      ...timerPagination,
      totalPage: Math.ceil(res.totalCount / 9)
    })
  }

  useEffect(() => {
    updateTimers()
  }, [timerPagination.page, compare, city])

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
      [f]: e.target?e.target.value:e
    })

  }

  const partChanged = (v) => {
    setTimerPart(v)
    const idx = parts.findIndex(p => v == p._id)
    setPart(parts[idx])
  }

  const getParts = async () => {
    const res = await getProducts("Part", -1, { factory: newTimer.factory, city })
    setParts(res.products)
  }
  const getMachines = async() => {
    const res = await getProducts("Machine", -1, { factory: newTimer.factory, city, machineClass: part.machineClass })
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

  return <div className="page-content">
    <MetaTags>
      <title>Timer Page</title>
    </MetaTags>
    <Container fluid>
      <div className="timer-page-container mt-5 mx-auto">
        <div className="row p-0 m-0">
          {/* <div className="col-xl-9 p-0"> */}
          <div className="d-flex justify-content-between timer-page-header">
            <div>
              <h1 style={{ fontSize: "44px" }}>Timer and Analytics</h1>
              <div style={{ fontSize: "18px" }}>
                <span className="text-black-50">PRODUCTION</span>
                <span className="mx-3"> &gt; </span>
                <span className="text-danger">TEXAS</span>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="d-flex flex-column align-items-center border-left-right px-2">
                <h2>{timers.length}</h2>
                <div>Timers </div>
              </div>
              <button
                className="btn btn-primary ms-3 h-75"
                onClick={() => setMachineModal(true)}
              >
                NEW TIMER
              </button>
            </div>
          </div>

          <div
            className="mt-3"
            style={{
              paddingLeft: "0px",
              paddingRight: "0px",
              borderBottom: "2px solid rgba(221, 222, 226, 0.5)",
              paddingBottom: "1rem",
              marginLeft: "-10px",
              maxWidth: "none",
              width: "calc(100% + 20px)",
            }}
          >
            <div className="d-flex city-selector-container row p-0 m-0">
              {cities.map((_city, index) => (
                <div
                  key={_city._id}
                  className="city text-uppercase p-2 col-lg-4 col-md-6 "
                >
                  <div
                    className={`city-selector ${_city == city ? "active" : ""
                      }`}
                    style={{
                      padding: "20px",
                    }}
                    onClick={() => setCity(_city)}
                  >
                    <span>{_city}</span>
                    <span>
                      <i className="mdi mdi-poll"></i>
                    </span>
                  </div>
                  <div
                    className="mt-1 d-flex justify-content-end"
                    style={{ marginRight: "20px" }}
                  >
                    COMPARE{" "}
                    <input type="checkbox" className="form-checkbox ms-2" onClick={() => toggleCompare(index)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sort-container">
            <div className="sort-text">
              SORT
            </div>
            <div className="d-flex">
              {
                factoryFilters.map((factory, index) => <div key={`factory-${index}`} className="sort-factory-category">
                  {factory}
                  <input type="checkbox" className="form-checkbox"
                    onClick={(e) => toggleFilter(e, factory)} id={`factory-filter-${factory}`}
                    onChange={() => { }}
                    checked={factoryFilter[index]} />
                </div>)
              }
            </div>
          </div>
          <div className="products-container row m-0 p-0 mt-5">
            <div className="d-flex justify-content-end">
              <Pagination
                page={timerPagination.page}
                movePage={moveToTimerPage}
                totalPage={timerPagination.totalPage} />
            </div>
            <div className="col-xl-9 row p-0 m-0">
              {
                timers.map((timer, idx) => (
                  <Timer
                    {...timer}
                    key={`timer-${timer._id}`}
                    idx={idx}
                    startTimer={startTimer}
                    stopTimer={stopTimer}
                    refreshTimer={refreshTimer}
                    editTimer={editTimer} />)
                )
              }
            </div>
          </div>
          <TimerLogs
            city={city}
            compare={compare}
            filteredParts={[]}
            refreshLogs={refreshLogs}
            timers={timers}
            afterRefresh={() => setRefreshLogs(false)} />
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
                  machines.map(m => <option value={m._id} key={"machine-" + m._id} >{m.name}</option>)
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
