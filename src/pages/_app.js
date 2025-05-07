import "@/styles/globals.css";

import React from 'react';
import * as d3 from "d3";
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import OwnBarChart from '@/components/myOwnBarChart';
import OwnPieChart from '@/components/myOwnPieChart';

// const csvPath = '/data/Nezha2_fin.csv';
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
  const [gender, setGender] = React.useState(0); // Added gender state
  const dataAll = useData(csvPath);
  const SENTIMENT_LABELS = ['Disgusted', 'Dissatisfied', 'Indifferent', 'Satisfied', 'Delighted'];
  const SENTIMENT_RANGES = [
    [0.0, 0.2],
    [0.2, 0.4],
    [0.4, 0.6],
    [0.6, 0.8],
    [0.8, 1.0],
  ];
  if (!dataAll) return <pre>📦 正在加载数据...</pre>;

  const handleSentimentChange = (e) => {
    const newIndex = +e.target.value;
    setSentimentIndex(newIndex);
    setHasFiltered(true);
  };

  const handleGenderChange = (newGender) => { // Handler for gender button click
    setGender(newGender);
  };

  const getWordCloudImagePath = (gender) => {
    if (hasFiltered && typeof sentimentIndex === 'number') {
      return `/data/neo_wordcloud/Gender${gender}Sentiment${sentimentIndex}.png`;
    } else {
      return `/data/neo_wordcloud/Gender${gender}SentimentG.png`;
    }
  };

  let filteredData = dataAll;
  if (hasFiltered) {
    const [min, max] = SENTIMENT_RANGES[sentimentIndex];
    filteredData = dataAll.filter(d => d.sentiment >= min && d.sentiment < max);
  }

  return (
    <Container fluid className="p-4">
      {/* Top row: Title and sliding bar */}
      <Row className="mb-2">
        <Col>
          <h1>Sentiment Analysis on: Nezha: The Devil Boy Churns the Sea</h1>
        </Col>
      </Row>
      
      {/* Top Concerns and Geo Distribution + Sentiment slider */}
      <Row className="mb-4">
        <Col>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>Top Concerns and Geo Distribution</p>
          <p style={{ fontSize: '1rem', color: '#777' }}>
            Now displaying: {sentimentIndex !== "General" ? SENTIMENT_LABELS[sentimentIndex] : "General"}
          </p>
        </Col>
        {/* Sentiment Range Slider */}
        <Col xs={12} md={2} className="d-flex align-items-center">
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
              transform: '0',
              width: '300px',
              maxWidth: '200%',
            }}
          />
        </Col>
      </Row>

      <Row style={{ height: '80vh' }}>
        {/* Middle column: Pie and Bar charts */}
        <Col xs={12} md={3} className="d-flex flex-column gap-3" style={{ minWidth: '150px' }}>
          <div style={{ flex: 1 }}>
            <OwnBarChart filteredData={filteredData} />
          </div>
          <div style={{ flex: 1 }}>
            <OwnPieChart dataAll={dataAll} sentimentIndex={sentimentIndex} />
          </div>
        </Col>

        {/* Middle column2: GeoMap */}
        <Col xs={12} md={4} className="d-flex flex-column gap-3" style={{ minWidth: '550px' }}>
          <div style={{ flex: 10 }}>
            <img 
              src="https://lh6.googleusercontent.com/proxy/yulo1A6L-rFNsolVhTJQTf5eMdcS90JNQcXe8QG9O_NhLrXslg2kN-boRkP_gb0XFHMmoQcs1LdNv5xSeEvbEq3PC3iyim8"
              style={{ background: '#ccc', width: '100%', height: '500px' }}
              alt="GeoMap"
            />
          </div>
        </Col>

        {/* Right column: Word cloud with gender selection */}
        <Col xs={12} md={4} className="d-flex flex-column gap-3" style={{ minWidth: '100px' }}>
          {/* Gender Buttons */}
          <div style={{ marginBottom: '10px' }}>
            <Button onClick={() => handleGenderChange(0)} variant={gender === 0 ? 'primary' : 'secondary'}>Male</Button>
            <Button onClick={() => handleGenderChange(1)} variant={gender === 1 ? 'primary' : 'secondary'}>Female</Button>
            <Button onClick={() => handleGenderChange(2)} variant={gender === 2 ? 'primary' : 'secondary'}>Other</Button>
          </div>

          {/* Word cloud */}
          <div style={{ flex: 10 }}>
            <img
              src={getWordCloudImagePath(gender)} // Using gender in the path
              alt="WordCloud"
              style={{ background: '#ccc', width: '100%', maxHeight: '600px', height: 'auto' }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Charts;
