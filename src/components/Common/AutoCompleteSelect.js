import Select from "react-select"

const AutoCompleteSelect = (props) => {

  const optionsGroup = [
    {
      label: "Parts",
      options: props.options.map(v => ({
        label: v.name||v.machine.name,
        value: v._id
      }))
    }
  ]

  return <Select
    onChange={(e, v) => {
      props.onChange(e.value)
    }}
    options={optionsGroup}
    placeholder={props.placeholder || ""}
    classNamePrefix="select2-selection w-100"
  />
}

export default AutoCompleteSelect