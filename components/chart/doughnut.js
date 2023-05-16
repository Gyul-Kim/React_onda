import { useEffect } from "react";
import { Chart } from "chart.js";
import style from "../../styles/Home.module.css";

function DoughnutChart() {
  useEffect(() => {
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Hit", "Progress", "Miss"],
        datasets: [
          {
            data: [70, 10, 6],
            borderColor: [
              "rgb(75, 192, 192)",
              "rgb(255, 205, 86)",
              "rgb(255, 99, 132)",
            ],
            backgroundColor: [
              "rgb(75, 192, 192 )",
              "rgb(255, 205, 86)",
              "rgb(255, 99, 132)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              display: true,
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }, []);

  return (
    <>
      <div className={style.earning_chart}>
        <canvas id="myChart"></canvas>
      </div>
    </>
  );
}

export default DoughnutChart;


