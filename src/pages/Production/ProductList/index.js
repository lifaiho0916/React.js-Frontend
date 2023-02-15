import { CitySelect, FactoryList } from 'components/Common/Select';
import { factories } from 'helpers/globals';
import { useState } from 'react';
import MetaTags from 'react-meta-tags';
import {
  Container, Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Card,
} from "reactstrap"
import Dropzone from "react-dropzone"
import Timer from '../components/Timer';
import { Link } from 'react-router-dom';
import "./style.scss"
import { createMachineAction, createPartAction } from 'actions/timer';

const ProductList = (props) => {

  const products = [
    {
      part: '1111',
      name: "RDP-1",
      time: 90,
      dailyUnits: 2,
      dailyTons: 53,
      averageUnit: 2,
      averageTon: 53
    }
  ]
  const [machineModal, setMachineModal] = useState(false)

  const [type, setType] = useState("Parts")
  const types = ["Parts", "Machine"]
  const [selectedFiles, setselectedFiles] = useState([])

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
    if (type == "Parts") setPartsModal(true)
    else setMachineModal(true)
  }

  const toggleModal = () => {
    setMachineModal(!machineModal)
  }

  const togglePartsModal = () => {
    setPartsModal(!partsModal)
  }

  const createPart = () => {
    const form = new FormData(document.getElementById("part-form"))
    createPartAction(form)
  }

  const createMachine = () => {
    console.log(document.getElementById("machine-form"))
    const form = new FormData(document.getElementById("machine-form"))
    createMachineAction(form)
  }

  return <div className="page-content">
    <MetaTags>
      <title>Timer Page</title>
    </MetaTags>
    <Container fluid>
      <div className="timer-page-container mt-5">
        <div className="row p-0 m-0">
          <div className="col-xl-9 p-0">
            <div className="d-flex justify-content-between timer-page-header">
              <div>
                <h1>Timer and Analytics</h1>
                <div>
                  <span className="text-black-50">PRODUCTION</span>
                  <span className="mx-3"> &gt; </span>
                  <span className="text-danger">TEXAS</span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="d-flex flex-column align-items-center border-left-right px-2">
                  <h2>8</h2>
                  <div>Machines </div>
                </div>
                <button className='btn btn-primary ms-3 h-75' onClick={showCreateModal}>NEW MACHINE</button>
              </div>
            </div>

            <div className="mt-3">
              <div className="d-flex type-selector-container">
                {
                  types.map(_type => <div key={_type} className="type text-uppercase cursor-pointer" onClick={() => setType(_type)}>
                    <div className={`type-selector ${_type == type ? 'active' : ''}`}>
                      <span>{_type}</span>
                      <span className="percent">31.3%<span class="mdi mdi-menu-up"></span></span>
                      <span><i class="mdi mdi-poll"></i></span>
                    </div>
                    <div className='mt-1 d-flex justify-content-end'>
                      COMPARE <input type="checkbox" className="form-checkbox ms-2" />
                    </div>
                  </div>)
                }
              </div>
            </div>

            <div className="search-container">
              <div className="search-box row">
                <div>
                  <b>General Search</b>
                </div>
                <div className='mt-2'>
                  <select className='form-select w-50'>
                    <option>RP2225-1</option>
                  </select>
                </div>
              </div>
              <div className="search-action">
                <span class="mdi mdi-refresh"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="products-container row m-0 p-0 mt-5">
          <div className='col-xl-9'>
            {
              products.map(product => <Timer { ...product } />)
            }
          </div>
        </div>
      </div>
    </Container>

    <Modal isOpen={machineModal} toggle={toggleModal} >
      <ModalHeader toggle={toggleModal}>Create A New Part</ModalHeader>
      <ModalBody>
        <form className="p-2" onSubmit={e => createPart(e)}  id="part-form">
          <div><CitySelect /></div>
        
          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="text" placeholder='Part' name="name"/>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="number" placeholder='Pounds' name="pounds"/>
          </div>

          <div className="mt-3 d-flex align-items-center mb-3">
            <input className="form-control" type="number" placeholder='Avg Time' name="avgTime"/>
          </div>

          <Dropzone
            onDrop={acceptedFiles => {
              handleAcceptedFiles(acceptedFiles)
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div className="dropzone">
                <div
                  className="dz-message needsclick"
                  {...getRootProps()}
                >
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
                        <Link
                          to="#"
                          className="text-muted font-weight-bold"
                        >
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
            <input className="form-control" type="number" placeholder='Finish Good Weight (lbs)' name="finishGoodWeight"/>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="number" placeholder='Cage Weight Scrap (lbs)' name="cageWeightScrap"/>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="number" placeholder='Case Weight Actuals (lbs)' name="caseWeightActuals"/>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={createPart}>Create</Button>{' '}
        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={partsModal} toggle={togglePartsModal} >
      <ModalHeader toggle={togglePartsModal}>Create New Machine</ModalHeader>
      <ModalBody>
        <form className="p-2" onSubmit={e => createMachine(e)} id="machine-form">
          <div><CitySelect /></div>
          <div className="mt-3"><FactoryList /></div>
        
          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="text" placeholder='Machine' name="name"/>
          </div>

          <div className="my-3 d-flex align-items-center">
            <input className="form-control" type="text" placeholder='Details' name="details"/>
          </div>

          <Dropzone
            onDrop={acceptedFiles => {
              handleAcceptedFiles(acceptedFiles)
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div className="dropzone">
                <div
                  className="dz-message needsclick"
                  {...getRootProps()}
                >
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
                        <Link
                          to="#"
                          className="text-muted font-weight-bold"
                        >
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
            <input className="form-control" type="number" placeholder='Weight' name="weight"/>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="text" placeholder='Production Time' name="productionTime"/>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={createMachine}>Create</Button>{' '}
        <Button color="secondary" onClick={togglePartsModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
  </div>
}

export default ProductList