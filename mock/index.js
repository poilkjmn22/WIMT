/*
 * @Author: fangqi
 * @Date: 2022-01-11 09:16:52
 * @LastEditors: fangqi
 * @LastEditTime: 2022-01-13 10:21:51
 * @Description: mock a http server
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserve
 */
'use strict'

const Hapi = require('@hapi/hapi')
const routes = require('./routes')

const init = async () => {
  const server = Hapi.server({
    port: 4000,
    host: 'localhost'
  })

  server.route(routes)

  await server.start()
  console.log(`服务器正在运行：${server.info.uri}`)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
