import React, { Component } from "react";
import * as d3 from "d3";
import "../css/SurveyResponseFrequencyChart.css";
import { max } from "d3";

class SurveyResponseFrequencyChart extends Component {
  constructor(props) {
    super(props);
    this.createChart = this.createChart.bind(this);
    console.log("hey")
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    const data = this.props.data;

    const margin = { left: 80, bottom: 20, top: 40 , right: 10},
      width = this.props.width - margin.left - margin.right,
      height = this.props.height - margin.bottom - margin.top;

    const node = this.node;
    const timePeriods = data.map((d) => d.label);
    const responseCounts = data.map((d) => d.numResponses);

    // vertical scale
    const timePeriodScale = d3
      .scaleBand()
      .domain(timePeriods.reverse())
      .range([height, 0]);

    // horizontal scale
    const responseCountScale = d3
      .scaleLinear()
      .domain([0, d3.max(responseCounts)])
      .range([0, width]);

    const horizontalBarPlot = d3
      .select(node)
      .attr("transform", "translate(" + 5 + "," + 0 + ")");

    var div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip-barchart")
      .style("opacity", 0);

    horizontalBarPlot
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .selectAll("rects")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d) => timePeriodScale(d.label))
      .attr("width", (d) => responseCountScale(d.numResponses))
      .attr("height", timePeriodScale.bandwidth()*.75)
      .attr("fill", this.props.color)
      .on("mouseover", (d, i, g) => {
        d3.select(g[i]).attr("stroke", "black").attr("stroke-width", "2px");

        div.transition().duration(20).style("opacity", 1);

        div
          .html(d.numResponses + " survey responses per day")
          .style("left", d3.event.pageX + 10 + "px")
          .style("top", d3.event.pageY - 15 + "px");
      })
      .on("mouseout", (_, i, g) => {
        d3.select(g[i]).attr("stroke", "none").attr("stroke-width", "0px");
        div.transition().duration(20).style("opacity", 0);
      });

    horizontalBarPlot.append("g")
    .attr("id", "horizontalbarplotleftaxis")
    .call(d3.axisLeft(timePeriodScale))
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const tickWidth = Math.round(d3.max(responseCounts)/5)
    horizontalBarPlot.append("g")
    .attr("id", 'horizontalbarplotbottomaxis')
    .call(d3.axisBottom(responseCountScale).tickValues([tickWidth*1, tickWidth*2, tickWidth*3, tickWidth*4, tickWidth*5]))
    .attr(
        "transform",
        "translate(" + (margin.left - 0.75) + "," + (margin.top + height) + ")"
      );

      horizontalBarPlot
      .append("text")
      .attr("id", "barplottitle")
      .attr("x", margin.left + width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", this.props.titleSize)
      .text(this.props.titleText);

  }

  render() {
    return (
      <svg
        ref={(node) => (this.node = node)}
        height={this.props.height}
        width={this.props.width}
      >
      </svg>
    );
  }
}

export default SurveyResponseFrequencyChart;