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
                frequency: 0.02
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
                frequency: 0.18
            },
        ];
        
        var margin = {left: 20, bottom: 40, top: 40}, 
            width = (this.props.width - margin.left),
            height = this.props.height - margin.bottom - margin.top

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
                            .attr('transform', 'translate(' + 5 + ',' + 0 + ')')


        barplot.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .selectAll('rects')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d.value))
            .attr('y', d => yScale(d.frequency))
            .attr('width', xScale.bandwidth()*.95)
            .attr('height', d => yScale(0) - yScale(d.frequency))
            .attr('fill', this.props.color)
            .attr('id', d => d.value);
        
        barplot.append('g')
            .attr('id', 'barplotbottomaxis')
            .call(d3.axisBottom(xScale))
            .attr('transform', 'translate(' + (margin.left - .75) + ',' + (margin.top + height) + ')')

        barplot.append('g')
            .attr('id', 'barplotleftaxis')
            .call(d3.axisLeft(yScale))
            .attr('transform', 'translate(' + (margin.left) + ',' + margin.top + ')')

        barplot.append('text')
                .attr('x', (margin.left + width/2))
                .attr('y', (margin.top/2))
                .attr('text-anchor', 'middle')
                .style("font-size", this.props.titleSize)
                .text(this.props.titleText)
    }

    render() {
        return <svg ref={node => this.node = node} height={this.props.height} width={this.props.width}> </svg>
    }
}

export default BarChart;