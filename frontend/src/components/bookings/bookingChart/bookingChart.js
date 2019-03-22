import React from 'react';
import { Bar as BarChart } from 'react-chartjs';

const BOOKING_CATEGORIES = {
  'Cheap': {
    min: 0,
    max: 10
  },
  'Medium': {
    min: 10,
    max: 50
  },
  'Expensive': {
    min: 50,
    max: 1000
  },
};

const bookingChart = props => {
  const chartData = {labels: [], datasets: []};
  const values = [];
  for (const category in BOOKING_CATEGORIES) {
    const bookingCount = props.bookings.reduce((prev, current) => {
      if (current.event.price >= BOOKING_CATEGORIES[category].min &&
          current.event.price < BOOKING_CATEGORIES[category].max) {
        return prev + 1
      } else {
        return prev;
      }
    }, 0);
    values.push(bookingCount);
    chartData.labels.push(category);
  }
  chartData.datasets.push({
    fillColor: "rgba(220, 220, 220, 0.5)",
    strokeColor: "rgba(220, 220, 220, 0.8)",
    highlightFill: "rgba(220, 220, 220, 0.75)",
    highlightStroke: "rgba(220, 220, 220, 1)",
    data: values
  });
  
  return <div style={{textAlign: 'center'}}><BarChart data={chartData}/></div>
};

export default bookingChart;