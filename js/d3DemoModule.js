import * as d3 from 'd3'
import * as _ from 'lodash-es'

export function drawAxesDemo(chartBox) {
    const width = 800
    const height = 600
    const margin = {
        top: 20,
        right: 30,
        bottom: 30,
        left: 40
    }

    const svg = d3.select(chartBox).append("svg")
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

export async function drawHierarchyDemo(chartBox) {
    const width = 975
    const height = 975
    const color = d3.scaleSequential([8, 0], d3.interpolateMagma)
    const format = d3.format(",d")

    const data = await d3.json('/json/flare-2.json')
    const pack = data => d3.pack()
        .size([width - 2, height - 2])
        .padding(3)
        (d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value))
    const root = pack(data);
    // console.dir(root)

    const svg = d3.select(chartBox).append("svg")
        .attr("viewBox", [0, 0, width, height])
        .style("font", "10px sans-serif")
        .attr("text-anchor", "middle");

    const shadow_id = _.uniqueId('shadow')
    svg.append("filter")
        .attr("id", shadow_id)
        .append("feDropShadow")
        .attr("flood-opacity", 0.3)
        .attr("dx", 0)
        .attr("dy", 1);

    const nestEntries = d3.nest().key(d => d.height).entries(root.descendants())
    // console.dir(nestEntries)
    const circlePackingGroup = svg.append('g')
        .attr('class', 'chart-wrapper')
    const node = circlePackingGroup.selectAll("g")
        .data(nestEntries)
        .join("g")
        .attr("filter", `url(#${shadow_id})`)
        .attr("class", 'g-nest-level-0')
        .selectAll("g")
        .data(d => d.values)
        .join("g")
        .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

    node.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => color(d.height))

    const leaf = node.filter(d => !d.children);

    leaf.select("circle")
        .attr("id", d => (d.leafUid = _.uniqueId('leaf')));

    // leaf.append("clipPath")
    //     .attr("id", d => (d.clipUid = _.uniqueId('clip')))
    //     .append("use")
    //     .attr("xlink:href", d => `url(#${d.leafUid})`);

    leaf.append("text")
        // .attr("clip-path", d => `url(#${d.clipUid})`)
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
        .text(d => d)

    node.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    //zoom
    // svg.call(d3.zoom()
    //     .extent([
    //         [0, 0],
    //         [width, height]
    //     ])
    //     .scaleExtent([1, 8])
    //     .on("zoom", () => zoomed(d3.event.transform)));
    //
    // function zoomed(transform) {
    //     circlePackingGroup.attr('transform', transform)
    // }

    //smooth-zooming
    let currentTransform = [width / 2, height / 2, height];
    const scaleFactor = depth => (1 + Math.pow(depth, 0.3) * 0.5)
    node.on('click', function (d, i) {
      svg.call(transition, d);
    })
    function transition(s, d) {
        const i = d3.interpolateZoom(currentTransform, [d.x, d.y, height / scaleFactor(d.depth) ]);

        circlePackingGroup.transition()
            .delay(250)
            .duration(i.duration)
            .attrTween("transform", () => t => transform(currentTransform = i(t)))
    }

    function transform([x, y, r]) {
        return `
      translate(${width / 2}, ${height / 2})
      scale(${height / r})
      translate(${-x}, ${-y})
    `;
    }
}

export const demoModules = [{
    name: "axes"
}, {
    name: "hierarchy"
}]
