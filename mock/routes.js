/*
 * @Author: fangqi
 * @Date: 2022-01-13 09:57:29
 * @LastEditors: fangqi
 * @LastEditTime: 2022-01-26 17:31:06
 * @Description: API routes
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserve
 */
'use strict'

const Menus = require('./handlers/menus.js')
const Resources = require('./handlers/resources.js')
const Roles = require('./handlers/roles.js')

module.exports = [
  {
    method: 'POST',
    path: '/mock/api/menus',
    handler: Menus.list
  },
  {
    method: 'GET',
    path: '/mock/api/resources',
    handler: Resources.list
  },
  {
    method: 'GET',
    path: '/mock/api/role/list',
    handler: Roles.list
  }
]
