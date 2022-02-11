/*
 * @Author: zhangchuanzhong
 * @Date: 2021-03-25 18:30:01
 * @LastEditors: xu jun
 * @LastEditTime: 2021-09-06 17:16:04
 * @Description: utils单元测试
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import { dateFormat, formatDateRange, formatUserMenus, once } from '@/utils/index'

const ymd = 'yyyy-MM-dd'
const dateTime1 = '2021-04-08 13:42:30'
const dateTime2 = '2021-04-09 23:42:30'
describe('utils:index', () => {
  it('dateFormat', () => {
    const d = new Date('2019-09-25 23:01:30') // "2019-09-25 23:01:30"

    expect(dateFormat(d, 'yyyy-MM-dd hh:mm:ss')).toBe('2019-09-25 23:01:30')
    expect(dateFormat(d, ymd)).toBe('2019-09-25')
    expect(dateFormat(d, 'yyyy年MM月dd日 hh:mm:ss')).toBe('2019年09月25日 23:01:30')
  })

  it('formatDateRange', () => {
    const arr = [new Date(dateTime1), new Date(dateTime2)]
    const arr1 = [dateTime1, dateTime2]
    const arr2 = [dateTime1]
    const arr3 = []
    const arr4 = null

    expect(formatDateRange(arr, 'yyyy-MM-dd hh:mm:ss')).toStrictEqual([dateTime1, dateTime2])
    expect(formatDateRange(arr)).toStrictEqual(['2021-04-08 00:00:00', '2021-04-09 23:59:59'])
    expect(formatDateRange(arr1, ymd)).toStrictEqual(['2021-04-08 00:00:00', '2021-04-09 23:59:59'])
    expect(formatDateRange(arr2, ymd)).toStrictEqual([])
    expect(formatDateRange(arr3, ymd)).toStrictEqual([])
    expect(formatDateRange(arr4, ymd)).toStrictEqual([])
  })

  it('formatUserMenus', () => {
    const arr = [
      {
        resourceContent: 'test'
      }
    ]
    const arr1 = [
      {
        resourceContent: 'test',
        children: [
          {
            resourceContent: 'test1'
          },
          {
            resourceContent: 'test2',
            children: [
              {
                resourceContent: 'test3'
              }
            ]
          }
        ]
      }
    ]

    const arr2 = [
      {
        resourceContent: 'test',
        children: [
          {
            resourceContent: 'test1'
          },
          {
            resourceContent: 'test2',
            children: [
              {
                resourceContent: 'test3'
              }
            ]
          }
        ]
      },
      {
        resourceContent: 'test4',
        children: [
          {
            resourceContent: 'test5',
            children: [
              {
                resourceContent: 'test6'
              }
            ]
          }
        ]
      }
    ]
    const arr3 = []
    const arr4 = null

    expect(formatUserMenus(arr)).toStrictEqual({ test: true })
    expect(formatUserMenus(arr1)).toStrictEqual({ test: true, test1: true, test2: true, test3: true })
    expect(formatUserMenus(arr2)).toStrictEqual({
      test: true,
      test1: true,
      test2: true,
      test3: true,
      test4: true,
      test5: true,
      test6: true
    })
    expect(formatUserMenus(arr3)).toStrictEqual({})
    expect(formatUserMenus(arr4)).toStrictEqual({})
  })

  it('once', () => {
    let base = 0
    const func1 = once(a => {
      base += a
    }, 2)
    func1(9)
    expect(base).toBe(9)
    func1(29)
    expect(base).toBe(38)
    func1(2)
    expect(base).toBe(38)
  })
})
