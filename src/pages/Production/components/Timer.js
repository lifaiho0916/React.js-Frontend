import "./style.scss"
import { formatSeconds } from "../../../helpers/functions"
import { useState } from "react"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { endTimerAction, startTimerAction } from "actions/timer";
import { useEffect } from "react";
import { useRef } from "react";

const Timer = (props) => {
  const [moreMenu, setMoreMenu] = useState(false)
  const [timerId, setTimerId] = useState(-1)

  const toggle = () => {
    setMoreMenu(!moreMenu)
  }

  const prevRef = useRef(props.status)
  useEffect(() => {
    (async () => {
      if (props.status == "Started" && prevRef.current == null) {
        setTimeout(() => {
          setTime(time + .1)
        }, 100)
        props.startTimer()
        await startTimerAction(props._id)
      }

      prevRef.current = props.status

    })()
  }, [props.status])

  // const toggleTimer = async () => {
  //   if (status == "Pending") {
  //     setStatus("Started")
  //     setTimeout(() => {
  //       setTime(time + .1)
  //     }, 100)
  //     props.startTimer()
  //     await startTimerAction(props._id)
  //   } else if (status == "Started") {
  //     setStatus("Pending")
  //     clearInterval(currentTimerId)
  //     props.stopTimer()
  //     await stopTimerAction(props._id)
  //   }
  // }

  const calculateInitialTime = () => {
    const _times = props.status=="Pending" ? props.latest : props.times
    return _times.reduce((total, t) => {
      if (t.endTime) {
        total += ((new Date(t.endTime).getTime() - new Date(t.startTime).getTime()) / 1000)
      } else {
        total += ((new Date().getTime() - new Date(t.startTime).getTime()) / 1000)
      }
      return total
    }, 0)
  }

  useEffect(() => {
    setTime(calculateInitialTime())
  }, [props.status])

  const [time, setTime] = useState(calculateInitialTime())

  useEffect(() => {
    if (props.status != "Started" || time == -1) return

    const timerId = setInterval(() => {
      setTime(time + .1);
    }, 100)
    setTimerId(timerId)

    return (() => { clearInterval(timerId) })
  }, [time])

  const editTimer = () => {
    props.editTimer(props.idx)
  }
  
  const productTime = Math.round(props.totalTime / 3600) || 1

  return <div className="col-lg-4 col-md-6 p-2">
    <div className="product p-2">
      <div className="product-header">
        <select className="form-select">
          <option>{ props.part && props.part.name }</option>
        </select>
        <Dropdown isOpen={moreMenu} toggle={toggle}>
          <DropdownToggle caret>
            <span className="mdi mdi-dots-horizontal"></span>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Remove</DropdownItem>
            <DropdownItem onClick={editTimer}>Edit</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="product-preview">
        <img src={ props.machine && props.machine.preview } className="w-100 h-100" />
      </div>
      <div className="product-info">
        <div className="product-name w-100">
          <span>{ props.machine && props.machine.name }</span>
          <span>
            <div className={`time ${time <= props.productionTime ? 'text-success' : 'text-danger'}`}>{formatSeconds(time)}</div>
          </span>
        </div>

        <div className="product-details">
          <div className="product-detail">
            <span>Daily Units</span>
            <span>{props.dailyUnit}</span>
          </div>
          
          <div className="product-detail">
            <span>Daily Tons</span>
            <span>{props.dailyTon}</span>
          </div>

          <div className="product-detail">
            <span>Average Ton/hr</span>
            <span>{props.dailyTon / productTime}</span>
          </div>

          <div className="product-detail">
            <span>Average Unit/hr</span>
            <span>{props.dailyUnit / productTime}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default Timer