/*
 * @Author: fangqi
 * @Date: 2021-09-28 15:50:17
 * @LastEditors: fangqi
 * @LastEditTime: 2021-12-29 21:41:27
 * @Description: 颜色工具函数
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import { COLOR_HEX } from '@/utils/regexp.js'
function alphaHex(color, alpha) {
  if (!COLOR_HEX.test(color)) {
    return color
  }
  let colorChange = '#'
  const colorParts = []
  if (color.length === 4) {
    for (let i = 1; i < 4; i += 1) {
      colorChange += `${color[i]}${color[i]}`
    }
  } else {
    colorChange = color
  }
  const valpha = Math.min(1, alpha)
  for (var i = 1; i < 7; i += 2) {
    const part = parseInt(`0x${colorChange.substring(i, i + 2)}`)
    colorParts.push(Math.floor(valpha * part + (1 - valpha) * 255))
  }
  return `#${colorParts.map(c => c.toString(16)).join('')}`
}

function hexToRgb(color, alpha = 1) {
  if (!COLOR_HEX.test(color)) {
    return color
  }
  let colorChange = '#'
  const colorParts = []
  if (color.length === 4) {
    for (let i = 1; i < 4; i += 1) {
      colorChange += `${color[i]}${color[i]}`
    }
  } else {
    colorChange = color
  }
  for (var i = 1; i < 7; i += 2) {
    const part = parseInt(`0x${colorChange.substring(i, i + 2)}`)
    colorParts.push(part)
  }
  return `rgba(${colorParts.join(', ')}, ${alpha})`
}

export { alphaHex, hexToRgb }
