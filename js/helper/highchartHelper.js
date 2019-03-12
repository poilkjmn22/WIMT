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
const DATE_PERIOD_MODE = require('../../json/date-period-mode')

Highcharts.setOptions({
    lang: {
        noData: '暂无数据'
    }
})

function drawChart(chartBox, {
    activityList,
    activityClassList,
    datePeriodMode = 'day'
}) {
    var colors = Highcharts.getOptions().colors;
    var groupByDatePeriodMode = function(DateISO, datePeriodMode){
      var x = null
      switch (datePeriodMode) {
        case 'day':
          x = DateISO
          break
        case 'week':
          x = DateTime.fromISO(DateISO).weekNumber
          break
        case 'month':
          x = DateTime.fromISO(DateISO).month
          break
        default:

      }
      return x
    }
    var getDatePeriodTitle = function(datePeriodMode){
      return _.chain(DATE_PERIOD_MODE)
        .find(['name', datePeriodMode])
        .get('title')
        .value()
    }
    var transformSeriesData = function({
        activityList,
        activityClassList,
        datePeriodMode
    }) {
        var series = _.chain(activityList)
            .groupBy('Name')
            .map((gv, gk) => ({
                name: gk,
                data: _.chain(gv)
                  .groupBy(v => groupByDatePeriodMode(v.ActivityRoundDate, datePeriodMode))
                  .map((v, k) => _.sumBy(v, vv => wimt.utils.parseDuration(vv.Duration)))
                  .value()
            }))
            .value()

        var categories = _.chain(activityList)
          .map('ActivityRoundDate')
          .uniq()
          .groupBy(v => groupByDatePeriodMode(v, datePeriodMode))
          .map((v,k) => {
            if(v.length > 1){
              return `${DateTime.fromISO(v[0], {
                  locale: 'zh-Hans-CN'
              }).toFormat('yyyy-MM-dd cccc')}~${DateTime.fromISO(v[v.length - 1], {
                  locale: 'zh-Hans-CN'
              }).toFormat('yyyy-MM-dd cccc')}[${k}${getDatePeriodTitle(datePeriodMode)}]`
            }else {
              return DateTime.fromISO(v[0], {
                  locale: 'zh-Hans-CN'
              }).toFormat('yyyy-MM-dd cccc')
            }
          })
          .value()
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
        activityClassList,
        datePeriodMode
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
                    if(this.value.split('~').length > 1){
                      return `<div><span>${this.value.split('~')[0]}</span><br><span>${this.value.split('~')[1]}</span></div>`
                    }
                    return this.value
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
                var dateStr = this.x
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
