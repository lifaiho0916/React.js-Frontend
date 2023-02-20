import { useEffect } from 'react';
import { cities, factories } from 'helpers/globals';
import { useState } from 'react';
import MetaTags from 'react-meta-tags';
import {
  Container, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from "reactstrap"
import Timer from '../components/Timer';
import "./style.scss"
import { createTimerAction, getProducts, updateTimerAction } from 'actions/timer';
import { useMemo } from 'react';

import AutoCompleteSelect from 'components/Common/AutoCompleteSelect';
import { getCurrentTime } from 'helpers/functions';
import { CitySelect, FactoryList } from 'components/Common/Select';

const TimerPage = (props) => {

  const [machineModal, setMachineModal] = useState(false)

  const toggleModal = () => {
    setMachineModal(!machineModal)
  }

  const [city, setCity] = useState("Seguin")

  const [parts, setParts] = useState([])
  const [machines, setMachines] = useState([])
  const [timers, setTimers] = useState([])
  useEffect(() => {
    (async() => {
      const _parts = await getProducts("Part")
      const _machines = await getProducts("Machine")
      const _timers = await getProducts("Timer")

      setMachines(_machines.products)
      setParts(_parts.products)
      setTimers(_timers.products)
      setInputs({
        factory: _machines.products[0].factory,
        weight: _parts.products[0].weight,
        productionTime: _parts.products[0].productionTime
      })
    })()
  }, [])

  const createTimer = async() => {
    const timerForm = document.getElementById("timer-form")
    const formData = new FormData(timerForm)
    formData.append("city", city)
    toggleModal()
    const res = await createTimerAction(formData)
    setTimers([res.data.timer, ...timers])
  }  

  const [inputs, setInputs] = useState({
    factory: "",
    weight: 0,
    productionTime: 0
  })
  const [timerPart, setTimerPart] = useState("")

  const updateField = (f, e) => {
    setInputs({
      ...inputs,
      [f]: e.target.value
    })
  }

  const machineChanged = (e) => {
    const id = e.target.value
    const idx = machines.findIndex(m => m._id == id)
    setInputs({
      ...inputs,
      factory: machines[idx].factory
    })
  }

  const partChanged = (v) => {
    const idx = parts.findIndex(m => m._id == v)
    setInputs({
      ...inputs,
      weight: parts[idx].pounds,
      productionTime: parts[idx].avgTime,
    })
    setTimerPart(v)
  }

  const factoryFilters = [...factories, "All"]
  const [factoryFilter, setFactoryFilter] = useState([false, false, false, true])
  const filteredTimers = useMemo(() => {
    return timers.filter(timer => {
      if (timer.city != city) return false
      for (let index = factoryFilter.length - 1; index > -1; index--) {
        if (!factoryFilter[index]) continue
        if (factoryFilters[index] == "All" || factoryFilters[index] == timer.factory) return true
      }
      return false
    })
  }, [timers, city, factoryFilter])

  const filteredMachines = useMemo(() => {
    return machines.filter(machine => machine.city == city)
  }, [timers, city])

  const filteredParts = useMemo(() => {
    return parts.filter(part => part.city == city)
  }, [parts, city])

  const toggleFilter = (e, filter) => {
    let _filter = [...factoryFilter]
    const index = factoryFilters.findIndex(f => f == filter)
    _filter[index] = !_filter[index]

    if (filter == "All" && factoryFilter[index] == false)
      _filter = [false, false, false, true]

    if (filter != "All" && factoryFilter[index] == false)
      _filter[3] = false
    setFactoryFilter(_filter)
  }

  const startTimer = (idx, now) => {
    setTimers(timers.map((t, index) => {
      return idx != index ? t : {
        ...t,
        times: [
          ...t.time,
          {
            startTime: now,
            endTime: undefined
          },
        ],
        status: "Started"
      }
    }))
  }

  const stopTimer = (idx, now) => {
    setTimers(timers.map((t, index) => {
      let times = [...t.times]
      if (times.length)
        times[times.length - 1].endTime = now
      return idx != index ? t : {
        ...t,
        times,
        status: "Pending"
      }
    }))
  }

  const endTimer = (idx, time) => {
    setTimers(timers.map((t, index) => {
      return idx != index ? t : {
        ...t,
        times: [],
        status: "Pending",
        latest: t.times,
        dailyUnit: t.dailyUnit + 1,
        dailyTon: t.dailyTon + t.productionTime,
        totalTime: t.totalTime + time
      }
    }))
  }

  const [editModal, setEditModal] = useState(false)
  const [editingTimer, setEditingTimer] = useState({wegith: 0, productionTime: 0})
  const [editingTimerIndex, setEditingTimerIndex] = useState(0)
  const toggleEditModal = () => {
    setEditModal(!editModal)
  }
  const editTimer = (idx) => {
    setEditingTimer({
      ...timers[idx]
    })
    setEditingTimerIndex(idx)
    setEditModal(true)
  }
  const saveTimer = () => {
    let _timers = [...timers]
    _timers[editingTimerIndex] = {
      ...editingTimer
    }
    setTimers(_timers)
    updateTimerAction(timers[editingTimerIndex]._id, {
      productionTime: editingTimer.productionTime,
      weight: editingTimer.weight
    })
    setEditModal(false)
  }
  const updateTimerFields = (f, e) => {
    setEditingTimer({
      ...editingTimer,
      [f]: parseInt(e.target.value)
    })
  }

  return <div className="page-content">
    <MetaTags>
      <title>Timer Page</title>
    </MetaTags>
    <Container fluid>
      <div className="timer-page-container mt-5">
        <div className="row p-0 m-0">
          <div className="col-xl-9 p-0">
            <div className="d-flex justify-content-between timer-page-header">
              <div>
                <h1>Timer and Analytics</h1>
                <div>
                  <span className="text-black-50">PRODUCTION</span>
                  <span className="mx-3"> &gt; </span>
                  <span className="text-danger">TEXAS</span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="d-flex flex-column align-items-center border-left-right px-2">
                  <h2>8</h2>
                  <div>Machines </div>
                </div>
                <button className='btn btn-primary ms-3 h-75' onClick={() => setMachineModal(true)}>NEW MACHINE</button>
              </div>
            </div>

            <div className="mt-3">
              <div className="d-flex city-selector-container row p-0 m-0">
                {
                  cities.map(_city => <div key={_city._id} className="city text-uppercase p-2 col-lg-4 col-md-6 " onClick={() => setCity(_city)}>
                    <div className={`city-selector ${_city == city ? 'active' : ''}`}>
                      <span>{_city}</span>
                      <span><i className="mdi mdi-poll"></i></span>
                    </div>
                    <div className='mt-1 d-flex justify-content-end'>
                      COMPARE <input type="checkbox" className="form-checkbox ms-2" />
                    </div>
                  </div>)
                }
              </div>
            </div>
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
                  onChange={() => {}}
                  checked={factoryFilter[index]} />
              </div>)
            }
          </div>
        </div>
        <div className="products-container row m-0 p-0 mt-5">
          <div className="col-xl-9 row p-0 m-0">
            {
              filteredTimers.map((timer, idx) => (
                <Timer 
                  { ...timer }
                  key={`timer-${timer._id}`}
                  idx={idx}
                  startTimer={startTimer}
                  stopTimer={stopTimer}
                  endTimer={endTimer}
                  editTimer={editTimer} />)
              )
            }
          </div>
        </div>

        <div className="row m-0 mt-5">
          <div className="search-container col-xl-9 mx-0">
            <div className='flex-1'>
              <div className='row m-0 mt-2'>
                <div className="col-xl-3">
                  <h4>MACHINE TYPE</h4>
                </div>
                <div className='col-xl-3'>
                  <h4>PRODUCT TYPE</h4>
                </div>
                <div className="col-xl-3">
                  <h4>
                    <div>INCLUDE</div>
                    <div>OPERATOR</div>
                  </h4>
                </div>
                <div className="col-xl-3">
                  <h4>REVIEW RANGE</h4>
                </div>
              </div>

              <div className="m-0 search-box row my-2">
                <div className="col-xl-3">
                  <input type="text" className="form-control" />
                </div>

                <div className='col-xl-3'>
                  <select className="form-select">
                    <option>option1</option>
                    <option>option2</option>
                  </select>
                </div>

                <div className='col-xl-3'>
                  <div><input type="checkbox" className="form-checkbox" /> Yes</div>
                </div>

                <div className='col-xl-3'>
                  <input type="text" className="form-control" />
                </div>
              </div>
            </div>

            <div className="search-action">
              <span className="mdi mdi-refresh"></span>
            </div>
          </div>
        </div>
      </div>
    </Container>

    <Modal isOpen={machineModal} toggle={toggleModal} >
      <ModalHeader toggle={toggleModal}>Create New Timer</ModalHeader>
      <ModalBody>
        <form id="timer-form">
          <div className="row">
            <div className="col-3">City:</div>
            <div className="col-9"><b>{ city }</b></div>
          </div>
          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Factory:</div>
            <div className="col-9">
              <FactoryList />
            </div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Machine:</div>
            <div className="col-9">
              <select className="form-select" name="machine" onChange={e => machineChanged(e)}>
                {
                  filteredMachinesModal.map(m => <option value={m._id} key={"machine-"+m._id} >{m.name}</option>)
                }
              </select>
            </div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Part:</div>
            <div className="col-9">
              <AutoCompleteSelect options = {filteredParts} onChange={v => partChanged(v)} />
              <input type="hidden" name="part" value={timerPart} />
            </div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Weight:</div>
            <div className="col-9">
              <input className="form-control disabled-input" type="number" name="weight" value={inputs.weight} onChange={e => updateField("weight", e)} />
            </div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Production Time:</div>
            <div className="col-9">
              <input className="form-control disabled-input" name="productionTime" type="number" value={inputs.productionTime} onChange={e => updateField("productionTime", e)} />
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
              <input value={editingTimer.weight} type="number" onChange={e => updateTimerFields("weight", e)} className="form-control" />
            </div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Production Time:</div>
            <div className="col-9">
              <input value={editingTimer.productionTime} type="number" onChange={e => updateTimerFields("productionTime", e)} className="form-control" />
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