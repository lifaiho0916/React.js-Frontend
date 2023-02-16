import "./style.scss"
import { formatSeconds } from "../../../helpers/functions"
import { useState } from "react"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { deleteProductAction } from "actions/timer";

const Machine = (props) => {

  const [pause, setPause] = useState(false)
  const [moreMenu, setMoreMenu] = useState(false)

  const removeMachine = async () => {
    const res = await deleteProductAction("Machine", props._id)
    props.deleteProduct("Machine", props._id)
  }

  const editMachine = () => {
    props.editMachine()
  }

  const toggle = () => {
    setMoreMenu(!moreMenu)
  }

  return <div className="col-xl-3 col-lg-4 col-md-6 p-2">
    <div className="product p-2">
      <div className="product-header justify-content-end">
        <Dropdown isOpen={moreMenu} toggle={toggle}>
          <DropdownToggle caret>
            <span className="mdi mdi-dots-horizontal"></span>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={removeMachine}>Remove</DropdownItem>
            <DropdownItem onClick={editMachine}>Edit</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="product-preview">
        <img src={ "http://localhost:8000"+props.preview } className="w-100 h-100" />
        <div className="time">{formatSeconds(props.time)}</div>
      </div>
      <div className="product-info">
        <div className="product-name w-100">
          <span>{ props.name }</span>
          <span className="text-success text-uppercase">{ props.city }</span>
        </div>

        <div className="product-details text-center">
          <h5>{ props.details }</h5>
        </div>
      </div>
    </div>
  </div>
}

export default Machine