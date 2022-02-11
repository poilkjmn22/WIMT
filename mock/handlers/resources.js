/*
 * @Author: fangqi
 * @Date: 2022-01-13 09:57:29
 * @LastEditors: fangqi
 * @LastEditTime: 2022-01-13 10:24:31
 * @Description: API routes
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserve
 */
'use strict'
const sampleResourceList = require('../sample/sampleResourceList.json')
const MOCK_DELAY = 1000

async function list(request, h) {
  await new Promise(res => setTimeout(res, MOCK_DELAY))
  console.log(request.query)
  return h
    .response({
      list: sampleResourceList,
      total: sampleResourceList.length,
      pageNum: 1,
      pageSize: 10,
      status: '000_000'
    })
    .type('application/json')
}

module.exports = {
  list
}
