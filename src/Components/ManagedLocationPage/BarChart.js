import React, { Component } from 'react'
import * as d3 from 'd3'

class BarChart extends Component {
    constructor(props) {
        super(props)
        this.createBarChart = this.createBarChart.bind(this)
        
        
    }


    componentDidMount() {
        this.createBarChart()
    }

    componentDidUpdate() {
        this.createBarChart()
    }

    createBarChart() {
        const data = [
            {
                value: 0,
                frequency: 0.1
            },
            {
                value: 0.5,
                frequency: 0.1
            },
            {
                value: 1,
                frequency: 0.1
            },
            {
                value: 1.5,
                frequency: 0.1
            },
            {
                value: 2,
                frequency: 0.05
            },
            {
                value: 2.5,
                frequency: 0.2
            },
            {
                value: 3,
                frequency: 0.05
            },
            {
                value: 3.5,
                frequency: 0.1
            },
            {
                value: 4,
                frequency: 0.1
            },
            {
                value: 4.5,
                frequency: 0.1
            },
            {
                value: 5,
                frequency: 0.1
            },
        ];
        const size = [this.props.width, this.props.height];

        var margin = {left: 40, bottom: 40}, width = size[0] - margin.left, height = size[1] - margin.bottom

        const node = this.node
        const values = data.map(d => d.value)
        const frequencies = data.map(d => d.frequency)


        const maxFreq = d3.max(frequencies)

        const yScale = d3.scaleLinear()
            .domain([0, maxFreq])
            .range([height, 0])

        const xScale = d3.scaleBand()
            .domain(values)
            .range([0, width])

        const barplot = d3.select(node)

        barplot.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'none')

        barplot.append('g')
            .attr('transfom', 'translate(' + margin.left + ", 0)")
        .selectAll('rects')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d.value) + 10)
            .attr('y', d => yScale(d.frequency))
            .attr('width', xScale.bandwidth()*.95)
            .attr('height', d => yScale(0) - yScale(d.frequency))
            .attr('fill', 'blue')
            .attr('id', d => d.value)
        
        barplot.append('g')
            .attr('id', 'bottomaxis')
            .call(d3.axisBottom(xScale))
            .attr('transform', 'translate(' + xScale.bandwidth()*.5 + ',' + height*1.55 + ')')
    }

    render() {
        return <svg ref={node => this.node = node}> </svg>
    }
}

export default BarChart;