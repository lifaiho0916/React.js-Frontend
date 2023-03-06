import "./style.scss"
import { formatSeconds } from "../../../helpers/functions"
import { useState } from "react"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { endTimerAction, startTimerAction, updateTimerAction } from "actions/timer";
import { useEffect } from "react";
import { useRef } from "react";

import { lbsToTons } from "../../../helpers/functions";
import Editable from "react-bootstrap-editable"

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
    const _times = props.status == "Pending" ? props.latest : props.times
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

  const updateOperatorName = (v) => {
    updateTimerAction(props._id, { operator: v })
  }
  const user = JSON.parse(localStorage.getItem("authUser"))

  return <div className="col-lg-4 col-md-6 d-flex align-items-stretch p-2">
    <div className="product">
      <div className="product-header">
        <select className="form-select">
          <option>{props.part && props.part.name}</option>
        </select>
        {user.role == 'Personnel' || user.role == 'Accounting' ? "" :
          <Dropdown isOpen={moreMenu} toggle={toggle}>
            <DropdownToggle caret>
              <span className="mdi mdi-dots-horizontal text-black-50"></span>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Remove</DropdownItem>
              <DropdownItem onClick={editTimer}>Edit</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        }
      </div>
      <div className="product-preview">
        <img src={props.machine && props.machine.preview} className="w-100 h-100" />
      </div>
      <div className="product-info">
        <div className="product-name w-100">
          <span>{props.machine && props.machine.name}</span>
          <span>
            <div className={`time ${time <= props.productionTime ? 'text-success' : 'text-danger'}`}>{formatSeconds(time)}</div>
          </span>
        </div>

        <div className="production-details">
          <div className="operator-name text-center">
            <Editable
              onSubmit={updateOperatorName}
              alwaysEditing={false}
              disabled={false}
              editText="Operator"
              showText="aaa"
              id={null}
              isValueClickable={false}
              mode="inline"
              placement="top"
              type="textfield"
              initialValue={props.operator}
            />
          </div>
          <div className="product-detail">
            <span>Daily Units</span>
            <span>{props.dailyUnit}</span>
          </div>

          <div className="product-detail">
            <span>Daily Tons</span>
            <span>{lbsToTons(props.dailyTon)}</span>
          </div>

          <div className="product-detail">
            <span>Average Ton/hr</span>
            <span>{lbsToTons(props.dailyTon / productTime)}</span>
          </div>

          <div className="product-detail">
            <span>Average Unit/hr</span>
            <span>{(props.dailyUnit / productTime).toFixed(3)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default Timer