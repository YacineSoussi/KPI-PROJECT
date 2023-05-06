<script setup>

import VisitorsLogic from '../logics/test';
import { Chart } from 'chart.js/auto';
import { ref, onMounted, nextTick } from 'vue';

const visitorsData = ref([]);


onMounted(async () => {
    await fetchVisitorsData();
});

const fetchVisitorsData = async () => {
   return await VisitorsLogic.getVisitorsPerMonth().then((response) => {
        visitorsData.value = response.data;
        console.log(visitorsData.value);
        createChart();
    }); 
};

const AllMonths = () => {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    return months;
}

const DataByMonth = (data) => {
   const result = [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0];

    data.forEach((item) => {
         result[item.month - 1] = item.totalVisitors;
    });
    return result;
}

const createChart = () => {
    
const ctx = document.getElementById('chart');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: AllMonths(),
        datasets: [{
            label: 'Visitors',
            data: DataByMonth(visitorsData.value),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
    myChart.render();
}

</script>

<template>
    <div class="dashboard-view">
        <h1>Dashboard</h1>

       <canvas  id="chart" width="400" height="400"></canvas>
    </div>
</template>