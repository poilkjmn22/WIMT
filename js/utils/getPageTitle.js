/*
 * @Author: zhangchuanzhong
 * @Date: 2021-04-15 16:52:03
 * @LastEditors: zhangchuanzhong
 * @LastEditTime: 2022-02-09 15:39:31
 * @Description: 页面标题
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import settings from '@/settings'

const title = settings.title

export default function getPageTitle(to) {
  const pageTitle = to.meta.title
  const homeTitle = title
  if (pageTitle) {
    return `${pageTitle} - ${homeTitle}`
  }
  return `${homeTitle}`
}
