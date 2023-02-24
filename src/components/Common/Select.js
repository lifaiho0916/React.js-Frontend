import { cities, factories, machineClasses } from "helpers/globals"

export const CitySelect = props => {
  return <select className="form-select" {...props} name="city" onChange={e => props.onChange(e)}>
    <option value="" disabled>{props.placeholder}</option>
    {
      cities.map(city => <option className="text-uppercase" key={"city-"+city} value={city}>{city}</option>)
    }
  </select>
}

export const FactoryList = props => {
  return <select  {...props} className={"form-select "+ props.className} name="factory" onChange={(e) => props.onChange(e)}>
    <option value="" disabled>{props.placeholder}</option>
    {
      factories.map(factory => <option key={"factory-"+factory} value={factory}>{factory}</option>)
    }
  </select>
}

export const MachineClassSelect = props => {
  return <select {...props} className={"form-select "+ props.className} name="machineClass" onChange={(e) => props.onChange(e)}>
    <option value="" disabled>{props.placeholder}</option>
    {
      machineClasses.map(mClass => <option className="text-uppercase" key={"m-class-"+props.name+"-"+mClass} value={mClass}>{mClass}</option>)
    }
  </select>
}