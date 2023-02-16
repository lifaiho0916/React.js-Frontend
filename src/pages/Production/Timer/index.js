import { useEffect } from 'react';
import { cities, factories } from 'helpers/globals';
import { useState } from 'react';
import MetaTags from 'react-meta-tags';
import {
  Container, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from "reactstrap"
import Timer from '../components/Timer';
import "./style.scss"
import { createTimerAction, getProducts } from 'actions/timer';

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

  const partChanged = (e) => {
    const id = e.target.value
    const idx = parts.findIndex(p => p._id == id)
    setInputs({
      ...inputs,
      weight: parts[idx].pounds,
      productionTime: parts[idx].avgTime,
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
                <h1>Prodct Lists</h1>
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
              <div className="d-flex city-selector-container">
                {
                  cities.map(_city => <div key={_city} className="city text-uppercase" onClick={() => setCity(_city)}>
                    <div className={`city-selector ${_city == city ? 'active' : ''}`}>
                      <span>{_city}</span>
                      <span className="percent">31.3%<span class="mdi mdi-menu-up"></span></span>
                      <span><i class="mdi mdi-poll"></i></span>
                    </div>
                    <div className='mt-1 d-flex justify-content-end'>
                      COMPARE <input type="checkbox" className="form-checkbox ms-2" />
                    </div>
                  </div>)
                }
              </div>
            </div>

            <div className="search-container">
              <div className="search-box row">
                <div className="col-xl-2">
                  <div>NAME</div>
                  <input type="text" className="form-control" />
                </div>

                <div className='col-xl-4'>
                  <div>NAME</div>
                  <select className="form-select">
                    <option>option1</option>
                    <option>option2</option>
                  </select>
                </div>

                <div className='col-xl-2'>
                  <div>INCLUDE</div>
                  <div><input type="checkbox" className="form-checkbox" /> Yes</div>
                </div>

                <div className='col-xl-4'>
                  <div>PERFORMANCE REVIEW RANGE</div>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="search-action">
                <span class="mdi mdi-refresh"></span>
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
              factories.map((factory, index) => <div key={`factory-${factory}`} className="sort-factory-category">
                {factory}
                <input type="checkbox" className="form-checkbox" />
              </div>)
            }
          </div>
        </div>
        <div className="products-container row m-0 p-0 mt-5">
          {
            timers.filter(t => t.city == city).map(timer => <Timer { ...timer } key={`timer-${timer._id}`} />)
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
            <div className="col-9"><b>{ city }</b></div>
          </div>
          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Factory:</div>
            <div className="col-9">
              <select className='form-select disabled-input' onChange={(e) => updateField("factory", e)} value={inputs.factory}>
                {
                  factories.map(factory => <option className="" key={"factory-option-"+factory} value={factory}>{factory}</option>)
                }
              </select>
            </div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Machine:</div>
            <div className="col-9">
              <select className="form-select" name="machine" onChange={e => machineChanged(e)}>
                {
                  machines.filter(m=>m.city == city).map(m => <option value={m._id} key={"machine-"+m._id} >{m.name}</option>)
                }
              </select>
            </div>
          </div>

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-3">Part:</div>
            <div className="col-9">
              <select className="form-select" name="part" onChange={e => partChanged(e)}>
                {
                  parts.map(m => <option value={m._id} key={"part-"+m._id}>{m.name}</option>)
                }
              </select>
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
  </div>
}

export default TimerPage