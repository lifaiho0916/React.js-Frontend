import { cities } from "helpers/globals"
import { factories } from "helpers/globals"

export const CitySelect = props => {
  return <select className="form-select" {...props} name="city">
    {
      cities.map(city => <option className="text-uppercase" key={"city-"+city} value={city}>{city}</option>)
    }
  </select>
}

export const FactoryList = props => {
  return <select {...props} className={"form-select "+ props.className} name="factory">
    {
      factories.map(factory => <option className="text-uppercase" key={"factory-"+factory} value={factory}>{factory}</option>)
    }
  </select>
}