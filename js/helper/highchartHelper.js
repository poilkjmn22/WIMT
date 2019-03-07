import Highcharts from 'highcharts'
// import Exporting from 'highcharts/modules/exporting'
import Annotations from 'highcharts/modules/annotations'
import Streamgraph from 'highcharts/modules/streamgraph'
import NoDataToDisplay from 'highcharts/modules/no-data-to-display'
// Exporting(Highcharts)
Annotations(Highcharts)
Streamgraph(Highcharts)
NoDataToDisplay(Highcharts)

import _ from 'lodash'
import wimt from '../utils'
import DateTime from 'luxon/src/datetime'

const SUC = require('../../json/special-unicode-character')

Highcharts.setOptions({
    lang: {
        noData: '暂无数据'
    }
})

function drawChart(chartBox, {
    activityList,
    activityClassList
}) {
    var colors = Highcharts.getOptions().colors;
    var transformSeriesData = function({
        activityList,
        activityClassList
    }) {
        var series = _.chain(activityList)
            .groupBy('Name')
            .map((gv, gk) => ({
                name: gk,
                data: _.map(gv, v => wimt.utils.parseDuration(v.Duration))
            }))
            .value()
        var categories = _.chain(activityList).map('ActivityRoundDate').uniq().value()
        return {
            series,
            categories
        }
    }
    let {
        series,
        categories
    } = transformSeriesData({
        activityList,
        activityClassList
    })
    Highcharts.chart({
        chart: {
            type: 'streamgraph',
            marginBottom: 30,
            zoomType: 'x',
            renderTo: chartBox
        },
        // Make sure connected countries have similar colors
        title: {
            floating: true,
            align: 'left',
            text: ''
        },
        xAxis: {
            maxPadding: 0,
            type: 'category',
            crosshair: true,
            categories,
            labels: {
                align: 'center',
                reserveSpace: false,
                rotation: 270,
                formatter: function() {
                    var dt = DateTime.fromISO(this.value, {
                        locale: 'zh-Hans-CN'
                    })
                    return `<div><span>${dt.toFormat('yyyy-MM-dd')}</span><br><span>${dt.toFormat('cccc')}</span></div>`
                }
            },
            lineWidth: 0,
            margin: 20,
            tickWidth: 0
        },
        yAxis: {
            visible: false,
            startOnTick: false,
            endOnTick: false
        },
        legend: {
            enabled: true,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top'
        },
        annotations: [{
            labels: [{
                point: {
                    x: 4,
                    xAxis: 0,
                    y: 5,
                    yAxis: 0
                },
                text: '周六'
            }, {
                point: {
                    x: 5,
                    xAxis: 0,
                    y: 5,
                    yAxis: 0
                },
                text: '周日'
            }],
            labelOptions: {
                backgroundColor: 'rgba(255,255,255,0.5)',
                borderColor: 'silver'
            }
        }],
        plotOptions: {
            series: {
                label: {
                    minFontSize: 5,
                    maxFontSize: 15,
                    style: {
                        color: 'rgba(255,255,255,0.75)'
                    }
                }
            }
        },
        tooltip: {
            shared: true,
            useHTML: true,
            formatter: function() {
                var dateStr = DateTime.fromISO(this.x, {
                    locale: 'zh-Hans-CN'
                }).toFormat('DDD cccc')
                var pointsStr = _.map(this.points, p => {
                    return `<div><span class="mr-3 FS-12" style="color: ${p.color}">${SUC.fillCircle}</span> ${p.series.name}：<b>${p.y}</b></div>`
                }).join('')
                return `<div>${dateStr}<br>${pointsStr}</div>`
            }
        },
        series,
        exporting: {
            sourceWidth: 800,
            sourceHeight: 600
        },
        credits: {
            enabled: false
        }
    });
}
export {
    drawChart
}
