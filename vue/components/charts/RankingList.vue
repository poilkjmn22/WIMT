<template lang="html">
  <div ref="rankingListChartBox" class="ranking-list-chart-box chart-box">

  </div>
</template>

<script>
import * as d3 from 'd3';
import * as _ from 'lodash-es';
import rtc from '../../../js/utils.js'

const VIEWPORT = [390, 800]

const DEFAULT_OPTIONS = {
  series: {
    width: 40
  },
  bar: {
    width: 10,
    baseHeight: 200,
    minHeight: 10,
    color: "#1AA5FF",
    noDataColor: "#999"
  },
  xAxis:{
    width: 80,
    rankImgWidth: 20,
    rankImgHeight: 25,
    nameWidth: 60
  },
  yAxis: {
    splitCount: 4,
    bottom: 45,
    splitColor: "#D8D8D8"
  },
  title: {
    height: 60,
    text: "当天排行情况"
  },
  padding: [0, 30, 0, 30],
  legend: {
    itemWidth: 80,
    iconWidth: 15
  },
  xAxisName: "名称",
  yAxisName: "数量",
  paging: {
    size: 5,
    width: 20,
    height: 20,
    margin: 10
  }
};
export default {
  data(){
    return {
      page: 1
    }
  },
  props: {
    data: {
      type: Array,
      default(){
        return require('../../../server/mock-data/chart-data/ranking-list-data-sample.json')
      }
    },
    options: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  computed: {
    totalCount(){
      return this.data.seriesData.length
    },
    pageCount(){
      return Math.ceil(this.totalCount / this.options.paging.size)
    },
    pageData(){
      var pd = this.data.seriesData.slice((this.page - 1) * this.options.paging.size, Math.min(this.page * this.options.paging.size, this.data.seriesData.length))
      this.computePosition(pd)
      return pd
    }
  },
  created(){
    this.options = _.merge({}, DEFAULT_OPTIONS, this.options || {})
    _.each(this.data.seriesData, sd => {
      sd.valuesum = _.sum(sd.rankvalue)
    })
  },
  watch: {
    'page': function(val){
      const svg = d3.select(this.$refs.rankingListChartBox).select("svg")
      svg.selectAll(".chart-serie .g-rank-serie").remove()
      this.drawChart(svg)
    }
  },
  methods: {
    computePosition(seriesData) {
        var max = _.maxBy(this.data.seriesData, 'valuesum')
        var maxValue = max && max.valuesum || 0
        _.each(seriesData, (d, i) => {
            d.barHeight = _.map(d.rankvalue, v => Math.max(this.options.bar.baseHeight * (maxValue > 0 ? (v / maxValue) : 0), this.options.bar.minHeight))
            d.position = _.reduce(d.rankvalue, (res, v, j) => {
                res.push({
                    x: j <= 0 ? 0 : (res[j - 1].x + d.barHeight[j - 1]),
                    y: (i + 0.5) * this.options.series.width
                })
                return res
            }, [])
        })
    },
    getBarPath(d, i, sn, j){
      var linecapRadius = this.options.bar.width * 0.5
      var offsetLeft = this.options.xAxis.width
      var isLastSeries = (j === (this.data.seriesName.length - 1))
      var points = [{
              x: d.position[j].x + offsetLeft,
              y: d.position[j].y - linecapRadius
          }, {
              x: d.position[j].x + offsetLeft + d.barHeight[j] - (isLastSeries ? linecapRadius : 0),
              y: d.position[j].y - linecapRadius
          },
          {
              x: d.position[j].x + offsetLeft + d.barHeight[j] - (isLastSeries ? linecapRadius : 0),
              y: d.position[j].y + linecapRadius
          }, {
              x: d.position[j].x + offsetLeft,
              y: d.position[j].y + linecapRadius
          }
      ]
      return `M${points[0].x + ',' + points[0].y}L${points[1].x + ',' + points[1].y}` +
      (isLastSeries ? `A${[linecapRadius, linecapRadius, 0, 0, 1, points[2].x, points[2].y].join(',')}` : `L${points[2].x + ',' + points[2].y}`) +
      `L${points[3].x + ',' + points[3].y}Z`
    },
    drawChart(svg){
      var options = this.options
      const serieArea = svg.select(".chart-serie")
      const serie = serieArea.selectAll("g")
        .data(this.pageData)
        .join("g")
        .attr("class", d => ('g-rank-serie ' + (d.rank <= 3 ? 'g-rank-img' : 'g-rank-num')))

      //条状图
      _.each(this.data.seriesName, (sn, j) => {
        serie.append("path")
          .attr("stroke", "none")
          .attr("fill", d => d.rankvalue[j] ? sn.color : options.bar.noDataColor)
          .attr("d", (d, i) => this.getBarPath(d, i, sn, j))
      })

      //每一段条的数字
      _.each(this.data.seriesName, (sn, j) => {
        serie.append("text")
          .text(d => d.rankvalue[j])
          .attr('class', 'chart-text series-text')
          .attr("text-anchor", "middle")
          .attr("x", d => options.xAxis.width + d.position[j].x + d.barHeight[j] * 0.5)
          .attr("y", (d, i) => d.position[0].y - 10)
      })

      //棒顶数字
      serie.append("text")
        .text(d => d.valuesum)
        .attr('class', 'chart-text')
        .attr("text-anchor", "middle")
        .attr("x", d => options.xAxis.width + _.sum(d.barHeight) + 20)
        .attr("y", (d, i) => d.position[0].y + 5)

      //排行榜图片/数字
      svg.selectAll('g.g-rank-img')
        .append("image")
        .attr("width", options.xAxis.rankImgWidth)
        .attr("height", options.xAxis.rankImgHeight)
        .attr("href", d => `/assets/images/${d.rank}@2x.png`)
        .attr("x", 0)
        .attr("y", (d, i) => d.position[0].y - options.xAxis.rankImgHeight * 0.5)

      svg.selectAll('g.g-rank-num')
        .append("text")
        .text(d => d.rank)
        .attr("text-anchor", "middle")
        .attr("class", "rank-num-text chart-text")
        .attr("x", d => options.xAxis.rankImgWidth * 0.5)
        .attr("y", (d, i) => d.position[0].y + 5)

      //名称
      serie.append("text")
        .text(d => d.name)
        .attr("text-anchor", "middle")
        .attr("class", "chart-text")
        .attr("x", d => options.xAxis.rankImgWidth + options.xAxis.nameWidth * 0.5)
        .attr("y", (d, i) => d.position[0].y + 5)
    },
    computeViewport(){
      var chartBox = this.$refs.rankingListChartBox
      var cstyle = document.defaultView.getComputedStyle(chartBox)
      var width = parseFloat(cstyle.width)
      chartBox.style.setProperty("height", `${width * (VIEWPORT[1] + 60) / VIEWPORT[0]}px`)
    }
  },
  mounted(){
    this.computeViewport()

    const options = this.options
    const svg = d3.select(this.$refs.rankingListChartBox).append("svg")
        .attr("preserveAspectRatio", "xMidYMin meet")
        .attr("viewBox", [0, 0, VIEWPORT[0], VIEWPORT[1]]);

    const title = svg.append('g')
      .attr('class', 'chart-title')
      .append('text')
      .text(options.title.text)
      .attr('class', 'title-text')
      .attr('x', 40)
      .attr('y', options.padding[0] + options.title.height * 0.5 + 7)

    //网格
    var gridLine = svg.append("g")
      .attr('transform', `translate(${options.padding[3]},${options.padding[0] + options.title.height})`)
      .attr("class", "grid-line")
    const splitDist = options.bar.baseHeight / options.yAxis.splitCount
    gridLine.selectAll('line')
      .data(_.range(0, options.yAxis.splitCount + 1))
      .join('line')
      .attr("class", "split-line-yaxis")
      .attr("x1", d => options.xAxis.width + splitDist * d)
      .attr("y1", options.series.width * 0.5)
      .attr("x2", d => options.xAxis.width + splitDist * d)
      .attr("y2", VIEWPORT[1] - options.yAxis.bottom)
    gridLine.append('line')
      .attr("class", "split-line-yaxis")
      .attr("x1", d => options.xAxis.width)
      .attr("y1", options.series.width * 0.5)
      .attr("x2", d => options.xAxis.width + options.bar.baseHeight)
      .attr("y2", options.series.width * 0.5)
    gridLine.append('line')
      .attr("class", "split-line-yaxis")
      .attr("x1", d => options.xAxis.width)
      .attr("y1", VIEWPORT[1] - options.yAxis.bottom)
      .attr("x2", d => options.xAxis.width + options.bar.baseHeight + 20)
      .attr("y2", VIEWPORT[1] - options.yAxis.bottom)

    const serieArea = svg.append("g")
        .attr('transform', `translate(${options.padding[3]},${options.padding[0] + options.title.height})`)
        .attr('class', 'chart-serie')

    //图表
    this.drawChart(svg)

    //图例
    const legendArea = svg.append("g")
      .attr("class", "chart-legend")
    const legend = legendArea.selectAll("g")
      .data(this.data.seriesName)
      .join("g")

    legend.append("circle")
      .attr("cx", (d, i) => VIEWPORT[0] - options.padding[1] - (this.data.seriesName.length - i) * options.legend.itemWidth)
      .attr("cy", options.padding[0] + options.title.height * 0.5)
      .attr("r", 5)
      .attr("fill", d => d.color)
      .attr("stroke", "none")

    legend.append("text")
      .text(d => d.name)
      .attr("x", (d, i) => VIEWPORT[0] - options.padding[1] - (this.data.seriesName.length - i) * options.legend.itemWidth + options.legend.iconWidth)
      .attr("y", options.padding[0] + options.title.height * 0.5 + 5)
      .attr("class", "chart-text legend-text")
      .attr("stroke", "none")

    //eof 图表

    serieArea.append("text")
      .text(options.xAxisName)
      .attr("class", "axis-text")
      .attr("text-anchor", "end")
      .attr("x", options.xAxis.width - 10)
      .attr("y",  VIEWPORT[1] - options.yAxis.bottom + 15)

    serieArea.append("text")
      .text(options.yAxisName)
      .attr("class", "axis-text")
      .attr("text-anchor", "start")
      .attr("x", options.xAxis.width + options.bar.baseHeight)
      .attr("y",  VIEWPORT[1] - options.yAxis.bottom + 15)

    //分页器
    const paging = svg.append("g")
      .attr("class", `paging ${this.pageCount > 1 ? "should-show" : ""}`)
    var prevBtn = paging.append("g").attr("class", "prev-btn")

    prevBtn.append("image")
      .attr("x", options.xAxis.width + options.bar.baseHeight * 0.5 + options.padding[3] - options.paging.width - options.paging.margin * 0.5)
      .attr("y", VIEWPORT[1] - options.yAxis.bottom + 65)
      .attr("width", options.paging.width)
      .attr("height", options.paging.height)
      .attr("href", "/assets/images/btn_page_prev.png")
    prevBtn.on("click", () => {
      if(this.page > 1){
        this.page -= 1
      }
    })

    var nextBtn = paging.append("g").attr("class", "next-btn")
    nextBtn.append("image")
      .attr("x", options.xAxis.width + options.bar.baseHeight * 0.5 + options.padding[3] + options.paging.margin * 0.5)
      .attr("y", VIEWPORT[1] - options.yAxis.bottom + 65)
      .attr("width", options.paging.width)
      .attr("height", options.paging.height)
      .attr("href", "/assets/images/btn_page_next.png")

    nextBtn.on("click", () => {
      if(this.page < this.pageCount){
        this.page += 1
      }
    })

  }
}
</script>

<style lang="scss">
@import "./charts.scss";

.rank-num-text.chart-text{
  font-size: 14px;
}

.split-line-yaxis{
  stroke: #D8D8D8;
  stroke-width: 1;
  stroke-dasharray: 5;
}

.axis-text{
  font-size: 12px;
  font-weight: 400;
  color: #7F899A;
}

.series-text.chart-text{
  font-weight: 400;
  font-size: 12px;
}
.legend-text.chart-text{
  font-weight: 400;
}

.paging {
  &.should-show{
    display: block;
  }
  display: none;
  .prev-btn, .next-btn{
    cursor: pointer;
  }
}
</style>
