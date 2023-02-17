import "./style.scss"
import { formatSeconds } from "../../../helpers/functions"
import { useState } from "react"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { endTimerAction, startTimerAction } from "actions/timer";
import { useEffect } from "react";

const Timer = (props) => {

  const [status, setStatus] = useState(props.status)
  const [moreMenu, setMoreMenu] = useState(false)

  const toggle = () => {
    setMoreMenu(!moreMenu)
  }

  const toggleTimer = async () => {
    if (status == "Pending") {
      await startTimerAction(props._id)
      setStatus("Started")
      setTimeout(() => {
        setTime(time + 1)
      }, 1000)
    }
  }

  const stopTimer = async () => {
    await endTimerAction(props._id)
    setStatus("Ended")
    setTotalTime(time)
  }

  const [time, setTime] = useState(props.time)
  const [totalTime, setTotalTime] = useState(props.totalTime)

  useEffect(() => {
    if (status != "Started") return

    const timerId = setInterval(() => {
      setTime(time + 1);
    }, 1000)

    return (() => { clearInterval(timerId) })
  }, [time])

  return <div className="col-lg-4 col-md-6 p-2">
    <div className="product p-2">
      <div className="product-header">
        <select className="form-select">
          <option>{ props.part.name }</option>
        </select>
        <Dropdown isOpen={moreMenu} toggle={toggle}>
          <DropdownToggle caret>
            <span className="mdi mdi-dots-horizontal"></span>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Remove</DropdownItem>
            <DropdownItem onClick={stopTimer}>Stop</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="product-preview">
        <img src={ "http://localhost:8000"+props.machine.preview } className="w-100 h-100" />
        <div className="time">{formatSeconds(time)}</div>
        {
          status == "Pending" ? <button className="action play" onClick={toggleTimer}>
            <span className="mdi mdi-play"></span>
          </button> : ""
        }
      </div>
      <div className="product-info">
        <div className="product-name w-100">
          <span>{ props.machine.name }</span>
          <span className={`${status == "Ended" && totalTime <= props.productionTime ? "text-success" : "text-danger"}`}>{ formatSeconds(totalTime) }</span>
        </div>

        <div className="product-details">
          <div className="product-detail">
            <span>Daily Units</span>
            <span>{props.dailyUnits}</span>
          </div>
          
          <div className="product-detail">
            <span>Daily Tons</span>
            <span>{props.dailyTons}</span>
          </div>

          <div className="product-detail">
            <span>Average Ton/hr</span>
            <span>{props.averageTon}</span>
          </div>

          <div className="product-detail">
            <span>Average Unit/hr</span>
            <span>{props.averageUnit}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default Timer