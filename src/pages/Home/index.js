import React from 'react'
import MetaTags from 'react-meta-tags';

import SignIn from './components/SignIn';
import Slider from './components/Slider';

const Home = (props) => {
  return <React.Fragment>
    <div className="row m-0 p-0 h-100">
      <MetaTags>
        <title>Welcome To AmeriTex</title>
      </MetaTags>
      <div className="col-xl-3 p-0">
        <SignIn />
      </div>
      <div className="col-xl-9 p-0">
        <Slider />
      </div>
    </div>
  </React.Fragment>
}

export default Home