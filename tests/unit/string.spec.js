/*
 * @Author: fangqi
 * @Date: 2021-11-11 11:59:22
 * @LastEditors: fangqi
 * @LastEditTime: 2021-11-11 11:59:02
 * @Description: utils单元测试:string.js
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import { getLongestContinuousSubstring, hasContinuousSubstring } from '@/utils/string.js'

describe('unit:util/string', () => {
  it('getLongestContinuousSubstring', () => {
    expect(getLongestContinuousSubstring('sghi688qq')).toBe(3)
    expect(getLongestContinuousSubstring('sghi6789qq')).toBe(4)
    expect(getLongestContinuousSubstring('dfertrcba', -1)).toBe(3)
    expect(getLongestContinuousSubstring('DFERTRDCBA', -1)).toBe(4)
    expect(getLongestContinuousSubstring('123DFERTRDCBA', -1)).toBe(4)
    expect(getLongestContinuousSubstring('ab')).toBe(2)
    expect(getLongestContinuousSubstring('abcccc', 0)).toBe(4)
  })

  it('getLongestContinuousSubstring', () => {
    expect(hasContinuousSubstring('123DFERTRDCBA')).toBe(true)
    expect(hasContinuousSubstring('123DFERTRDCBA', -1, 4)).toBe(true)
    expect(hasContinuousSubstring('ab')).toBe(false)
    expect(hasContinuousSubstring('abzzzz', 0)).toBe(true)
  })
})
