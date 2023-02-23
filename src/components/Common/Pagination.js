import React from "react"

const Pagination = (props) => {

  const { page, movePage, totalPage } = props

  const goToPrevPage = () => {
    if (page > 1)
      movePage(page - 1)
  }

  const goToNextPage = () => {
    movePage(page + 1)
  }

  return <React.Fragment>
    <div className='pe-0 cursor-pointer' style={{ paddingLeft: '24px' }}>
      <div className='d-flex align-items-center border-end pe-2'
        onClick={goToPrevPage}
      >
        <span className='mdi mdi-chevron-left'></span>
        <span>PREV</span>
      </div>
    </div>

    <div className='px-0 cursor-pointer'>
      <div className='d-flex align-items-center border-end px-2 position-relative'>
        {page}
        <i className='mdi mdi-menu-down' data-bs-toggle="dropdown" aria-expanded="false" id="setpage" ></i>
        <span> of {totalPage}</span>
        <div className='dropdown-menu dropdown-menu-end border-0 p-0' aria-labelledby="setpage" style={{minWidth: 64}}>
          <input className='form-control' type='number'
            onChange={(e) => {
              if (e.target.value > 0)
                movePage(e.target.value)
            }}
            style={{ width: 64 }} />
        </div>
      </div>
    </div>

    <div className='px-2 cursor-pointer'>
      <div className='d-flex align-items-center' onClick={goToNextPage}>
        <span>NEXT</span>
        <span className='mdi mdi-chevron-right'></span>
      </div>
    </div>
  </React.Fragment>
}

export default Pagination