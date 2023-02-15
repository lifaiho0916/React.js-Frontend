import "./style.scss"
import { formatSeconds } from "../../../helpers/functions"
import { useState } from "react"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const Timer = (props) => {

  const [pause, setPause] = useState(false)
  const [moreMenu, setMoreMenu] = useState(false)

  const toggle = () => {
    setMoreMenu(!moreMenu)
  }

  return <div className="product col-xl-3 col-lg-4 col-md-6 p-3">
    <div className="product-header">
      <select className="form-select">
        { props.part }
      </select>
      <Dropdown isOpen={moreMenu} toggle={toggle}>
        <DropdownToggle caret>
          <span className="mdi mdi-dots-horizontal"></span>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Remove</DropdownItem>
          <DropdownItem>Stop</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div className="product-preview">
      <img src={ props.preview } />
      <div className="time">{formatSeconds(props.time)}</div>
      <button className={`action ${!pause ? 'play': 'stop'}`} onClick={() => setPause(!pause)}>
        <span className={`mdi mdi-${!pause ? 'play' : 'stop'}`}></span>
      </button>
    </div>
    <div className="product-info">
      <div className="product-name w-100">
        <span>{ props.name }</span>
        <span className="text-success">{ formatSeconds(props.time) }</span>
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
}

export default Timer