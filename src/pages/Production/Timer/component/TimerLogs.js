import { getProducts, getTimerLogsOfMachine, searchMacheinsAction } from 'actions/timer';
import { MachineClassSelect } from 'components/Common/Select';
import { machineClasses } from 'helpers/globals';
import React, { useEffect, useState } from 'react';

import { formatSeconds } from "../../../../helpers/functions"

const TimerLogs = (props) => {

  const { compare, city, filteredParts } = props
  const [resultCount, setResultCount] = useState(0)
  const [part, setPart] = useState({})
  const [trackTimers, setTrackTimers] = useState([])
  const [machines, setMachines] = useState([])
  const [colors, setColors] = useState([])
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState(0)
  const [logs, setLogs] = useState([])
  const [totalTons, setTotalTons] = useState(0)
  const [totalLoss, setTotalLoss] = useState(0)
  const [totalGain, setTotalGain] = useState(0)
  const [filters, setFilters] = useState({
    machineClass: machineClasses[0],
    productClass: "",
    includeOperator: true,
    from: null,
    to: null
  })
  const [parts, setParts] = useState([])

  const searchMachines = async () => {
    const idx = filteredParts.findIndex(p => p._id == filters.productClass)
    setPart(filteredParts[idx])
    const _machines = await searchMacheinsAction(filters.machineClass,
      filters.productClass, filters.from, filters.to)
    setMachines(_machines)
    setColors(_machines.map(m => `rgb(${parseInt(Math.random() * 256)},
      ${parseInt(Math.random() * 256)}, ${parseInt(Math.random() * 256)})`))
    getTimers(_machines.length && _machines[0]._id)
  }

  const updateFilter = (f, e) => {
    if (f == "machineClass")
      setFilters({
        ...filters,
        [f]: e.target ? e.target.value : e,
        productClass: ""
      })
    else
      setFilters({
        ...filters,
        [f]: e.target ? e.target.value : e
      })
  }
  const setActiveTab = async (index) => {
    setTab(index)
    getTimers(machines[index]._id)
  }

  const getTimers = async (id) => {
    if (!id) return
    const res = await getTimerLogsOfMachine(id, filters.productClass, filters.from, filters.to, page)
    setLogs(res.logs)
    setResultCount(res.total)
    setTotalTons(res.totalTons)
    setTotalGain(res.totalGain)
    setTotalLoss(res.totalLoss)
  }

  useEffect(() => {
    if (props.refreshLogs && machines[tab]) {
      getTimers(machines[tab]._id)
      props.afterRefresh()
    }
  }, [props.refreshLogs ])

  useEffect(() => {
    if (machines[tab])
      getTimers(machines[tab]._id)
  }, [page])

  const updateProducts = async () => {
    const res = await getProducts("Part", -1, { city, machineClass: filters.machineClass })
    setParts(res.products)
  }
  useEffect(() => {
    updateProducts()
  }, [city, filters.machineClass])

  useEffect(() => {
    const _machines = props.timers.map(timer => timer.machine)
    setMachines(_machines)
    setColors(_machines.map(m => `rgb(${parseInt(Math.random() * 256)},
      ${parseInt(Math.random() * 256)}, ${parseInt(Math.random() * 256)})`))
    getTimers(_machines.length && _machines[0]._id)
  }, [props.timers])

  return <React.Fragment>
    {/* <div className="row m-0 mt-5">
      <div className="search-container mx-0">
        <div className="flex-1">
          <div className="row m-0 mt-2">
            <div className="col-xl-3">
              <h5>MACHINE TYPE</h5>
            </div>
            <div className="col-xl-3">
              <h5>PRODUCT TYPE</h5>
            </div>
            <div className="col-xl-2">
              <h5>
                <div>INCLUDE</div>
                <div>OPERATOR</div>
              </h5>
            </div>
            <div className="col-xl-4">
              <h5>REVIEW RANGE</h5>
            </div>
          </div>

          <div className="m-0 search-box row mb-3">
            <div className="col-xl-3">
              <MachineClassSelect name="log-filter" onChange={(e) => updateFilter("machineClass", e)} />
            </div>

            <div className="col-xl-3">
              <select
                className="form-select"
                onChange={(e) => {
                  updateFilter("productClass", e)
                }}
                value={filters.productClass}
              >
                <option value="" disabled />
                {
                  parts.map(part => (
                    <option value={part._id} key={"log-filter-" + part._id}>{part.name}</option>
                  ))
                }
              </select>
            </div>

            <div className="col-xl-2 d-flex align-items-center">
              <div className='d-flex align-items-stretch'>
                <input type="checkbox" className="form-checkbox" onChange={(e) => updateFilter("includeOperator", e)} />
                <h6 className='ms-2 my-auto'>Yes</h6>
              </div>
            </div>

            <div className="col-xl-4   d-flex">
              <input type="date" className="form-control me-2" onChange={(e) => updateFilter("from", e)} />
              <input type="date" className="form-control" onChange={(e) => updateFilter("to", e)} />
            </div>
          </div>
        </div>

        <div className="search-action">
          <span className="mdi mdi-refresh cursor-pointer" onClick={() => searchMachines()}></span>
        </div>
      </div>
    </div> */}
    <h2 className='mb-3'>TIMER TRACKER - {props.classify} </h2>
    <div className='bg-white time-tracker-table-container'>

      <div className='time-tracker-table-header d-flex' >
        <div className='flex-1 d-flex'>
          {
            colors.map((color, index) => (
              <div
                className={`time-tracker-tab ongoing-job-tab cursor-pointer ${tab === index ? 'active' : ''}`}
                style={{ borderTop: `5px solid ${color}` }}
                onClick={() => setActiveTab(index)}
                key={"tab" + index}
              >
                <div>
                  <h4 className="mb-0">{machines[index] && machines[index].name}</h4>
                  <h6 className="text-secondary">{machines[index] && machines[index].city}</h6>
                </div>
              </div>
            ))
          }
        </div>

        <div className='d-flex align-items-center mx-3 ' >
          <div className='position-relative'>
            <input className='form-control bg-light ps-5' placeholder='Search...' onChange={(e) => setQuery(e.target.value)} />
            <i className="bi bi-search position-absolute"></i>
          </div>
        </div>
        <div className='d-flex align-items-center me-5 py-1 count-show' >
          <span className="me-2">Show</span>
          <input className="p-2 bg-light form-control" style={{ width: 32 }} />
        </div>
      </div>

      <div className="time-tracker-table">
        <table className='w-100 table table-nowrap mb-0' id='jobstable'>
          <thead className=''>
            <tr>
              <th style={{ paddingLeft: '16px', width: 88 }} onClick={() => sortTable('name', jobs)} >
                CYCLE
              </th>
              <th>DATE</th>
              <th className=''>PART/PRODUCT</th>

              <th>OPERATOR</th>
              <th>ID</th>
              <th style={{ width: '90px' }}>STATUS</th>
              <th style={{ width: '120px' }}>TIME</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((trackTimer, index) => (
              <tr key={index}>
                <td style={{ paddingLeft: '24px' }}>
                  <div className='d-flex align-items-center'>
                    <b className='name'>{resultCount - (page - 1) * 8 - index}</b>

                  </div>
                </td>
                <td className=''>
                  <div>
                    <div><b className='name'>{trackTimer.times[0].startTime.substring(0, 10)}</b></div>
                    <div className="text-secondary">{trackTimer.times[0].startTime.substring(11, 19)}</div>
                  </div>
                </td>
                <td>
                  <div className='name' style={{ width: '288px' }}>
                    <b>{trackTimer.timer.part.name}</b>
                  </div>
                </td>
                <td className='name'>
                  <div><b>{trackTimer.operator}</b></div>
                </td>
                <td></td>
                <td>
                  <div>
                    <b className={`${trackTimer.time > trackTimer.productionTime ? 'text-danger' : 'text-success'}`}>
                      {trackTimer.time > trackTimer.productionTime ? 'LOSS' : 'GAIN'}
                    </b>
                  </div>
                </td>
                <td >
                  <div><b className={`${trackTimer.time > trackTimer.productionTime ? 'text-danger' : 'text-success'}`}>{formatSeconds(trackTimer.time)}</b></div>
                </td>
                <td className='position-relative'>
                  <b className='position-absolute three-dot-icon-end'>
                    <i className='mdi mdi-dots-vertical cursor-pointer' data-bs-toggle="dropdown" aria-expanded="false" id={"expEdit" + index}></i>
                    <div className='dropdown-menu dropdown-menu-end' aria-labelledby={"expEdit" + index} >
                      <div className='dropdown-item p-4 py-2 cursor-pointer'>
                        Stop
                      </div>
                      <div className='dropdown-item p-4 py-2 cursor-pointer'>
                        Start
                      </div>
                    </div>
                  </b>
                </td>
              </tr>
            )
            )
            }

          </tbody>
        </table>
      </div>
      <div className='border-0 pagination py-2 d-flex align-items-center' style={{ borderRadius: '10px' }}>
        <div className='pe-0 cursor-pointer' style={{ paddingLeft: '24px' }}>
          <div className='d-flex align-items-center border-end pe-2'

            onClick={() => {
              if (page > 1) {
                setPage(page - 1)
              }
            }
            }
          >
            <span className='mdi mdi-chevron-left'></span>
            <span>PREV</span>
          </div>
        </div>

        <div className='px-0 cursor-pointer'>
          <div className='d-flex align-items-center border-end px-2 position-relative'>
            {page}
            <i className='mdi mdi-menu-down' data-bs-toggle="dropdown" aria-expanded="false" id="setpage" ></i>
            <span> of {Math.round(resultCount / 8)}</span>
            <div className='dropdown-menu dropdown-menu-end border-0 p-0' aria-labelledby="setpage">
              <input className='form-control' type='number'
                onChange={(e) => {
                  if (e.target.value > 0)
                    setPage(e.target.value)
                }}
                style={{ width: '64px' }} />
            </div>
          </div>
        </div>

        <div className='px-2 cursor-pointer'>
          <div className='d-flex align-items-center' onClick={() => setPage(page + 1)}>
            <span>NEXT</span>
            <span className='mdi mdi-chevron-right'></span>
          </div>
        </div>

        <div className="flex-1 ms-3 d-flex align-items-center total-analytics">
          <div className="d-flex" style={{ marginRight: 'auto' }}>
            <div className='d-inline-flex flex-column'>
              <div className='text-end'><b>{machines[tab] && machines[tab].name} TOTAL UNITS:</b></div>
              <div className='text-end'><b>{machines[tab] && machines[tab].name} TOTAL TONS:</b></div>
            </div>
            <div className='d-inline-flex flex-column ms-3'>
              <div className='text-end'><b>{resultCount}</b></div>
              <div className='text-end'><b>{totalTons}</b></div>
            </div>
          </div>
          <div className='divide-vertical'>

          </div>
          <div className="me-4  ps-2">
            <div className='d-inline-flex flex-column'>
              <div className='text-end '><b>TOTAL GAIN:</b></div>
              <div className='text-end '><b>TOTAL LOSS:</b></div>
              <div className='text-end '><b>TOTAL FLOAT:</b></div>
            </div>
            <div className='d-inline-flex flex-column ms-3'>
              <div className='text-end text-success'><b>{formatSeconds(totalGain)}</b></div>
              <div className='text-end text-danger'><b>{formatSeconds(totalLoss)}</b></div>
              <div className='text-end text-warning'><b>{formatSeconds(totalGain - totalLoss)}</b></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
}

export default TimerLogs