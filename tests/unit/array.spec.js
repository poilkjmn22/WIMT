/*
 * @Author: fangqi
 * @Date: 2021-11-16 10:11:52
 * @LastEditors: fangqi
 * @LastEditTime: 2021-11-16 10:11:52
 * @Description: test:unit>utils/array.js
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserve
 */
import { insertAfter, moveAfter } from '@/utils/array.js'

describe('utils:array', () => {
  it('insertAfter', () => {
    expect(insertAfter([1, 2, 4], 1, 3)).toEqual([1, 2, 3, 4])
    expect(insertAfter([1, 2, 4], -1, 3)).toEqual([1, 2, 4])
  })

  it('moveAfter', () => {
    expect(moveAfter([1, 2, 3, 4, 5, 6], 2, 5)).toEqual([1, 2, 3, 6, 4, 5])
    expect(moveAfter([1, 2, 3, 4, 5, 6], 4, 1)).toEqual([1, 3, 4, 5, 2, 6])
    expect(moveAfter([1, 2, 3, 4, 5, 6], 3, 3)).toEqual([1, 2, 3, 4, 5, 6])
    expect(moveAfter([1, 2, 3, 4, 5, 6], 5, 0)).toEqual([2, 3, 4, 5, 6, 1])
    expect(moveAfter([1, 2, 3, 4, 5, 6], 5, -1)).toEqual([1, 2, 3, 4, 5, 6])
    expect(moveAfter([1, 2, 3, 4, 5, 6], 10, 1)).toEqual([1, 3, 4, 5, 6, 2])

    expect(() => moveAfter([1, 2, 3, 4, 5, 6], 10, {})).toThrow(/参数类型不正确/)
  })
})
