import "./style.scss"
import { formatSeconds } from "../../../helpers/functions"
import { useState } from "react"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { endTimerAction, startTimerAction, stopTimerAction } from "actions/timer";
import { useEffect } from "react";

const Timer = (props) => {

  const [status, setStatus] = useState(props.status)
  const [moreMenu, setMoreMenu] = useState(false)

  const toggle = () => {
    setMoreMenu(!moreMenu)
  }

  const toggleTimer = async () => {
    if (status == "Pending") {
      setStatus("Started")
      setTimeout(() => {
        setTime(time + .1)
      }, 100)
      props.startTimer()
      await startTimerAction(props._id)
    } else if (status == "Started") {
      setStatus("Pending")
      clearInterval(currentTimerId)
      props.stopTimer()
      await stopTimerAction(props._id)
    }
  }

  const stopTimer = async () => {
    setStatus("Pending")
    setTotalTime(time)
    setTime(0)
    props.endTimer()
    await endTimerAction(props._id)
  }

  const [time, setTime] = useState(-1)
  const [totalTime, setTotalTime] = useState(props.totalTime)
  const [currentTimerId, setCurrentTimerId] = useState(-1)

  useEffect(() => {
    let total = 0
    props.times.forEach(t => {
      console.log(t)
      if (t.endTime) {
        total += ((new Date(t.endTime).getTime() - new Date(t.startTime).getTime()) / 1000)
      } else {
        total += ((new Date().getTime() - new Date(t.startTime).getTime()) / 1000)
      }
    })
    setTime(total)
  }, [])

  useEffect(() => {
    if (status != "Started" || time == -1) return

    const timerId = setInterval(() => {
      setTime(time + .1);
    }, 100)
    setCurrentTimerId(timerId)

    return (() => { clearInterval(timerId) })
  }, [time])

  const editTimer = () => {
    props.editTimer(props.idx)
  }

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
            <DropdownItem onClick={editTimer}>Edit</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="product-preview">
        <img src={ props.machine.preview } className="w-100 h-100" />
        <div className="time">{formatSeconds(time)}</div>
        {
          status == "Pending" ? <button className="action play" onClick={toggleTimer}>
            <span className="mdi mdi-play"></span>
          </button> : (status == "Started" ? <button className="action stop" onClick={toggleTimer}>
            <span className="mdi mdi-stop"></span>
          </button> : "")
        }
      </div>
      <div className="product-info">
        <div className="product-name w-100">
          <span>{ props.machine.name }</span>
          <span className={`${status == "Ended" && totalTime <= props.productionTime ? "text-success" : "text-danger"}`}>
            { formatSeconds(totalTime) }
          </span>
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