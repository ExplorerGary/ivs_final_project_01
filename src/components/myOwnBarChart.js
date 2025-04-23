//This is another javascript project, aiming to handle the barchart part.
// we receive the data from parent component and then we will draw the barchart using d3.js
// getting all the packages we need
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function OwnBarChart(props) {
  const { filteredData } = props;
  console.log("what I got:", filteredData)
  const ref = useRef();
  const genderMap = {
    0: 'Unknown',
    1: 'Male',
    2: 'Female'
  };
    // 对 data 进行性别分类并统计每类数量
  const genderCounts = d3.rollups(
      filteredData,
      v => v.length,              // 每类的数量
      d => genderMap[d.gender] ?? '其他'  // 性别映射
    ).map(([gender, count]) => ({ gender, count }));
  
  const width = 300;
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  console.log(filteredData)
  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); 
    let tooltip = d3.select("body").append("div")
    .attr("class", "BarTooltip")
    .style("opacity", 0)
    .style("background-color", "gray")
    .style('color', 'white')
    .style("position", "absolute");
    const xScale = d3.scaleBand()
      .domain(genderCounts.map(d => d.gender))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(genderCounts, d => d.count)]).nice()
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    svg.selectAll('.bar')
      .data(genderCounts)
      .enter()
      .append('rect')
      .attr('class', d => `bar gender-${d.gender}`)
      .attr('x', d => xScale(d.gender))
      .attr('y', d => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', d => yScale(0) - yScale(d.count))
      .style("fill", 'steelblue')
      .style("stroke", "black")
      .style("stroke-width", 2)
      .on("mouseover", (event, d) => {
        d3.selectAll(`.gender-${d.gender}`).style('fill', 'red');
        //now adding a tooltip:
        let the_tooltip = d3.select(".BarTooltip")
        the_tooltip.style("opacity", 0.8)
        .html(`${d.gender}: ${d.count}`)  
        .style("top", (event.pageY + 5) + "px")
        .style("left", (event.pageX + 5) + "px");
      })
      .on("mouseout", (event, d) => {
        d3.selectAll(`.gender-${d.gender}`).style('fill', 'steelblue');
        let the_tooltip = d3.select(".BarTooltip")
        //remove the tooltip
        the_tooltip.style("opacity", 0)
        .html("")
      });



  }, [filteredData]);

  return <svg ref={ref} width={width} height={height} />;
}

export default OwnBarChart;

