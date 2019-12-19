<template lang="html">
  <div class="">
    <div ref="axisDemoBox" class="chart-box">

    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  mounted() {
      const width = 800
      const height = 600
      const margin = {
          top: 20,
          right: 30,
          bottom: 30,
          left: 40
      }

      const svg = d3.select(this.$refs.axisDemoBox).append("svg")
          .attr("viewBox", [0, 0, width, height])

      var x = d3.scaleLinear()
          .domain([0, 1])
          .range([margin.left, width - margin.right])


      const xAxis = svg => svg
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisTop(x)
              .tickSize(width - margin.left - margin.right)
              .tickFormat(x => `(${x.toFixed(1)})`)
          )
          .call(g => g.select('.domain').remove())
          .call(g => g.selectAll(".tick:not(:first-of-type) line")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-dasharray", "2,2"))
          .call(g => g.selectAll(".tick text")
            .attr("x", 10)
            .attr("y", -4))

      svg.append("g")
          .call(xAxis);

      var y = d3.scaleLinear()
          .domain([0, 1])
          .range([margin.top, height - margin.bottom].reverse())

      const yAxis = svg => svg
          .attr("transform", `translate(${margin.left}, 0)`)
          .call(d3.axisLeft(y)
            .ticks(15, '.2f')
        )
      svg.append("g")
          .call(yAxis);

  }
}
</script>

<style lang="scss">

</style>
