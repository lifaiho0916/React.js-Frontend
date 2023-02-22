import { useEffect } from 'react';
import { cities, factories } from 'helpers/globals';
import { useState } from 'react';
import MetaTags from 'react-meta-tags';
import {
  Container, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from "reactstrap"
import Timer from '../components/Timer';
import { createTimerAction, endTimerAction, getProducts, startTimerAction, updateTimerAction } from 'actions/timer';
import { useMemo } from 'react';

import AutoCompleteSelect from 'components/Common/AutoCompleteSelect';
import { getCurrentTime } from 'helpers/functions';
import { CitySelect, FactoryList } from 'components/Common/Select';

const ControlTimer = (props) => {

  const [machineModal, setMachineModal] = useState(false)

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
    })()
  }, [])

  const [controlFilter, setControlFilter] = useState({
    city: "Seguin",
    factory: "Pipe And Box"
  })
  const [controlTimer, setControlTimer] = useState("")
  const filterChanged = (field, e) => {
    setControlFilter({
      ...controlFilter,
      [field]: e.target.value
    })
  }
  const filteredControllerTimers = useMemo(() => {
    return timers.filter(timer => timer.city==controlFilter.city&&timer.factory==controlFilter.factory)
  }, [controlFilter, timers])
  const startTimerInController = () => {
    startTimerAction(controlTimer)
  }
  const stopTimerInController = () => {
    endTimerAction(controlTimer)
  }

  return <div className="page-content">
    <MetaTags>
      <title>Timer Page</title>
    </MetaTags>
    <Container fluid>
      <div className="timer-page-container mt-5">
        <div className="row p-0 m-0">
          <div className="col-xl-3 col-lg-6 col-sm-8 p-0">
            <div className="d-flex justify-content-between timer-page-header">
              <div>
                <h1>Timer Controller</h1>
                <div>
                  <span className="text-black-50">PRODUCTION</span>
                  <span className="mx-3"> &gt; </span>
                  <span className="text-danger">TEXAS</span>
                </div>
              </div>
            </div>

            <div className="mt-5 shadow-sm p-3">
              <CitySelect onChange={(e) => filterChanged("city", e) }/>
              <FactoryList className="mt-3" onChange={(e) => filterChanged("facotry", e)} />
              <div className='mt-3'>
                <AutoCompleteSelect options={filteredControllerTimers} onChange={(v) => setControlTimer(v)} className="mt-3" />
              </div>
              <div className='mt-3 d-flex justify-content-end'>
                <Button className="btn btn-success" onClick={() => startTimerInController()}>Start</Button>
                <Button className="btn btn-danger ms-2" onClick={() => stopTimerInController()}>Stop</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
}

export default ControlTimer