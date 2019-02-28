const CHART_LIB = require('../../json/chart-lib.json')
import * as echartHelper from './echartHelper'
import * as highchartHelper from './highchartHelper'
const ChartHelper = {
  drawChart(lib, chartBox, data){
    switch (lib) {
      case CHART_LIB.ECHARTS:
        echartHelper.drawChart(chartBox, data)
        break;
      case CHART_LIB.HIGHCHARTS:
        highchartHelper.drawChart(chartBox, data)
        break;
      default:

    }
  }
}
export default ChartHelper
