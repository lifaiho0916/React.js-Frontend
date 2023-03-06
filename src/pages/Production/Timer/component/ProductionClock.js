import { getCityAction, updateCityAction } from "actions/city"
import { startProductionTimeAction } from "actions/timer"
import { formatSeconds, getCurrentTime } from "helpers/functions"
import { useEffect, useState } from "react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap"

const offset = {
  "Seguin": -6,
  "Conroe": -6,
  "Gunter": -6
}

const ProductionClock = (props) => {

  const [now, setNow] = useState(new Date())
  const [time, setTime] = useState(0)
  const [start, setStart] = useState(null)
  const [productionTime, setProductionTime] = useState(0)
  const { city } = props
  const [productionTimeModal, setProductionTimeModal] = useState(false)
  const [editedTime, setEditedTime] = useState(0)

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(getCurrentTime(offset[city]))
      if (start) setTime((new Date().getTime() - new Date(start).getTime()) / 1000)
      else setTime(0)
    }, 1000)

    return () => { clearInterval(timerId) }
  }, [now])

  useEffect(() => {
    getLog()
  }, [city])

  const getLog = async () => {
    const log = await startProductionTimeAction(city)
    const cityInfo = await getCityAction(city)

    if (log) setStart(log.startedAt)
    else setStart(null)
    setProductionTime(cityInfo.productionTime)
  }

  const toggleModal = () => {
    setProductionTimeModal(!productionTimeModal)
  }

  const saveProductionTime = async () => {
    setProductionTimeModal(false)
    const res = await updateCityAction(city, editedTime)
    setProductionTime(editedTime)
  }

  return <>
    <div className="sort-container">
      <div className="sort-text">
        CLOCKS
      </div>
      <div className="d-flex row clock-container w-100">
        <div className="col-3 text-center">
          <div>{now.toDateString().substring(4, 15)}</div>
          <div className="desc">DATE</div>
        </div>

        <div className="col-3 text-center">
          <div>{now.toTimeString().substring(0, 8)}</div>
          <div className="desc">LOCAL TIME</div>
        </div>

        <div className="col-3 text-center">
          <div>{formatSeconds(time)}</div>
          <div className="desc">IN PRODUCTION</div>
        </div>

        <div className="col-3 text-center">
          <div>{productionTime} HOURS</div>
          <div className="desc">PRODUCTION  TIME</div>
        </div>
      </div>
    </div>
    <div className="sort-container" style={{ border: 'none' }}>
      <div className="sort-text"></div>
      <div className="row flex-1">
        <div className="col-9"></div>
        <div className="col-3 d-flex justify-content-center">
          <button
            className="btn btn-success"
            onClick={() => setProductionTimeModal(true)}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '.175rem',
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <Modal isOpen={productionTimeModal} toggle={toggleModal} >
      <ModalHeader toggle={toggleModal}>Set Production Time Of {city}</ModalHeader>
      <ModalBody>
        <form id="timer-form">
          <input type="number" className="form-control" onChange={e => setEditedTime(e.target.value)} />
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={saveProductionTime}>Save</Button>{' '}
        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
  </>
}

export default ProductionClock