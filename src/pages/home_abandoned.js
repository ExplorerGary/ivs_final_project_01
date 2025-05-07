
import React from 'react';
import * as d3 from "d3";
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import OwnBarChart from '@/components/myOwnBarChart';
import OwnPieChart from '@/components/myOwnPieChart';

// const csvPath = '/data/Nezha2_fin.csv';
const csvPath = '/data/Nezha2_neo_building_clouds.csv'

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

// const Charts = () => {
//   const [sentimentIndex, setSentimentIndex] = React.useState("General"); // 初始情感 index（可任意）
//   const [hasFiltered, setHasFiltered] = React.useState(false);   // 是否已手动选择情感区间
//   const dataAll = useData(csvPath);
//   const SENTIMENT_LABELS = ['Disgusted', 'Dissatisfied', 'Indifferent', 'Satisfied', 'Delighted'];
//   const SENTIMENT_RANGES = [
//     [0.0, 0.2],
//     [0.2, 0.4],
//     [0.4, 0.6],
//     [0.6, 0.8],
//     [0.8, 1.0],
//   ];
//   if (!dataAll) return <pre>📦 正在加载数据...</pre>;

//   // 滑动条触发函数：设置情感 index，并标记为已过滤
//   const handleSentimentChange = (e) => {
//     const newIndex = +e.target.value;
//     setSentimentIndex(newIndex);
//     setHasFiltered(true); // 标记用户已操作
//   };
// //按情绪取得
//   const getWordCloudImagePath0 = () => {
//     if (hasFiltered && typeof sentimentIndex === 'number') {
//       return `/data/neo_wordcloud/Gender0Sentiment${sentimentIndex}.png`;
//     } else {
//       return `/data/neo_wordcloud/Gender0SentimentG.png`;
//     }
//   };
//   const getWordCloudImagePath1 = () => {
//     if (hasFiltered && typeof sentimentIndex === 'number') {
//       return `/data/neo_wordcloud/Gender1Sentiment${sentimentIndex}.png`;
//     } else {
//       return `/data/neo_wordcloud/Gender1SentimentG.png`;
//     }
//   };
//   const getWordCloudImagePath2 = () => {
//     if (hasFiltered && typeof sentimentIndex === 'number') {
//       return `/data/neo_wordcloud/Gender2Sentiment${sentimentIndex}.png`;
//     } else {
//       return `/data/neo_wordcloud/Gender2SentimentG.png`;
//     }
//   };


//   // 决定过滤逻辑
//   let filteredData = dataAll;
//   if (hasFiltered) {
//     const [min, max] = SENTIMENT_RANGES[sentimentIndex];
//     filteredData = dataAll.filter(d => d.sentiment >= min && d.sentiment < max);
//     console.log(`✅ 当前选择的情感区间: [${min}, ${max})`);
//     console.log(`✅ 当前选择的情感idx： ${sentimentIndex} `);
//   } else {
//     console.log(`🌐 初始状态，显示全部数据，共 ${dataAll.length} 条`);
//     console.log(`✅ 当前选择的情感idx： ${sentimentIndex} `);
//   }

//   console.log(filteredData); // 控制台输出最终使用的数据

//   return (
//     <Container fluid className="p-4">
//       {/* 顶部标题 */}
//       <Row className="mb-2">
//         <Col>
//           <h1>Sentiment Analysis on: Nezha: The Devil Boy Churns the Sea</h1>
//         </Col>
//       </Row>
//       <Row className="mb-4">
//         <Col>
//           <p style={{ fontSize: '1.2rem', color: '#555' }}>Top Concerns and Geo Distribution</p>
//         </Col>
//       </Row>
  
//       <Row style={{ height: '80vh' }}>

//         {/* 左侧滑动条 */}
//         <Col xs={12} md={1} className="d-flex flex-column align-items-center" style={{ minWidth: '100px', height: '100%' }}>
//           <h5 className="mb-3">{sentimentIndex !== "General" ? SENTIMENT_LABELS[sentimentIndex] : "General"}</h5>
//           <input
//             type="range"
//             min={0}
//             max={4}
//             value={sentimentIndex ?? 0}
//             onChange={handleSentimentChange}
//             className="form-range"
//             style={{
//               writingMode: 'bt-lr',
//               height: '100%',         // 滑动条高度填满父容器
//               transform: 'rotate(270deg)',
//               width: '500px',          // 固定宽度
//               maxWidth: '200%'        // 最大宽度 100%
//             }}
//           />
//         </Col>

