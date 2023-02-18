import { useEffect, useState } from 'react';
import { cities, factories } from 'helpers/globals';
import MetaTags from 'react-meta-tags';
import {
  Container, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from "reactstrap"
import "./style.scss"
import { FactoryList } from 'components/Common/Select';
import { getProducts } from 'actions/timer';
import AutoCompleteSelect from 'components/Common/AutoCompleteSelect';

const ProductionTracker = (props) => {

  const [jobModal, setJobModal] = useState(false)

  const toggleModal = () => setJobModal(!jobModal)

  const [jobs, setJobs] = useState([{
    name: "ALLORA",
    city: "Conroe",
    user: "Rocky Rorenz",
    facotry: "factory",
    machine: "machine",
    part: "part",
    count: 100,
    dueDate: "",
    option: ""
  }])

  const [machines, setMachines] = useState([])
  const [parts, setParts] = useState([])
  const [timerPart, setTimerPart] = useState("")
  useEffect(() => {
    (async() => {
      const _parts = await getProducts("Part")
      const _machines = await getProducts("Machine")
      setMachines(_machines.products)
      setParts(_parts.products)
    })()
  }, [])

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
                <h1>Production Tracker</h1>
                <div>
                  <span className="text-black-50">PRODUCTION</span>
                  <span className="mx-3"> &gt; </span>
                  <span className="text-danger">TEXAS</span>
                </div>
              </div>
            </div>

            <div className='mt-4 bg-white jobs-table-container'>
              <div className='jobs-table-header d-flex'>
                <div className="jobs-tab bg-white ongoing-job-tab">
                  <div className='number'>3</div>
                  <div>
                    <h4 className="bold">ACTIVE</h4>
                    <h6 className="text-secondary">Ongonig jobs</h6>
                  </div>
                </div>
                <div className="jobs-tab past-job-tab" style={{marginRight: 'auto'}}>
                  <div className='number'>2</div>
                  <div>
                    <h4 className="bold">ARCHIEVED</h4>
                    <h6 className="text-secondary">Past jobs</h6>
                  </div>
                </div>
                <div className='d-flex align-items-center me-3'>
                  <button className='btn btn-danger ms-3 h-50' onClick={toggleModal} >New Job</button>
                </div>
              </div>

              <div className="jobs-table mt-3 p-2">
                <table className='w-100'>
                  <thead>
                    <th>JOBS</th>
                    <th>PART/MACHINE</th>
                    <th>STATUS</th>
                    <th>STATUS</th>
                    <th>DUE</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='job-user'>BN</div>
                          <div className="job-factory">
                            BOX
                          </div>
                          <div className='ms-2'>
                            <b>ALLORA SPRING CYPRESS</b>
                            <div className="text-secondary">Conroe</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <b>10' X 5' X 5.00' C1577 BEND</b>
                        <div className="text-secondary">Machein</div>
                      </td>
                      <td>
                        34 / 60
                      </td>
                      <td>
                        <span className="job-status">QA</span>
                      </td>
                      <td>
                        <b>02 / 22 / 23</b>
                        <div className="text-secondary">7 Days</div>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='job-user'>BN</div>
                          <div className="job-factory bg-precast">
                            Precast
                          </div>
                          <div className='ms-2'>
                            <b>ALLORA SPRING CYPRESS</b>
                            <div className="text-secondary">Conroe</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <b>10' X 5' X 5.00' C1577 BEND</b>
                        <div className="text-secondary">Machein</div>
                      </td>
                      <td>
                        34 / 60
                      </td>
                      <td>
                        <span className="job-status">QA</span>
                      </td>
                      <td>
                        <b>02 / 22 / 23</b>
                        <div className="text-secondary">7 Days</div>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='job-user'>BN</div>
                          <div className="job-factory bg-steel">
                            Steel
                          </div>
                          <div className='ms-2'>
                            <b>ALLORA SPRING CYPRESS</b>
                            <div className="text-secondary">Conroe</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <b>10' X 5' X 5.00' C1577 BEND</b>
                        <div className="text-secondary">Machein</div>
                      </td>
                      <td>
                        34 / 60
                      </td>
                      <td>
                        <span className="job-status">QA</span>
                      </td>
                      <td>
                        <b>02 / 22 / 23</b>
                        <div className="text-secondary">7 Days</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </Container>

    <Modal isOpen={jobModal} toggle={toggleModal} >
      <ModalHeader toggle={toggleModal}>Create A New Job</ModalHeader>
      <ModalBody>
        <form>
          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="text" placeholder='Job Name' name="name"/>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="text" placeholder='City' name="city"/>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="number" placeholder='User' name="user"/>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <FactoryList />
          </div>

          <div className="mt-3 d-flex align-items-center">
            <select className="form-select" name="machine">
              {
                machines.map(m => <option value={m._id} key={"machine-"+m._id} >{m.name}</option>)
              }
            </select>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <div className='w-100'>
              <AutoCompleteSelect options = {parts} onChange={v => setTimerPart(v)} />
            </div>
            <input type="hidden" name="part" value={timerPart} />
          </div>

          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="number" placeholder='Count' name="count"/>
          </div>

          <div className="mt-3 d-flex align-items-center">
            <input className="form-control" type="date" placeholder='Due Date' name="dueDate"/>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggleModal}>Create</Button>{' '}
        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
  </div>
}

export default ProductionTracker