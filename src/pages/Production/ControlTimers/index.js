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
import './style.scss'
import AutoCompleteSelect from 'components/Common/AutoCompleteSelect';
import { getCurrentTime } from 'helpers/functions';
import { CitySelect, FactoryList } from 'components/Common/Select';

const ControlTimer = (props) => {

  const [timers, setTimers] = useState([])
  useEffect(() => {
    (async () => {
      const _timers = await getProducts("Timer", -1)

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
    return timers.filter(timer => timer.city == controlFilter.city)
  }, [controlFilter, timers])
  const startTimerInController = () => {
    startTimerAction(controlTimer)
  }
  const stopTimerInController = () => {
    endTimerAction(controlTimer)
  }

  const startAllTimers = () => {
    startTimerAction(-1, controlFilter.city)
  }

  const stopAllTimers = () => {
    endTimerAction(-1, controlFilter.city)
  }

  return <div className="page-content">
    <MetaTags>
      <title>Timer Page</title>
    </MetaTags>
    <Container fluid>
      <div className="timer-controller-page-container mt-5">
        <div className="row p-0 m-0">
          <div className="p-0">
            <div className="page-content-header ">
              <div>
                <h2>Timer Controller</h2>
                <div className='sub-menu text-uppercase'>
                  <span className="parent">Production</span>
                  <span className="mx-1"> &gt; </span>
                  <span className='sub text-danger'>TEXAS</span>
                </div>
                <div className='divide-line d-flex align-items-center pt-5'>
                  <div className='line'></div>
                </div>
              </div>

            </div>

            <div className="mt-5 col-lg-4 col-md-6 col-sm-8 card shadow-lg p-3 py-5">
              <CitySelect onChange={(e) => filterChanged("city", e)} />
              {/* <FactoryList className="mt-3" onChange={(e) => filterChanged("facotry", e)} /> */}
              <div className='mt-3'>
                <AutoCompleteSelect options={filteredControllerTimers} onChange={(v) => setControlTimer(v)} className="mt-3" />
              </div>
              <div className='mt-3 d-flex justify-content-between'>
                <Button className="btn btn-success" onClick={() => startTimerInController()}>Start</Button>
                <Button className="btn btn-danger ms-2" onClick={() => stopTimerInController()}>Stop</Button>
              </div>

              <div className='mt-3 d-flex justify-content-between mt-3'>
                <Button className="btn btn-success" onClick={() => startAllTimers()}>Start All</Button>
                <Button className="btn btn-danger ms-2" onClick={() => stopAllTimers()}>Stop All</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
}

export default ControlTimer