//         {/* 中间三图（垂直） */}
//         <Col xs={12} md={3} className="d-flex flex-column gap-3" style={{ minWidth: '200px' }}>
//           <div style={{ flex: 2 }}>
//             <OwnBarChart filteredData={filteredData} />
//           </div>
//           <div style={{ flex: 2 }}>
//             <OwnPieChart dataAll={dataAll} sentimentIndex = {sentimentIndex}/>
//           </div>
//           <img
//             src={getWordCloudImagePath0()}
//             alt="WordCloud"
//             style={{ background: '#ccc', flex: 1, width: '100%', maxHeight: '300px' }}
//           />
//         </Col>

//         {/* 右侧图：1 大图 + 2 小图并排 */}
//         <Col xs={12} md={8} className="d-flex flex-column gap-3" style={{ minWidth: '300px' }}>
//           {/* 大图占两行 */}
//           <div style={{ flex: 3 }}>
//             <img
//                 src="https://lh6.googleusercontent.com/proxy/yulo1A6L-rFNsolVhTJQTf5eMdcS90JNQcXe8QG9O_NhLrXslg2kN-boRkP_gb0XFHMmoQcs1LdNv5xSeEvbEq3PC3iyim8"
//                 alt="Sample Map"
//                 style={{ background: '#ccc', flex: 2, width: '50%', maxHeight: '100%' }}
//               />
//           </div>

//         </Col>
//       </Row>
//     </Container>
//   );
// }

const Charts = () => {
  const [sentimentIndex, setSentimentIndex] = React.useState("General");
  const [hasFiltered, setHasFiltered] = React.useState(false);
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

  const getWordCloudImagePath0 = () => {
    if (hasFiltered && typeof sentimentIndex === 'number') {
      return `/data/neo_wordcloud/Gender0Sentiment${sentimentIndex}.png`;
    } else {
      return `/data/neo_wordcloud/Gender0SentimentG.png`;
    }
  };
  const getWordCloudImagePath1 = () => {
    if (hasFiltered && typeof sentimentIndex === 'number') {
      return `/data/neo_wordcloud/Gender1Sentiment${sentimentIndex}.png`;
    } else {
      return `/data/neo_wordcloud/Gender1SentimentG.png`;
    }
  };
  const getWordCloudImagePath2 = () => {
    if (hasFiltered && typeof sentimentIndex === 'number') {
      return `/data/neo_wordcloud/Gender2Sentiment${sentimentIndex}.png`;
    } else {
      return `/data/neo_wordcloud/Gender2SentimentG.png`;
    }
  };

  let filteredData = dataAll;
  if (hasFiltered) {
    const [min, max] = SENTIMENT_RANGES[sentimentIndex];
    filteredData = dataAll.filter(d => d.sentiment >= min && d.sentiment < max);
    console.log(`✅ 当前选择的情感区间: [${min}, ${max})`);
  }

  return (
    <Container fluid className="p-4">
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
          <div style={{ flex: 2 }}>
            <OwnBarChart filteredData={filteredData} />
          </div>
          <div style={{ flex: 2 }}>
            <OwnPieChart dataAll={dataAll} sentimentIndex={sentimentIndex} />
          </div>
        </Col>

        {/* Right column: World map and Word cloud */}
        <Col xs={12} md={4} className="d-flex flex-column gap-3" style={{ minWidth: '300px' }}>
          {/* World map */}
          <div style={{ flex: 2 }}>
            <img
              src="https://lh6.googleusercontent.com/proxy/yulo1A6L-rFNsolVhTJQTf5eMdcS90JNQcXe8QG9O_NhLrXslg2kN-boRkP_gb0XFHMmoQcs1LdNv5xSeEvbEq3PC3iyim8"
              alt="Sample Map"
              style={{ background: '#ccc', flex: 2, width: '50%', maxHeight: '100%' }}
            />
          </div>
        </Col>
        <Col xs={12} md={4} className="d-flex flex-column gap-3" style={{ minWidth: '300px' }}>

          {/* Word cloud */}
          <div style={{ flex: 1 }}>
            <img
              src={getWordCloudImagePath0()}
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
