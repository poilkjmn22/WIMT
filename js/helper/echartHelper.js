import DateTime from 'luxon/src/datetime.js'
import _ from 'lodash'

import wimt from '../utils'

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/themeRiver')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')

function drawChart(chartBox, {
    activityList,
    activityClassList
}) {
    let chart = echarts.init(chartBox)

    function transformSeriesData(data) {
        return [{
            type: 'themeRiver',
            itemStyle: {
                emphasis: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.8)'
                }
            },
            data: _.map(data, d => [DateTime.fromISO(d.ActivityRoundDate).toFormat('yyyy-MM-dd'), wimt.utils.parseDuration(d.Duration), d.Name])
        }]
    }
    let chartOpt = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: 'rgba(0,0,0,0.2)',
                    width: 1,
                    type: 'solid'
                }
            }
        },
        singleAxis: {
            top: 50,
            bottom: 50,
            axisTick: {},
            axisLabel: {},
            type: 'time',
            axisPointer: {
                animation: true,
                label: {
                    show: true
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.2
                }
            }
        },
        grid: {
            left: 10,
            right: 10
        },
        color: _.map(activityClassList, 'Color'),
        legend: {
            data: _.map(activityClassList, 'Name'),
            bottom: 'bottom'
        },
        series: transformSeriesData(activityList)
    }

    chart.setOption(chartOpt)
}

export {
    drawChart
}
