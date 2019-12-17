<template lang="html">
  <div ref="funnelChartBox" class="funnel-chart-box chart-box">

  </div>
</template>

<script>
import * as d3 from 'd3';
import * as _ from 'lodash-es';
import rtc from '../../../js/utils.js'

const DEFAULT_OPTIONS = {
  series: {
    padding: 2,
    height: 50,
    minWidth: 10,
    color: "#1AA5FF",
    noDataColor: "#999"
  },
  bar: {
    width: 10,
    baseHeight: 280,
    minHeight: 6,
    left: 850,
    paddingLeft: 8
  },
  title: {
    height: 120,
    text: "全部"
  },
  padding: [0, 20, 0, 40],
  funnelBaseWidth: 560,
  funnelTitleText: "转化量",
  barTitleText: "转化率"
};

function _easeFunc(rate, type){
  type = type || 'linear'
  let res = 0;
  switch (type) {
    case 'linear':
      res = rate
      break;
    case 'squa':
      res = Math.pow(rate, 2)
      break;
    case 'log':
      res = Math.log(rate)
      break;
    case 'cubic':
      res = Math.pow(rate, 3)
      break;
    case 'sqrt':
      res = Math.sqrt(rate)
      break;
    default:

  }
  return res
}

export default {
  props: {
    funnelData: {
      type: Object,
      default(){
        return {
          options: {},
          data: require('../../../server/mock-data/chart-data/funnel-data-sample.json')
        }
      }
    }
  },
  computed: {
    data(){
      return this.funnelData.data
    },
    options(){
      return this.funnelData.options
    }
  },
  created(){
    this.funnelData.options = _.merge({}, DEFAULT_OPTIONS, this.funnelData.options || {})
  },
  watch: {
    "funnelData": function(val){
      if(val){
        val.options = _.merge({}, DEFAULT_OPTIONS, val.options || {})
        this.drawChart()
      }
    }
  },
  methods: {
    getPath(d, i){
      var nextData = this.data[i + 1]
      var currPoints = d.position
      let nextPoints = null
      if(nextData){
        nextPoints = [[nextData.position[0][0], nextData.position[0][1] - this.options.series.padding], [nextData.position[1][0], nextData.position[1][1] - this.options.series.padding]]
      }else {
        nextData = this.data[i]
        nextPoints = [[nextData.position[0][0], nextData.position[0][1] + this.options.series.height], [nextData.position[1][0], nextData.position[1][1] + this.options.series.height]]
      }
      return `M${currPoints[0].join(' ')} L${currPoints[1].join(' ')} L${nextPoints[1].join(' ')} L${nextPoints[0].join(' ')}Z`
    },
    getBarPath(d, i){
      if(d.rateTitle === ""){
        return ''
      }
      var offsetLeft = this.options.bar.left + this.options.bar.paddingLeft
      var linecapRadius = this.options.bar.width * 0.5

      var points = [{
              x: offsetLeft,
              y: d.position[1][1] - linecapRadius
          }, {
              x: offsetLeft + d.barHeight - linecapRadius,
              y: d.position[1][1] - linecapRadius
          },
          {
              x: offsetLeft + d.barHeight - linecapRadius,
              y: d.position[1][1] + linecapRadius
          }, {
              x: offsetLeft,
              y: d.position[1][1] + linecapRadius
          }
      ]
      return `M${points[0].x + ',' + points[0].y}L${points[1].x + ',' + points[1].y}A${[linecapRadius, linecapRadius, 0, 0, 1, points[2].x, points[2].y].join(',')}L${points[3].x + ',' + points[3].y}Z`
    },
    computePosition(){
      let {funnelBaseWidth} = this.options
      _.each(this.data, (d, i, l) => {
        var currLength = l[0].value <= 0 ? this.options.series.minWidth : Math.min(Math.max(funnelBaseWidth * _easeFunc(d.value / l[0].value, 'sqrt'), this.options.series.minWidth), funnelBaseWidth)
        d.convertRate = i > 0 && l[i - 1].value > 0 ? (d.value / l[i - 1].value) : 0
        d.barHeight = Math.min(Math.max(this.options.bar.baseHeight * d.convertRate, this.options.bar.minHeight), this.options.bar.baseHeight)
        d.position = [[(funnelBaseWidth - currLength) * 0.5, i * (this.options.series.height + this.options.series.padding)], [(funnelBaseWidth + currLength) * 0.5, i * (this.options.series.height + this.options.series.padding)]]
      })
    },
    drawChart(){
      d3.select(this.$refs.funnelChartBox).select("svg").remove()
      const options = this.options
      const svg = d3.select(this.$refs.funnelChartBox).append("svg")
          .attr("preserveAspectRatio", "xMidYMin meet")
          .attr("viewBox", [0, 0, 1300, 600]);

      this.computePosition()

      const title = svg.append('g')
        .attr('class', 'chart-title')
        .append('text')
        .text(options.title.text)
        .attr('class', 'title-text')
        .attr('text-anchor', 'middle')
        .attr('x', 600)
        .attr('y', options.padding[0] + options.title.height * 0.5)

      const chartArea = svg.append("g")
          .attr('transform', `translate(${options.padding[3]},${options.padding[0] + options.title.height})`)
          .attr('class', 'chart-serie')

      const serie = chartArea.selectAll("g")
        .data(this.data)
        .join("g");

      //漏斗
      serie.append("path")
          .attr("fill", d => d.value ? options.series.color : options.series.noDataColor)
          .attr("fill-opacity", (d, i) => Math.max(1 - 0.1 * i, 0))
          .attr("stroke", "none")
          .attr("d", (d, i) => this.getPath(d, i));

      //漏斗文字说明
      const funnelLabelValue = serie.append("text")
          .text((d, i) => rtc.utils.numberFormat(d.value, 0))
          .attr('class', 'chart-text funnel-label-value')
          .attr("stroke", "none")
          .attr("style", "text-anchor: middle")
          .attr("x", (d, i) => options.funnelBaseWidth * 0.5)
          .attr("y", (d, i) => (i + 0.5) * options.series.height + i * options.series.padding)

      const funnelLabelText = serie.append("text")
          .text((d, i) => d.title)
          .attr('class', 'chart-text funnel-label-text')
          .attr("stroke", "none")
          .attr("style", "text-anchor: end")
          .attr("x", (d, i) => Math.max(d.position[0][0], d.title.length * 12))
          .attr("y", (d, i) => (i + 0.5) * options.series.height + i * options.series.padding)

      //连线
      serie.append("line")
          .attr("stroke", d => d.value ? options.series.color : options.series.noDataColor)
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", 6)
          .attr("x1", (d, i) => d.rateTitle === "" ? 0 : d.position[1][0])
          .attr("y1", (d, i) => d.rateTitle === "" ? 0 : d.position[1][1])
          .attr("x2", (d, i) => d.rateTitle === "" ? 0 : this.options.bar.left)
          .attr("y2", (d, i) => d.rateTitle === "" ? 0 : d.position[1][1])

      //比率条形图
      serie.append("path")
          .attr("stroke", "none")
          .attr("fill", d => d.value ? options.series.color : options.series.noDataColor)
          .attr("d", (d, i) => this.getBarPath(d, i))

      //百分比
      serie.append("text")
          .text((d, i) => d.rateTitle === "" ? '' : (rtc.utils.numberFormat(d.convertRate * 100, 2) + '%'))
          .attr('class', 'chart-text')
          .attr("stroke", "none")
          .attr("x", (d, i) => d.rateTitle === "" ? 0 : (this.options.bar.left + d.barHeight + this.options.bar.paddingLeft * 2))
          .attr("y", (d, i) => d.rateTitle === "" ? 0 : (d.position[1][1] + 5))

      //百分比文字说明
      serie.append("text")
          .text((d, i) => d.rateTitle === "" ? '' : d.rateTitle)
          .attr('class', 'chart-text')
          .attr("stroke", "none")
          .attr("x", (d, i) => d.rateTitle === "" ? 0 : (this.options.bar.left + this.options.bar.paddingLeft))
          .attr("y", (d, i) => d.rateTitle === "" ? 0 : (d.position[1][1] - 15))

      const funnelTitle = chartArea.append('text')
        .text(options.funnelTitleText)
        .attr('class', 'title-text')
        .attr('style', 'text-anchor: middle')
        .attr('x', options.funnelBaseWidth * 0.5)
        .attr('y', this.data.length * (options.series.height + options.series.padding) + 40)

      const barTitle = chartArea.append('text')
        .text(options.barTitleText)
        .attr('class', 'title-text')
        .attr('style', 'text-anchor: middle')
        .attr('x', options.bar.left + options.bar.paddingLeft + 60)
        .attr('y', this.data.length * (options.series.height + options.series.padding) + 40)
    }
  },
  mounted(){
    this.drawChart()
  }
}
</script>

<style lang="scss">
@import "./charts.scss";
</style>
