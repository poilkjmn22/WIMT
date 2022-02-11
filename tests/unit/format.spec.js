/*
 * @Author: fangqi
 * @Date: 2021-06-29 16:44:18
 * @LastEditors: zhangchuanzhong
 * @LastEditTime: 2021-04-15 15:54:19
 * @Description: utils单元测试:util/format.js
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import { formatBusField, HHmmToDateTime, roundNumberWithUnit } from '@/utils/format.js'

describe('unit:util/format', () => {
  it('formatBusField', () => {
    expect(formatBusField('BOOLEAN', false)).toBe('--')
  })

  it('HHmmToDateTime', () => {
    expect(HHmmToDateTime('20:08')).toBe('2021-11-09 20:08')
    expect(HHmmToDateTime('20:08', 'yyyy.MM.dd HH:mm')).toBe('2021.11.09 20:08')
    expect(HHmmToDateTime('-')).toBe('-')
  })

  it('roundNumberWithUnit', () => {
    expect(roundNumberWithUnit('0.908000000000001GB')).toBe('0.91GB')
    expect(roundNumberWithUnit('Mb')).toBe('Mb')
  })
})

describe('unit:test', () => {
  it('test', () => {
    expect(1 + 1).toBe(2)
  })
})
