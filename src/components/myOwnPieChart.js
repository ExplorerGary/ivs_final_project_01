// // This is also a javascript stuff: a pie Chart

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const SENTIMENT_LABELS = ['Disgusted', 'Dissatisfied', 'Indifferent', 'Satisfied', 'Delighted'];
const SENTIMENT_RANGES = [
  [0.0, 0.2],
  [0.2, 0.4],
  [0.4, 0.6],
  [0.6, 0.8],
  [0.8, 1.0],
];

function OwnPieChart({ dataAll, sentimentIndex }) {
  const ref = useRef();

  useEffect(() => {
    if (!dataAll) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const width = 300;
    const height = 200;
    const radius = 70;

    const pieCenterX = 200;
    const pieCenterY = 110;

    const g = svg.append('g')
      .attr('transform', `translate(${pieCenterX}, ${pieCenterY})`);

    // 计算每个情绪的数量
    const sentimentCounts = Array(SENTIMENT_LABELS.length).fill(0);
    dataAll.forEach(d => {
      const value = d.sentiment;
      for (let i = 0; i < SENTIMENT_RANGES.length; i++) {
        const [min, max] = SENTIMENT_RANGES[i];
        if (value >= min && value < max) {
          sentimentCounts[i] += 1;
          break;
        }
      }
    });

    const pie = d3.pie().value(d => d)(sentimentCounts);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const colorScale = d3.scaleSequential()
      .domain([SENTIMENT_LABELS.length - 1, 0])
      .interpolator(d3.interpolateBlues);

    // 绘制饼图
    g.selectAll('path')
      .data(pie)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => i === sentimentIndex ? '#ffcc80' : colorScale(i))
      .attr('stroke', (d, i) => i === sentimentIndex ? 'orange' : 'gray')
      .attr('stroke-width', 2);

    // 左上角 Legend
    const legend = svg.append('g')
      .attr('transform', `translate(10, 10)`);

    SENTIMENT_LABELS.forEach((label, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 18})`);

      legendRow.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', i === sentimentIndex ? '#ffcc80' : colorScale(i))
        .attr('stroke', i === sentimentIndex ? 'orange' : 'gray')
        .attr('stroke-width', 1);

      legendRow.append('text')
        .attr('x', 18)
        .attr('y', 10)
        .attr('fill', 'black')
        .style('font-size', '10px')
        .text(label);
    });

  }, [dataAll, sentimentIndex]);

  return <svg ref={ref} width={300} height={200} />;
}

export default OwnPieChart;

