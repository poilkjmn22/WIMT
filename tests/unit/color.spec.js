/*
 * @Author: fangqi
 * @Date: 2021-10-08 11:49:32
 * @LastEditors: fangqi
 * @LastEditTime: 2021-10-08 11:49:41
 * @Description: utils单元测试:util/color.js
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import { hexToRgb } from '@/utils/color.js'

describe('unit:util/color', () => {
  it('hexToRgb', () => {
    expect(hexToRgb('#12C486', 0.3)).toBe('rgba(18, 196, 134, 0.3)')
    expect(hexToRgb('#F54E57', 0.3)).toBe('rgba(245, 78, 87, 0.3)')
    expect(hexToRgb('#E8C63D', 0.3)).toBe('rgba(232, 198, 61, 0.3)')
    expect(hexToRgb('#fff', 0.3)).toBe('rgba(255, 255, 255, 0.3)')
  })
})
