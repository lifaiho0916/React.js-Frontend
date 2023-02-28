import { useState } from "react";
import { useEffect } from "react";
import Select from "react-select"

const AutoCompleteSelect = (props) => {

  const optionsGroup = [
    {
      label: "Parts",
      options: props.options.map(v => {
        return ({
        label: v.name || v.machine.name,
        value: v._id
      })})
    }
  ]
  const [option, setOption] = useState(props.option);

  useEffect(() => {
    if ('option' in props) {
      if(props.option)
        setOption({ label: props.option.label, value: props.option.value })
    }
  }, [props])
  return (
    <>
      <Select
        onChange={(e) => {
          setOption(e)
          if (props.onChange)
            props.onChange(e.value)
        }}
        value={option ? option : { label: props.placeholder, value: '' }}
        options={optionsGroup}
        placeholder={props.placeholder || ""}
        classNamePrefix="select2-selection w-100"
      />
      <input type="hidden" name="part" value={option ? option.value : ''} />
    </>
  )
}

export default AutoCompleteSelect