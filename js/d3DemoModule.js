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
    const scaleFactor = depth => (1 + Math.pow(depth, 0.1) * 0.5)
    node.on('click', function(d, i) {
        svg.call(transition, d);
    })

    function transition(s, d) {
        const i = d3.interpolateZoom(currentTransform, [d.x, d.y, height / scaleFactor(d.depth)]);

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

export async function drawArcsDemo(chartBox) {
    const width = 800
    const height = 800
    const data = await d3.dsv(',', '/json/population-by-age.csv')
    // console.dir(data)
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
    const radius = Math.min(width, height) / 2 * 0.8;
    const arc = d3.arc()
        .innerRadius(radius * 0.8)
        .outerRadius(Math.min(width, height) / 2 - 1)

    const arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);
    const pie = d3.pie()
        .padAngle(0.004)
        .sort(null)
        .value(d => d.value)
    const arcs = pie(data)

    const svg = d3.select(chartBox).append('svg')
        .attr('viewBox', [-width * 0.5, -height * 0.5, width, height])

    svg.append("g")
        .attr("stroke", "white")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value.toLocaleString()));
}

export function drawCurvesDemo(chartBox) {
    const width = 800
    const height = 600
    const lines = Array.from({
        length: 10
    }, () => {
        return Array.from({
            length: 10
        }, () => {
            return [
                (Math.random() * 0.8 + 0.1) * width,
                (Math.random() * 0.8 + 0.1) * height
            ];
        });
    })

    const svg = d3.select(chartBox).append('svg')
        .attr('viewBox', [0, 0, width, height])

    const path = d3.path();
    const curve = d3.curveCatmullRom(path);
    for (const line of lines) {
        curve.lineStart();
        for (const [x, y] of line) curve.point(x, y);
        curve.lineEnd();
    }

    svg.append('path')
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', 'navy')
}

export async function drawContextToCurveDemo(chartBox) {
    const width = 975
    const height = 610
    const data = await d3.json('/json/nation-albers.json')

    const svg = d3.select(chartBox).append('svg')
        .attr('viewBox', [0, 0, width, height])

    svg.append('path')
        .attr('d', d3.geoPath()(data))
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 0.5)

    svg.append('path')
        .attr('d', geoCurvePath(d3.curveCatmullRomClosed)(data))
        .attr('fill', 'none')
        .attr('stroke', 'black')

    function geoCurvePath(curve, projection, context) {
        return object => {
            const pathContext = context === undefined ? d3.path() : context;
            d3.geoPath(projection, curveContext(curve(pathContext)))(object);
            return context === undefined ? pathContext + "" : undefined;
        };
    }

    function curveContext(curve) {
        return {
            moveTo(x, y) {
                curve.lineStart();
                curve.point(x, y);
            },
            lineTo(x, y) {
                curve.point(x, y);
            },
            closePath() {
                curve.lineEnd();
            }
        };
    }
}

export const demoModules = [{
    name: "axes"
}, {
    name: "hierarchy"
}, {
    name: "arcs"
}, {
    name: "curves"
}, {
    name: "contextToCurve"
}]
