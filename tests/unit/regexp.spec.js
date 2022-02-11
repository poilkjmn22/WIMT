/*
 * @Author: zhangchuanzhong
 * @Date: 2021-04-08 15:57:34
 * @LastEditors: fangqi
 * @LastEditTime: 2022-02-11 09:59:41
 * @Description: 正则单元测试
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import { NORMAL_NAME, NORMAL_NAME_U, NUM_1_4094, IP } from '@/utils/regexp'

describe('utils:regexp', () => {
  it('NORMAL_NAME', () => {
    expect(NORMAL_NAME.test('测试')).toBe(true)
    expect(NORMAL_NAME.test('abc')).toBe(true)
    expect(NORMAL_NAME.test('123')).toBe(true)
    expect(NORMAL_NAME.test('123测试')).toBe(true)
    expect(NORMAL_NAME.test('abc测试')).toBe(true)
    expect(NORMAL_NAME.test('123测试abc')).toBe(true)
    expect(NORMAL_NAME.test('')).toBe(false)
    expect(NORMAL_NAME.test('测试!')).toBe(false)
    expect(NORMAL_NAME.test('#$!')).toBe(false)
    expect(NORMAL_NAME.test('超过三十超过三十超过三十超过三十超过三十超过三十超过三十超过三十')).toBe(true)
  })

  it('NORMAL_NAME_U', () => {
    expect(NORMAL_NAME_U.test('测试')).toBe(true)
    expect(NORMAL_NAME_U.test('abc')).toBe(true)
    expect(NORMAL_NAME_U.test('123')).toBe(true)
    expect(NORMAL_NAME_U.test('123测试')).toBe(true)
    expect(NORMAL_NAME_U.test('abc测试')).toBe(true)
    expect(NORMAL_NAME_U.test('123测试abc')).toBe(true)
    expect(NORMAL_NAME_U.test('测试_')).toBe(true)
    expect(NORMAL_NAME_U.test('')).toBe(false)
    expect(NORMAL_NAME_U.test('测试!')).toBe(false)
    expect(NORMAL_NAME_U.test('#$!')).toBe(false)
    expect(NORMAL_NAME_U.test('超过三十超过三十超过三十超过三十超过三十超过三十超过三十超过三十')).toBe(true)
  })

  it('NUM_1_4094', () => {
    expect(NUM_1_4094.test('测试')).toBe(false)
    expect(NUM_1_4094.test(1)).toBe(true)
    expect(NUM_1_4094.test(4094)).toBe(true)
    expect(NUM_1_4094.test(4095)).toBe(false)
    expect(NUM_1_4094.test(999)).toBe(true)
    expect(NUM_1_4094.test(4000)).toBe(true)
    expect(NUM_1_4094.test(2000)).toBe(true)
  })

  it('IP', () => {
    expect(IP.test('测试')).toBe(false)
    expect(IP.test('188.12.123.12')).toBe(true)
    expect(IP.test('we.23.34.1')).toBe(false)
    expect(IP.test('.23.34.1')).toBe(false)
    expect(IP.test('1.2389.34.1')).toBe(false)
    expect(IP.test('1.23.34.1000')).toBe(false)
    expect(IP.test('1.89.34')).toBe(false)
  })
})
