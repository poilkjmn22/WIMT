/*
 * @Author: fangqi
 * @Date: 2022-01-13 09:57:29
 * @LastEditors: fangqi
 * @LastEditTime: 2022-01-17 17:48:28
 * @Description: API routes
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserve
 */
'use strict'
const sampleMenuList = require('../sample/menuManageTableData.json')

const MOCK_DELAY = 1000

async function list(request, h) {
  await new Promise(res => setTimeout(res, MOCK_DELAY))
  return h
    .response({
      result: sampleMenuList,
      status: '000_0000_0000'
    })
    .type('application/json')
}

module.exports = {
  list
}
