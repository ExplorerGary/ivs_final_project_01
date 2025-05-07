import React from 'react';
import * as d3 from "d3";
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import OwnBarChart from '@/components/myOwnBarChart';
import OwnPieChart from '@/components/myOwnPieChart';

const csvPath = '/data/Nezha2_neo_building_clouds.csv';

function useData(csvPath) {
  const [dataAll, setData] = React.useState(null);
  React.useEffect(() => {
    d3.csv(csvPath).then(data => {
      data.forEach(d => {
        d.comment_id = +d.comment_id;
        d.score = +d.score;
        d.sentiment = +d.sentiment;
        d.gender = +d.gender;
      });
      setData(data);
    });
  }, []);
  return dataAll;
}

const Charts = () => {
  const [sentimentIndex, setSentimentIndex] = React.useState("General");
  const [hasFiltered, setHasFiltered] = React.useState(false);
  const [gender, setGender] = React.useState(0);
  const dataAll = useData(csvPath);
  const colorBarRef = React.useRef(null);
  const SENTIMENT_LABELS = ['Disgusted', 'Dissatisfied', 'Indifferent', 'Satisfied', 'Delighted'];
  const SENTIMENT_RANGES = [
    [0.0, 0.2],
    [0.2, 0.4],
    [0.4, 0.6],
    [0.6, 0.8],
    [0.8, 1.0],
  ];

  // 绘制 continuous colormap
  React.useEffect(() => {
    if (colorBarRef.current && dataAll) {
      const svg = d3.select(colorBarRef.current);
      svg.selectAll("*").remove(); // 清除旧内容

      const width = 300;
      const height = 30;
      const margin = { top: 10, bottom: 20, left: 40, right: 20 };

      // 定义颜色比例尺，与 generatemap.js 一致
      const colorScale = d3.scaleSequential(d3.interpolateHsl("hsl(0, 0%, 50%)", "hsl(0, 100%, 50%)"))
        .domain([0, 1]);

      // 创建颜色条数据
      const n = 100; // 分段数
      const colorData = d3.range(n).map(i => i / (n - 1));

      // 绘制颜色条
      svg.attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom);

      const g = svg.append("g")
                   .attr("transform", `translate(${margin.left},${margin.top})`);

      g.selectAll("rect")
       .data(colorData)
       .enter()
       .append("rect")
       .attr("x", (d, i) => i * (width / n))
       .attr("y", 0)
       .attr("width", width / n)
       .attr("height", height)
       .attr("fill", d => colorScale(d));

      // 添加轴
      const xScale = d3.scaleLinear()
                       .domain([0, 1])
                       .range([0, width]);

      const xAxis = d3.axisBottom(xScale)
                      .ticks(5)
                      .tickFormat(d3.format(".1f"));

      g.append("g")
       .attr("transform", `translate(0, ${height})`)
       .call(xAxis);

      // 添加标签
      svg.append("text")
         .attr("x", margin.left)
         .attr("y", margin.top + height + margin.bottom - 5)
         .attr("text-anchor", "start")
         .style("font-size", "12px")
         .text("低");

      svg.append("text")
         .attr("x", width + margin.left)
         .attr("y", margin.top + height + margin.bottom - 5)
         .attr("text-anchor", "end")
         .style("font-size", "12px")
         .text("高");
    }
  }, [dataAll, sentimentIndex]);

  const handleSentimentChange = (e) => {
    const newIndex = +e.target.value;
    setSentimentIndex(newIndex);
    setHasFiltered(true);
  };

  const handleGenderChange = (newGender) => {
    setGender(newGender);
  };

  const getWordCloudImagePath = (gender) => {
    if (hasFiltered && typeof sentimentIndex === 'number') {
      return `/data/neo_wordcloud/Gender${gender}Sentiment${sentimentIndex}.png`;
    } else {
      return `/data/neo_wordcloud/Gender${gender}SentimentG.png`;
    }
  };

  const getGeoMapImagePath = () => {
    if (hasFiltered && typeof sentimentIndex === 'number') {
      return `/data/maps/map_${sentimentIndex}.png`;
    } else {
      return `/data/maps/map_general.png`;
    }
  };

  if (!dataAll) return <pre>📦 正在加载数据...</pre>;

  let filteredData = dataAll;
  if (hasFiltered) {
    const [min, max] = SENTIMENT_RANGES[sentimentIndex];
    filteredData = dataAll.filter(d => d.sentiment >= min && d.sentiment < max);
  }

  return (
    <Container fluid className="p-4" style={{ backgroundColor: 'rgba(255, 235, 235, 0.5)' }}>
      <Row className="mb-2">
        <Col>
          <h1>Sentiment Analysis on: Nezha: The Devil Boy Churns the Sea</h1>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>Top Concerns and Geo Distribution</p>
        </Col>
      </Row>
      <Row style={{ height: '80vh' }}>

        {/* Left column: sliding bar */}
        <Col xs={12} md={1} className="d-flex flex-column align-items-center" style={{ minWidth: '100px', height: '100%' }}>
          <h5 className="mb-3">{sentimentIndex !== "General" ? SENTIMENT_LABELS[sentimentIndex] : "General"}</h5>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
            <img src="/images/hate.png" alt="Hate" style={{ width: '70px', height: '70px' }} />
            <img src="/images/love.png" alt="Love" style={{ width: '70px', height: '70px' }} />
          </div>
          <input
            type="range"
            min={0}
            max={4}
            value={sentimentIndex ?? 0}
            onChange={handleSentimentChange}
            className="form-range"
            style={{
              writingMode: 'bt-lr',
              height: '100%',
              transform: 'rotate(270deg)',
              width: '500px',
              maxWidth: '200%'
            }}
          />
        </Col>

        {/* Middle column: Pie and Bar charts */}
        <Col xs={12} md={3} className="d-flex flex-column gap-3" style={{ minWidth: '200px' }}>
          <div style={{ height: '350px' }}>
            <OwnBarChart filteredData={filteredData} />
            <p style={{ textAlign: 'center', fontSize: '0.9rem', margin: '10px 0 0 0', color: '#333' }}>
              {sentimentIndex === "General"
                ? "Gender distribution of all comments"
                : `Gender distribution of viewers rating the film as ${sentimentIndex === 0 ? "very bad" : sentimentIndex === 1 ? "bad" : sentimentIndex === 2 ? "average" : sentimentIndex === 3 ? "good" : "very satisfying"}`}
            </p>
          </div>
          <div style={{ height: '350px' }}>
            <OwnPieChart dataAll={dataAll} sentimentIndex={sentimentIndex} />
            <p style={{ textAlign: 'center', fontSize: '0.9rem', margin: '10px 0 0 0', color: '#333' }}>
              {sentimentIndex === "General"
                ? "Distribution of different sentiments"
                : `Distribution of different sentiments (the highlighted portion reflects the current sentiment)`}
            </p>
          </div>
        </Col>

        {/* Middle column2: GeoMap */}
        <Col xs={12} md={4} className="d-flex flex-column gap-3" style={{ minWidth: '200px' }}>
          <div style={{ flex: 2 }}>
            <p style={{ textAlign: 'center', fontSize: '1rem', margin: '0 0 10px 0', color: '#333' }}>
              {sentimentIndex === "General"
                ? "Average audience sentiment by province in China"
                : `Proportion of viewers rating the film as ${sentimentIndex === 0 ? "very bad" : sentimentIndex === 1 ? "bad" : sentimentIndex === 2 ? "average" : sentimentIndex === 3 ? "good" : "very satisfying"} by province`}
            </p>
            <img 
              src={getGeoMapImagePath()}
              style={{ background: '#ccc', width: '100%', height: 'auto' }}
              alt="GeoMap"
            />
            <svg ref={colorBarRef} style={{ display: 'block', margin: '10px auto' }}></svg>
          </div>
        </Col>

        {/* Right column: Word cloud with gender selection */}
        <Col xs={12} md={4} className="d-flex flex-column gap-3" style={{ minWidth: '300px' }}>
          {/* Gender Buttons */}
          <div style={{ marginBottom: '10px' }}>
            <Button onClick={() => handleGenderChange(0)} variant={gender === 0 ? 'primary' : 'secondary'}>Male</Button>
            <Button onClick={() => handleGenderChange(1)} variant={gender === 1 ? 'primary' : 'secondary'}>Female</Button>
            <Button onClick={() => handleGenderChange(2)} variant={gender === 2 ? 'primary' : 'secondary'}>Other</Button>
          </div>

          {/* Word cloud */}
          <div style={{ flex: 1 }}>
            <img
              src={getWordCloudImagePath(gender)}
              alt="WordCloud"
              style={{ background: '#ccc', width: '100%', maxHeight: '300px' }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Charts;