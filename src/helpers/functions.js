export const formatSeconds = val => {
  let values = []
  while(val) {
    values.push(val % 60)
    val = (val - val % 60) / 60
  }

  while(values.length < 3) {
    values.push(0)
  }

  values.reverse()
  return values.reduce((p, c, index) => {
    if (!index) return formatTimeValue(c)
    return p + ":" + formatTimeValue(c)
  }, "")
}

export const formatTimeValue = val => {
  return val >= 10 ? val : '0'+val
}

export const extractFormData = form => {
  let data = {}
  for (const pair of form) {
    data = {
      ...data,
      [[pair[0]]]: pair[1]
    }
  }
  return data
}