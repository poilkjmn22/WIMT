/*
 * @Author: fangqi
 * @Date: 2022-01-13 09:57:29
 * @LastEditors: fangqi
 * @LastEditTime: 2022-01-26 17:43:40
 * @Description: 角色
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserve
 */
'use strict'
const sampleRoleList = require('../sample/roleManageTableData.json')

const MOCK_DELAY = 1000

async function list(request, h) {
  await new Promise(res => setTimeout(res, MOCK_DELAY))
  return h
    .response({
      result: {
        pageNum: 1,
        pageSize: 10,
        total: sampleRoleList.length,
        list: sampleRoleList
      },
      status: '000_0000_0000'
    })
    .type('application/json')
}

module.exports = {
  list
}
