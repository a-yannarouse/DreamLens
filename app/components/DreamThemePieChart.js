import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DreamThemePieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No dream theme data available</p>;
  }

  const themeCounts = data.reduce((acc, dream) => {
    if (Array.isArray(dream.theme)) {
      dream.theme.forEach(theme => {
        acc[theme] = (acc[theme] || 0) + 1;
      });
    } else if (typeof dream.theme === 'string') {
      acc[dream.theme] = (acc[dream.theme] || 0) + 1;
    }
    return acc;
  }, {});

  const chartLabels = Object.keys(themeCounts);
  const chartData = Object.values(themeCounts);

  const pieData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor: [
          '#4a90e2', '#f6546a', '#50e3c2', '#f8e71c', '#7ed321',
          '#bd10e0', '#50e3c2', '#e86452', '#9013fe', '#4a4a4a'
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc, cur) => acc + cur, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div>
      <Pie data={pieData} options={options} />
      {themeCounts['Analysis Pending'] && (
        <p style={{ color: 'orange', marginTop: '10px' }}>
          Some dreams are still being analyzed. Check back later for complete results.
        </p>
      )}
    </div>
  );
};

export default DreamThemePieChart;