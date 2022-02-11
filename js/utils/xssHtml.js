/*
 * @Author: xu jun
 * @Date: 2021-09-15 09:20:10
 * @LastEditors: xu jun
 * @LastEditTime: 2021-09-15 14:12:03
 * @Description:
 * Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import xss from 'xss'

const defaultWhiteList = xss.getDefaultWhiteList()

const xssOption = {
  whiteList: {
    ...defaultWhiteList,
    p: ['style']
  }
}

export default function xssHtml(html) {
  return xss(html, xssOption)
}
