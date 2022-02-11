/*
 * @Author: fangqi
 * @Date: 2022-01-06 14:22:58
 * @LastEditors: fangqi
 * @LastEditTime: 2022-02-10 15:57:04
 * @Description: utils.format
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserve
 */
import { find, isArray, camelCase, isNumber, get, round } from 'lodash-es'
import { DateTime } from 'luxon'
import * as baseConst from '@/const/index.js'
import * as systemConfigConst from '@/const/systemConfig.js'

const busMap = Object.assign({}, baseConst, systemConfigConst)
export function formatBusField(busType, value) {
  const target = busMap[camelCase(busType)]
  if (isArray(target)) {
    const fd = find(target, t => t.value === value)
    return get(fd, 'label') || '--'
  }
  return get(target, value) || '--'
}

// 金额
export function formatMoney(value, len = 2) {
  if (!isNumber(value)) {
    return '--'
  }
  const intValue = parseFloat(value)
  return isNaN(intValue) ? value : intValue.toFixed(len)
}

export const dateFormatType = {
  day: 'yyyy-MM-dd',
  minute: 'yyyy-MM-dd HH:mm',
  minuteDot: 'yyyy.MM.dd HH:mm',
  second: 'yyyy-MM-dd HH:mm:ss',
  ms: 'yyyy-MM-dd HH:mm:ss.SSS'
}

export function HHmmToDateTime(HHmm, format = dateFormatType.minute) {
  const match = HHmm.match(/(\d{2}):(\d{2})/)
  if (!match) {
    return HHmm
  }
  return DateTime.now()
    .set({
      hour: match[1],
      minute: match[2]
    })
    .toFormat(format)
}

export function roundNumberWithUnit(numberWithUnit, precision = 2) {
  const match = numberWithUnit.match(/^(\d+(?:\.\d+)?)(.+)$/)
  if (!match) {
    return numberWithUnit
  }
  const number = parseFloat(match[1])
  const unit = match[2]
  return `${round(number, precision)}${unit}`
}
