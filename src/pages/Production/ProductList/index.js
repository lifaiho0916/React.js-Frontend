import { CitySelect, FactoryList, MachineClassSelect } from "components/Common/Select"
import { cities, factories } from "helpers/globals"
import { useState } from "react"
import MetaTags from "react-meta-tags"
import {
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  Card,
} from "reactstrap"
import Dropzone from "react-dropzone"
import Machine from "../components/Machine"
import Part from "../components/Part"
import { Link } from "react-router-dom"
import "./style.scss"
import {
  createMachineAction,
  createPartAction,
  editProductAction,
  getProducts,
} from "actions/timer"
import { useEffect } from "react"
import Pagination from "components/Common/Pagination"

const ProductList = props => {
  const [city, setCity] = useState("Seguin")
  const [machineModal, setMachineModal] = useState(false)
  const [editIndex, setEditIndex] = useState(-1)
  const [type, setType] = useState("Part")
  const types = ["Part", "Machine"]
  const [selectedFiles, setselectedFiles] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPage: 1
  })

  const moveToPage = (_page) => {
    setPagination({
      ...pagination,
      page: _page
    })
  }

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setselectedFiles(files)
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  const [partsModal, setPartsModal] = useState(false)

  const showCreateModal = () => {
    setEdit(false)
    setNewPart({
      city: "",
      factory: "",
      machineClass: "",
      name: "",
      pounds: '',
      avgTime: '',
      finishGoodWeight: '',
      cageWeightScrap: '',
      cageWeightActuals: ''
    })
    setNewMachine({
      city: "",
      factory: "",
      machineClass: "",
      name: "",
      details: "",
    })
    if (type == "Part") setPartsModal(true)
    else setMachineModal(true)
  }

  const toggleModal = () => {
    setMachineModal(!machineModal)
  }

  const togglePartsModal = () => {
    setPartsModal(!partsModal)
  }

  const createPart = async () => {
    const form = new FormData(document.getElementById("part-form"))
    if (edit)
      form.append("id", parts[editIndex]._id)
    const { part } = await createPartAction(form)
    togglePartsModal()
    updateProducts()
  }

  const createMachine = async () => {
    const form = new FormData(document.getElementById("machine-form"))
    if (edit)
      form.append("id", machines[editIndex]._id)
    const { machine } = await createMachineAction(form)
    toggleModal()
    updateProducts()
  }

  const deleteProduct = async (type, id) => {
    if (type == "Machine") {
      setMachines(machines.filter(m => m._id != id))
    } else {
      setParts(parts.filter(p => p._id != id))
    }
  }

  const editMachine = async idx => {
    setEdit(true)
    setEditIndex(idx)
    let _machine
    Object.entries(newMachine).forEach(v => {
      console.log(v[0], machines[idx][v[0]])
      _machine = { ..._machine, [v[0]]: machines[idx][v[0]] }
    })
    setNewMachine(_machine)
    setMachineModal(true)
  }

  const editPart = async (idx) => {
    setEditIndex(idx)
    setEdit(true)
    let _part
    Object.entries(newPart).forEach(v => _part = { ..._part, [v[0]]: parts[idx][v[0]] })
    setNewPart(_part)
    setPartsModal(true)
  }

  const [edit, setEdit] = useState(false)
  const [machines, setMachines] = useState([])
  const [parts, setParts] = useState([])

  const [newPart, setNewPart] = useState({
    city: "",
    factory: "",
    machineClass: "",
    name: "",
    pounds: '',
    avgTime: '',
    finishGoodWeight: '',
    cageWeightScrap: '',
    cageWeightActuals: ''
  })
  const [availToCreatePart, setAvailToCreatePart] = useState(false)
  const [availToCreateMachine, setAvailToCreateMachine] = useState(false)
  const [newMachine, setNewMachine] = useState({
    city: "",
    factory: "",
    machineClass: "",
    name: "",
    details: "",
  })
  const updateNewPart = (f, e) => {
    const _part = {
      ...newPart,
      [f]: e.target ? e.target.value : e
    }
    setNewPart(_part)
    let enable = true
    Object.entries(_part).map(v => {
      if (!v[1]) enable = false
    })
    setAvailToCreatePart(enable)
  }
  const updateNewMachine = (f, e) => {
    const _machine = {
      ...newMachine,
      [f]: e.target ? e.target.value : e
    }
    setNewMachine(_machine)
    let enable = true
    Object.entries(_machine).map(v => {
      if (!v[1]) enable = false
    })
    setAvailToCreateMachine(enable)
  }

  const updateProducts = async () => {
    const res = await getProducts(type, pagination.page, { city })

    if (type == "Machine") setMachines(res.products)
    else setParts(res.products)

    setPagination({
      ...pagination,
      totalPage: Math.ceil(res.totalCount / 9)
    })
    setTotalCount(res.totalCount)
  }

  useEffect(() => {
    updateProducts()
  }, [type, pagination.page, city])

  const factoryFilters = [...factories, "All"]
  const [factoryFilter, setFactoryFilter] = useState([
    false,
    false,
    false,
    true,
  ])

  const toggleFilter = (e, filter) => {
    let _filter = [...factoryFilter]
    const index = factoryFilters.findIndex(f => f == filter)
    _filter[index] = !_filter[index]

    if (filter == "All" && factoryFilter[index] == false)
      _filter = [false, false, false, true]

    if (filter != "All" && factoryFilter[index] == false) _filter[3] = false
    setFactoryFilter(_filter)
  }

  return (
    <div
      className="page-content"
    // style={{ padding: "86px calc(0.5rem / 2) 60px calc(11.5rem / 2)" }}
    >
      <MetaTags>
        <title>Timer Page</title>
      </MetaTags>
      <Container fluid>
        <div className="timer-page-container mt-5 mx-auto">
          <div className="row p-0 m-0">
            <div className="d-flex justify-content-between timer-page-header page-content-header pb-5">

              <div>
                <h2>Product List</h2>
                <div className='sub-menu text-uppercase'>
                  <span className="parent">Production</span>
                  <span className="mx-1"> &gt; </span>
                  <span className='sub text-danger'>TEXAS</span>
                </div>
              </div>

              <div
                className="d-flex align-items-center"
                style={{ height: "60px" }}
              >
                <div
                  className="d-flex border-left-right px-2 align-self-stretch"
                  style={{ height: "45px", marginTop: "8px" }}
                >
                  <div className="d-flex justify-content-center flex-column align-items-center ms-3">
                    <h3 style={{ marginBottom: "-1px" }}>
                      {totalCount}
                    </h3>
                    <div
                      className="d-flex align-items-center text-uppercase text-black-50"
                      style={{ fontSize: "11px" }}
                    >
                      {type}s
                    </div>
                  </div>
                  <div className="ms-2 me-3 d-flex align-items-end h-100">
                    <span
                      className="mdi mdi-chevron-up"
                      style={{ fontSize: 20, color: "rgb(2, 186, 197)" }}
                    ></span>
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-newtimer ms-3 text-uppercase"
                  onClick={showCreateModal}
                  
                >
                  NEW {type}
                </button>
              </div>
            </div>

            <div
              className="mt-3 px-0"
              style={{
                borderBottom: "2px solid rgba(221, 222, 226, 0.5)",
                paddingBottom: "1rem",
              }}
            >
              <div className="type-selector-container row p-0 m-0">
                {types.map(_type => (
                  <div
                    key={_type}
                    className="type text-uppercase cursor-pointer col-lg-4 col-md-6"
                    style={{ marginLeft: "0px" }}
                    onClick={() => {
                      if (type != _type) {
                        setType(_type)
                        moveToPage(1)
                      }
                    }}
                  >
                    <div
                      className={`type-selector ${_type == type ? "active" : ""
                        }`}
                      style={{
                        padding: '1rem 1.5rem',
                      }}
                    >
                      <span>{_type}</span>
                      <span>
                        <i className="mdi mdi-poll"></i>
                      </span>
                    </div>
                    {/* <div
                      className="mt-1 d-flex justify-content-end"
                      style={{ marginRight: "45px" }}
                    >
                      COMPARE{" "}
                      <input type="checkbox" className="form-checkbox ms-2" />
                    </div> */}
                  </div>
                ))}
              </div>

              <div className="d-flex city-selector-container row p-0 m-0 mt-3">
                {cities.map((_city, index) => (
                  <div
                    key={'city' + index}
                    className="city text-uppercase col-lg-4 col-md-6 "
                  >
                    <div
                      className={`city-selector ${_city == city ? "active" : ""
                        }`}
                      onClick={() => setCity(_city)}
                    >
                      <span className="pt-2">{_city}</span>
                      <span>
                        <i className="mdi mdi-poll"></i>
                      </span>
                    </div>
                    <div
                      className="mt-1 d-flex justify-content-end compare"
                      style={{ marginRight: "20px" }}
                    >
                      <span>COMPARE{" "}</span>
                      <input type="checkbox" className="form-checkbox ms-2" onClick={() => toggleCompare(index)} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="sort-container" style={{borderBottom: 'none'}}>
                <div className="sort-text">
                  SHOW ONLY
                </div>
                <div className="d-flex">
                  {
                    factoryFilters.map((factory, index) => <label key={`factory1-${index}`} className="sort-factory-category mb-0">
                      {factory}
                      <input type="checkbox" className="form-checkbox"
                        onClick={(e) => toggleFilter(e, factory)} id={`factory-filter-${factory}`}
                        onChange={() => { }}
                        checked={factoryFilter[index]} />
                    </label>)
                  }
                </div>
              </div>
            </div>

            <div className="search-container mt-3">
              <div className="search-box row" style={{ padding: "1rem 0 1rem 1.5rem" }}>
                <div className="col-6" >
                  <div>
                    <h5>General Search</h5>
                  </div>
                  <div className="mt-2">
                    <select
                      className="form-select"
                    >
                      <option>RP2225-1</option>
                    </select>
                  </div>
                </div>
                {/* <div className="col-6 d-flex align-items-end">
                    <CitySelect />
                  </div> */}
              </div>
              <div className="search-action">
                <span className="mdi mdi-refresh"></span>
              </div>
            </div>
            {/* </div> */}
          </div>

          {/* <div className="products-container row m-0 p-0 mt-5"> */}
          <div className="d-flex justify-content-end mt-5">
            <Pagination
              {...pagination}
              movePage={moveToPage} />
          </div>
          <div className="row mt-5 p-0">
            {type == "Part"
              ? parts.map((product, idx) => (
                <Part
                  {...product}
                  key={`part-${product._id}`}
                  deleteProduct={deleteProduct}
                  editPart={editPart}
                  idx={idx}
                />
              ))
              : machines.map((product, idx) => (
                <Machine
                  key={`machine-${product._id}`}
                  {...product}
                  deleteProduct={deleteProduct}
                  editMachine={editMachine}
                  idx={idx}
                />
              ))}
          </div>

          <div className="d-flex justify-content-end mt-5">
            <Pagination
              {...pagination}
              movePage={moveToPage} />
          </div>
          {/* </div> */}
        </div>
      </Container>

      <Modal isOpen={partsModal} toggle={togglePartsModal}>
        <ModalHeader toggle={togglePartsModal}>Create A New Part</ModalHeader>
        <ModalBody>
          <form className="p-2" onSubmit={e => createPart(e)} id="part-form">
            <div>
              <CitySelect
                onChange={(e) => updateNewPart("city", e)}
                placeholder="City"
                value={newPart.city}
              />
            </div>

            <div className="mt-3">
              <FactoryList
                onChange={(e) => updateNewPart("factory", e)}
                placeholder="Factory"
                value={newPart.factory}
              />
            </div>

            <div className="mt-3">
              <MachineClassSelect
                onChange={(e) => updateNewPart("machineClass", e)}
                placeholder="Machine Class"
                value={newPart.machineClass || ""} />
            </div>

            <div className="mt-3 d-flex align-items-center">
              <input
                className="form-control"
                type="text"
                placeholder="Part"
                name="name"
                value={newPart.name}
                onChange={(e) => updateNewPart("name", e)}
              />
            </div>

            <div className="mt-3 d-flex align-items-center">
              <input
                className="form-control"
                type="number"
                placeholder="Pounds"
                name="pounds"
                value={newPart.pounds}
                onChange={(e) => updateNewPart("pounds", e)}
              />
            </div>

            <div className="mt-3 d-flex align-items-center mb-3">
              <input
                className="form-control"
                type="number"
                placeholder="Avg Time"
                name="avgTime"
                value={newPart.avgTime}
                onChange={(e) => updateNewPart("avgTime", e)}
              />
            </div>

            <Dropzone
              onDrop={acceptedFiles => {
                handleAcceptedFiles(acceptedFiles)
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone">
                  <div className="dz-message needsclick" {...getRootProps()}>
                    <input {...getInputProps()} name="preview" />
                    <div className="mb-3">
                      <i className="mdi mdi-cloud-upload display-4 text-muted"></i>
                    </div>
                    <h4>Drop files here or click to upload.</h4>
                  </div>
                </div>
              )}
            </Dropzone>

            <div className="dropzone-previews mt-3" id="file-previews">
              {selectedFiles.map((f, i) => {
                return (
                  <Card
                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                    key={i + "-file"}
                  >
                    <div className="p-2">
                      <Row className="align-items-center">
                        <Col className="col-auto">
                          <img
                            data-dz-thumbnail=""
                            height="80"
                            className="avatar-sm rounded bg-light"
                            alt={f.name}
                            src={f.preview}
                          />
                        </Col>
                        <Col>
                          <Link to="#" className="text-muted font-weight-bold">
                            {f.name}
                          </Link>
                          <p className="mb-0">
                            <strong>{f.formattedSize}</strong>
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="mt-3 d-flex align-items-center">
              <input
                className="form-control"
                type="number"
                placeholder="Finish Good Weight (lbs)"
                name="finishGoodWeight"
                onChange={(e) => updateNewPart("finishGoodWeight", e)}
                value={newPart.finishGoodWeight}
              />
            </div>

            <div className="mt-3 d-flex align-items-center">
              <input
                className="form-control"
                type="number"
                placeholder="Cage Weight Scrap (lbs)"
                name="cageWeightScrap"
                onChange={(e) => updateNewPart("cageWeightScrap", e)}
                value={newPart.cageWeightScrap}
              />
            </div>

            <div className="mt-3 d-flex align-items-center">
              <input
                className="form-control"
                type="number"
                placeholder="Case Weight Actuals (lbs)"
                name="cageWeightActuals"
                onChange={(e) => updateNewPart("cageWeightActuals", e)}
                value={newPart.cageWeightActuals}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={createPart} disabled={!availToCreatePart}>
            Save
          </Button>{" "}
          <Button color="secondary" onClick={togglePartsModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={machineModal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Create New Machine</ModalHeader>
        <ModalBody>
          <form
            className="p-2"
            onSubmit={e => createMachine(e)}
            id="machine-form"
          >
            <div>
              <CitySelect
                value={newMachine.city}
                onChange={(e) => updateNewMachine("city", e)}
                placeholder="City" />
            </div>
            <div className="mt-3">
              <FactoryList
                value={newMachine.factory}
                onChange={(e) => updateNewMachine("factory", e)}
                placeholder="Factory" />
            </div>

            <div className="mt-3">
              <MachineClassSelect
                value={newMachine.machineClass}
                onChange={(e) => updateNewMachine("machineClass", e)}
                placeholder="Machine Class" />
            </div>

            <div className="mt-3 d-flex align-items-center">
              <input
                className="form-control"
                type="text"
                placeholder="Machine"
                name="name"
                value={newMachine.name}
                onChange={(e) => updateNewMachine("name", e)}
              />
            </div>

            <div className="my-3 d-flex align-items-center">
              <input
                className="form-control"
                type="text"
                placeholder="Details"
                name="details"
                value={newMachine.details}
                onChange={(e) => updateNewMachine("details", e)}
              />
            </div>

            <Dropzone
              onDrop={acceptedFiles => {
                handleAcceptedFiles(acceptedFiles)
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone">
                  <div className="dz-message needsclick" {...getRootProps()}>
                    <input {...getInputProps()} name="preview" />
                    <div className="mb-3">
                      <i className="mdi mdi-cloud-upload display-4 text-muted"></i>
                    </div>
                    <h4>Drop files here or click to upload.</h4>
                  </div>
                </div>
              )}
            </Dropzone>

            <div className="dropzone-previews mt-3" id="file-previews">
              {selectedFiles.map((f, i) => {
                return (
                  <Card
                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                    key={i + "-file"}
                  >
                    <div className="p-2">
                      <Row className="align-items-center">
                        <Col className="col-auto">
                          <img
                            data-dz-thumbnail=""
                            height="80"
                            className="avatar-sm rounded bg-light"
                            alt={f.name}
                            src={f.preview}
                          />
                        </Col>
                        <Col>
                          <Link to="#" className="text-muted font-weight-bold">
                            {f.name}
                          </Link>
                          <p className="mb-0">
                            <strong>{f.formattedSize}</strong>
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="mt-3 d-flex align-items-center">
              <input
                className="form-control"
                type="number"
                placeholder="Optional"
                name="weight"
                onChange={e => updateMachine("weight", e)}
              />
            </div>

            <div className="mt-3 d-flex align-items-center">
              <input
                className="form-control"
                type="text"
                placeholder="Optional"
                name="productionTime"
                onChange={e => updateMachine("productionTime", e)}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={createMachine} disabled={!availToCreateMachine} >
            Save
          </Button>{" "}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ProductList
