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
    props.editMachine(props.idx)
  }

  const toggle = () => {
    setMoreMenu(!moreMenu)
  }
  const user = JSON.parse(localStorage.getItem("authUser"))

  return <div className="col-xl-4 col-lg-4 col-md-6 p-2 d-flex align-items-stretch">
    <div className="product">
      <div className="product-header justify-content-end">
        {user.role == 'Personnel' || user.role == 'Accounting' ? "" :
          <Dropdown isOpen={moreMenu} toggle={toggle}>
            <DropdownToggle caret>
              <span className="mdi mdi-dots-horizontal text-black-50" ></span>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={removeMachine}>Remove</DropdownItem>
              <DropdownItem onClick={editMachine}>Edit</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        }
      </div>
      <div className="product-preview">
        <img src={props.preview} className="w-100 h-100" />
      </div>
      <div className="product-info">
        <div className="product-name w-100">
          <span>{props.name}</span>
          <span className="text-uppercase text-success" style={{ color: "rgb(77 191 91) !important" }}>{props.city}</span>
        </div>

        <div className="product-details text-center mt-3">
          <h5>{props.details}</h5>
        </div>
      </div>
    </div>
  </div>
}

export default Machine