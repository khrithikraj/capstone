// Components/Graph/Graph.js

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = () => {
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    // Fetching expense data from backend
    axios.get('http://localhost:5000/api/v1/get-expenses')
      .then(response => {
        setExpensesData(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  const chartData = {
    labels: [], // Categories
    datasets: [
      {
        label: 'Expenditure',
        data: [], // Amount per category
        backgroundColor: 'rgba(255, 99, 132, 0.5)', // Set your preferred color
      },
    ],
  };

  // Processing the expense data to group by category
  expensesData.forEach(expense => {
    const categoryIndex = chartData.labels.indexOf(expense.category);
    if (categoryIndex === -1) {
      chartData.labels.push(expense.category);
      chartData.datasets[0].data.push(expense.amount);
    } else {
      chartData.datasets[0].data[categoryIndex] += expense.amount;
    }
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Expenditure by Category</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default Graph;
