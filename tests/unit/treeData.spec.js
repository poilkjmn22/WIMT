/*
 * @Author: fangqi
 * @Date: 2021-08-27 17:28:13
 * @LastEditors: fangqi
 * @LastEditTime: 2021-08-27 17:28:22
 * @Description: utils单元测试-treeData
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import { findIndex } from '@/utils/treeData.js'

describe('utils:treeData', () => {
  it('findIndex', () => {
    const testData = [
      { value: '0', child: [{ value: '00' }, { value: '01', child: [{ value: '010' }, { value: '011' }] }] },
      { value: '1', child: [{ value: '10' }, { value: '11' }] }
    ]
    expect(findIndex(testData, d => d.value === '010')).toBe(3)
    expect(findIndex(testData, d => d.value === '1')).toBe(5)
    expect(findIndex(testData, d => d.value === 'a')).toBe(-1)

    expect(() => findIndex(null, d => d.value === 'a')).toThrow('参数类型不正确（treeData应为数组）')
    expect(() => findIndex([])).toThrow(/参数类型不正确/)
  })
})
