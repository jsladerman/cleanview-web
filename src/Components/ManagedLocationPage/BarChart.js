import React, { Component } from "react";
import * as d3 from "d3";
import "./css/BarChart.css";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.createBarChart = this.createBarChart.bind(this);
  }

  componentDidMount() {
    this.createBarChart();
  }

  componentDidUpdate() {
    this.createBarChart();
  }

  createBarChart() {
    const data = [
      {
        value: 0,
        frequency: 0.02,
      },
      {
        value: 0.5,
        frequency: 0.1,
      },
      {
        value: 1,
        frequency: 0.1,
      },
      {
        value: 1.5,
        frequency: 0.1,
      },
      {
        value: 2,
        frequency: 0.05,
      },
      {
        value: 2.5,
        frequency: 0.2,
      },
      {
        value: 3,
        frequency: 0.05,
      },
      {
        value: 3.5,
        frequency: 0.1,
      },
      {
        value: 4,
        frequency: 0.1,
      },
      {
        value: 4.5,
        frequency: 0.1,
      },
      {
        value: 5,
        frequency: 0.18,
      },
    ];

    var margin = { left: 20, bottom: 60, top: 40 },
      width = this.props.width - margin.left,
      height = this.props.height - margin.bottom - margin.top;

    const node = this.node;
    const values = data.map((d) => d.value);
    const frequencies = data.map((d) => d.frequency);
    const maxFreq = d3.max(frequencies);

    const yScale = d3.scaleLinear().domain([0, maxFreq]).range([height, 0]);

    const xScale = d3.scaleBand().domain(values).range([0, width]);

    const barplot = d3
      .select(node)
      .attr("transform", "translate(" + 5 + "," + 0 + ")");

    var div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip-barchart")
      .style("opacity", 0);

    barplot
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .selectAll("rects")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.value))
      .attr("y", (d) => yScale(d.frequency))
      .attr("width", xScale.bandwidth() * 0.95)
      .attr("height", (d) => yScale(0) - yScale(d.frequency))
      .attr("fill", this.props.color)
      .attr("id", (d) => "bar" + d.value)
      .on("mouseover", (d, i, g) => {
        d3.select(g[i]).attr("stroke", "black").attr("stroke-width", "2px");

        div.transition().duration(20).style("opacity", 1);

        div
          .html(d.frequency * 100 + "%")
          .style("left", d3.event.pageX + 10 + "px")
          .style("top", d3.event.pageY - 15 + "px");
      })
      .on("mouseout", (_, i, g) => {
        d3.select(g[i]).attr("stroke", "none").attr("stroke-width", "0px");

        div.transition().duration(20).style("opacity", 0);
      });

    barplot
      .append("g")
      .attr("id", "barplotbottomaxis")
      .call(d3.axisBottom(xScale).tickValues(["0", "1", "2", "3", "4", "5"]))
      .attr(
        "transform",
        "translate(" + (margin.left - 0.75) + "," + (margin.top + height) + ")"
      );

    barplot
      .append("g")
      .attr("id", "barplotleftaxis")
      .call(d3.axisLeft(yScale))
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    barplot
      .append("text")
      .attr("id", "barplottitle")
      .attr("x", margin.left + width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", this.props.titleSize)
      .text(this.props.titleText);

    barplot
      .append("text")
      .attr("id", "barplotxaxistitle")
      .attr("x", margin.left + width / 2)
      .attr("y", height + margin.top + margin.bottom / 2 + 10)
      .attr("text-anchor", "middle")
      .text("Customer Rating");
  }

  render() {
    return (
      <svg
        ref={(node) => (this.node = node)}
        height={this.props.height}
        width={this.props.width}
      >
        {" "}
      </svg>
    );
  }
}

export default BarChart;
