const { ux } = require('@cto.ai/sdk')
const { COLORS } = require('../constants')

const coloredTreeString = () => {
  const treeString = 'Colored Tree'.split('')
  const coloredArr = treeString.map(string => {
    const color = randomColor()
    return color(string)
  })
  return coloredArr.join('')
}

const randomColor = () => {
  const color = COLORS[(COLORS.length * Math.random()) << 0]
  return ux.colors[color]
}

const getColor = color => {
  return ux.colors[color](color)
}

module.exports = {
  coloredTreeString,
  randomColor,
  getColor,
}
