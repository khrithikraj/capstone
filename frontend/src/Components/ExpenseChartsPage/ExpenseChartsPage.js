import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import expensesData from '../../Components/PredictionPage/predictions.json';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

function ExpenseChartsPage() {
  const [chartData, setChartData] = useState({
    monthlySpendingData: null,
    totalPerMonthData: null,
    categorySpendingData: null,
    highestCategoryData: null
  });
  const [selectedMonth, setSelectedMonth] = useState("1");

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const categories = [
    "Other", "Clothing", "Travelling", "Groceries", "Entertainment", "Health", "Subscriptions", "Takeaways"
  ];

  const filterDataByMonth = (data, month) => {
    return data.filter(item => parseInt(item.month.split("-")[1]) === parseInt(month));
  };

  // Process Monthly Spending Trends with one line per category
  const processMonthlySpendingData = (data) => {
    const categoryTotals = categories.reduce((acc, category) => {
      acc[category] = Array(12).fill(0); // Initialize an array of 12 zeros for each category (for months)
      return acc;
    }, {});

    data.forEach(expense => {
      const month = parseInt(expense.month.split("-")[1]) - 1;
      const category = expense.category;
      if (categoryTotals[category]) {
        categoryTotals[category][month] += parseInt(expense.prediction); // Convert prediction to int
      }
    });

    const datasets = Object.keys(categoryTotals).map(category => ({
      label: category,
      data: categoryTotals[category],
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      fill: false,
      tension: 0.1,
      pointRadius: 0,
      pointHoverRadius: 0,
    }));

    return {
      labels: monthNames,
      datasets: datasets,
    };
  };

  // Process Total Per Month Data
  const processTotalPerMonthData = (data) => {
    const monthlyTotals = Array(12).fill(0);
    data.forEach(expense => {
      const month = parseInt(expense.month.split("-")[1]) - 1;
      monthlyTotals[month] += parseInt(expense.prediction); // Convert prediction to int
    });
    return {
      labels: monthNames,
      datasets: [{
        label: 'Total Amount Per Month',
        data: monthlyTotals,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    };
  };

  // Process Category Spending Data (Pie chart)
  const processCategorySpendingData = (data) => {
    const categorySums = categories.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {});

    data.forEach(expense => {
      const { category, prediction } = expense;
      if (categories.includes(category)) {
        categorySums[category] += parseInt(prediction); // Convert prediction to int
      }
    });

    return {
      labels: categories,
      datasets: [{
        data: categories.map(category => categorySums[category]),
        backgroundColor: categories.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`),
        borderColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 1,
      }],
    };
  };

  // Process Highest Spending Category Per Month (Bar chart)
  const processHighestCategoryData = (data) => {
    const highestCategories = [];
  
    for (let month = 0; month < 12; month++) {
      const monthlyData = data.filter(expense => parseInt(expense.month.split("-")[1]) - 1 === month);
      
      const categorySums = categories.reduce((acc, category) => {
        acc[category] = 0;
        return acc;
      }, {});
  
      monthlyData.forEach(expense => {
        const { category, prediction } = expense;
        if (categories.includes(category)) {
          categorySums[category] += parseInt(prediction); // Convert prediction to int
        }
      });
  
      const highestCategory = Object.keys(categorySums).reduce((highest, category) => {
        return categorySums[category] > categorySums[highest] ? category : highest;
      }, categories[0]);
  
      highestCategories.push({
        month: monthNames[month],
        category: highestCategory,
        amount: categorySums[highestCategory],
      });
    }
  
    return {
      labels: highestCategories.map(item => item.month),
      datasets: [{
        label: 'Highest Spent Category Per Month',
        data: highestCategories.map(item => item.amount),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        datalabels: {
          display: true,
          anchor: 'end',
          align: 'top',
          font: {
            weight: 'bold',
            size: 12,
          },
          formatter: (value, context) => {
            const category = highestCategories[context.dataIndex].category;
            return category;
          },
        },
      }],
    };
  };

  useEffect(() => {
    const filteredDataByMonth = filterDataByMonth(expensesData, selectedMonth);

    setChartData({
      monthlySpendingData: processMonthlySpendingData(expensesData),
      totalPerMonthData: processTotalPerMonthData(expensesData),
      categorySpendingData: processCategorySpendingData(filteredDataByMonth),
      highestCategoryData: processHighestCategoryData(expensesData),
    });
  }, [selectedMonth]);

  if (!chartData.monthlySpendingData || !chartData.totalPerMonthData || !chartData.categorySpendingData || !chartData.highestCategoryData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div>
        <label htmlFor="monthSelect">Select Month: </label>
        <select
          id="monthSelect"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthNames.map((month, index) => (
            <option key={index + 1} value={index + 1}>{month}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ width: '45%' }}>
          <h3>Yearly Spending Trends (Line Chart)</h3>
          <Line data={chartData.monthlySpendingData} options={{
            responsive: true,
            plugins: {
              datalabels: {
                display: false,
              }
            }
          }} />
        </div>

        <div style={{ width: '45%' }}>
          <h3>Total Amount Per Month (Bar Chart)</h3>
          <Bar data={chartData.totalPerMonthData} options={{ responsive: true }} />
        </div>

        <div style={{ width: '45%' }}>
          <h3>Pie Chart: Amount Spent by Category</h3>
          <Pie data={chartData.categorySpendingData} options={{ responsive: true }} />
        </div>

        <div style={{ width: '45%' }}>
          <h3>Highest Spent Category Per Month (Bar Chart)</h3>
          <Bar data={chartData.highestCategoryData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}

export default ExpenseChartsPage;
