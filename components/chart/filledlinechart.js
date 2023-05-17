import { useEffect } from "react";
import { Chart } from "chart.js";
import style from "../../styles/Home.module.css";

function FilledLineChart() {
  useEffect(() => {
    var ctx = document.getElementById("monthLineChart").getContext("2d");
    var ctx2 = document.getElementById("annualLineChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "1월",
          "2월",
          "3월",
          "4월",
          "5월",
          "6월",
          "7월",
          "8월",
          "9월",
          "10월",
          "11월",
          "12월",
        ],
        datasets: [
          {
            data: [86, 114, 106, 106, 107, 111, 133, 145, 122, 155, 180, 165],
            label: "Hit",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          },
          {
            data: [70, 90, 44, 60, 83, 90, 100, 80, 70, 60, 120, 130, 109, 108],
            label: "Progress",
            borderColor: "#3cba9f",
            backgroundColor: "#71d1bd",
            fill: false,
          },
          // {
          //   data: [10, 21, 60, 44, 17, 21, 17],
          //   label: "Pending",
          //   borderColor: "#ffa500",
          //   backgroundColor: "#ffc04d",
          //   fill: false,
          // },
          {
            data: [6, 3, 2, 2, 7, 0, 16, 40, 50, 60, 30, 20, 10],
            label: "Miss",
            borderColor: "#c45850",
            backgroundColor: "#d78f89",
            fill: false,
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

    var myChart2 = new Chart(ctx2, {
      type: "line",
      data: {
        labels: ["2020", "2021", "2022", "2023", "2024"],
        datasets: [
          {
            data: [86, 114, 106, 106, 107],
            label: "Applied",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          },
          {
            data: [70, 90, 44, 60, 83],
            label: "Accepted",
            borderColor: "#3cba9f",
            backgroundColor: "#71d1bd",
            fill: false,
          },
          // {
          //   data: [10, 21, 60, 44, 17, 21, 17],
          //   label: "Pending",
          //   borderColor: "#ffa500",
          //   backgroundColor: "#ffc04d",
          //   fill: false,
          // },
          {
            data: [6, 3, 2, 2, 7],
            label: "Rejected",
            borderColor: "#c45850",
            backgroundColor: "#d78f89",
            fill: false,
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
      {/* Bar chart */}

      <div className={style.earning_chart}>
        <canvas id="monthLineChart"></canvas>
        <canvas id="annualLineChart" style={{ display: "none" }}></canvas>
      </div>
    </>
  );
}

export default FilledLineChart;
