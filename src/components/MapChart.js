'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const MapChart = ({ data, sentimentIndex, style }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);

      // 动态加载 china.json
      fetch('/china.json')
        .then(res => res.json())
        .then(chinaGeoJson => {
          echarts.registerMap('China', chinaGeoJson);

          // 计算饱和度（0-100%）
          const getSaturation = (value, maxValue) => {
            return Math.min((value / maxValue) * 100, 100);
          };

          // 初始状态：平均情感评分
          let mapData = data.map(item => ({
            name: item.province,
            value: item.avgSentiment,
          }));
          let maxValue = Math.max(...mapData.map(d => d.value)) || 1;

          // 滑块过滤：评论比例
          if (sentimentIndex !== 'General') {
            mapData = data.map(item => ({
              name: item.province,
              value: item.sentimentCounts[sentimentIndex] / (item.totalComments || 1),
            }));
            maxValue = Math.max(...mapData.map(d => d.value)) || 1;
          }

          // ECharts 配置
          const option = {
            title: {
              text: '中国地图 - 情感分布',
              left: 'center',
            },
            tooltip: {
              trigger: 'item',
              formatter: params => {
                const value = params.value ? params.value.toFixed(2) : '无数据';
                return `${params.name}: ${value}`;
              },
            },
            visualMap: {
              min: 0,
              max: maxValue,
              calculable: true,
              inRange: {
                color: ['hsl(0, 0%, 50%)', 'hsl(0, 100%, 50%)'], // 与 generatemap.js 颜色同步
              },
              text: ['高', '低'],
              left: '10px',
              bottom: '10px',
            },
            series: [
              {
                name: '情感分布',
                type: 'map',
                map: 'China',
                label: {
                  show: true,
                  formatter: '{b}', // 显示省份名称
                },
                data: mapData,
              },
            ],
          };

          chartInstance.current.setOption(option);
        })
        .catch(err => console.error('加载 china.json 失败:', err));
    }

    return () => {
      chartInstance.current?.dispose();
    };
  }, [data, sentimentIndex]);

  return <div ref={chartRef} style={style} />;
};

export default MapChart;