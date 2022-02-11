/*
 * @Author: xu jun
 * @Date: 2021-06-21 16:50:50
 * @LastEditors: xu jun
 * @LastEditTime: 2021-06-23 09:35:08
 * @Description: echarts按需加载
 * Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import * as echarts from 'echarts/lib/echarts'
import { TitleComponent, GridComponent, TooltipComponent, MarkPointComponent } from 'echarts/components'
import { BarChart, LineChart } from 'echarts/charts'

echarts.use([BarChart, LineChart, TitleComponent, GridComponent, TooltipComponent, MarkPointComponent])

// 调色盘颜色列表
export const color = ['#2977f9', '#febf6b']

export default echarts
