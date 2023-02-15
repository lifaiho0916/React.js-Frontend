export const formatSeconds = val => {
  const values = []
  while(val) {
    values.push(val % 60)
    val = (val - val % 60) / 60
  }
  values.reverse()
  return values.reduce((p, c, index) => {
    if (!index) return formatTimeValue(c)
    return p + ":" + formatTimeValue(c)
  }, "")
}

export const formatTimeValue = val => {
  return val > 10 ? val : '0'+val
}