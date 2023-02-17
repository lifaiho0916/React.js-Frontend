import Select from "react-select"

const AutoCompleteSelect = (props) => {

  const optionsGroup = [
    {
      label: "Parts",
      options: props.options.map(v => ({
        label: v.name,
        value: v._id
      }))
    }
  ]

  return <Select
    onChange={(e, v) => {
      props.onChange(e.value)
    }}
    options={optionsGroup}
    classNamePrefix="select2-selection"
  />
}

export default AutoCompleteSelect