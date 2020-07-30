import React, { Component } from "react";
import * as d3 from "d3";
import "../css/BinaryPieChart.css";

class BinaryPieChart extends Component {
  constructor(props) {
    super(props);
    this.createPieChart = this.createPieChart.bind(this);
  }

  componentDidMount() {
    this.createPieChart();
  }

  componentDidUpdate() {
    this.createPieChart();
  }

  createPieChart() {
    const margin = this.props.margin,
      width = this.props.width,
      height = this.props.height,
      arcGrowth = 5,
      radius = Math.min(width, height) / 2 - margin;

    const data = { Yes: this.props.yesPct, No: 1 - this.props.yesPct };

    const pie = d3.pie().value((d) => d.value);

    function arcGenerator(r) {
      return d3.arc().innerRadius(0).outerRadius(r);
    }

    function colorSelector(s) {
      return s === "Yes" ? "#23C9AD" : "#333333";
    }

    const data_ready = pie(d3.entries(data));

    // Tooltip Creation
    var div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip-piechart")
      .style("opacity", 0);

    // Pie Chart Creation
    const node = this.node;
    const piechart = d3.select(node);

    piechart
      .append("g")
      .selectAll("slices")
      .data(data_ready)
      .enter()
      .append("path")
      .attr(
        "transform",
        "translate(" + (radius + margin) + "," + (radius + margin) + ")"
      )
      .attr("d", arcGenerator(radius))
      .attr("fill", (d) => colorSelector(d.data.key))
      .attr("stroke", (d) => colorSelector(d.data.key))
      .attr("stroke-width", "1px")
      .attr("opacity", 1)
      .on("mouseover", (d, i, g) => {
        d3.select(g[i])
          .attr("d", arcGenerator(radius + arcGrowth))
          .attr("stroke", colorSelector(d.data.key))
          .attr("stroke-width", "2px");

        div.transition().duration(20).style("opacity", 1);

        div
          .html(
            (d.data.value * 100).toFixed(0) +
              "% of people " +
              (d.data.key.toLowerCase() === "yes" ? this.props.yesLabel : this.props.noLabel)
          )
          .style("left", d3.event.pageX + 10 + "px")
          .style("top", d3.event.pageY - 15 + "px");
      })
      .on("mouseout", (_, i, g) => {
        d3.select(g[i])
          .attr("d", arcGenerator(radius))
          .attr("stroke-width", "1px");

        div.transition().duration(20).style("opacity", 0);
      });
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

export default BinaryPieChart;
