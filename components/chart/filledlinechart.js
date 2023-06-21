import { useEffect, useState } from "react";
import { Chart } from "chart.js";
import { decodeToken } from "../../provider/auth";
import { GetCookie } from "../../provider/common";
import style from "../../styles/Home.module.css";
const axios = require("axios").default;

function FilledLineChart() {
  const [data, setData] = useState(null);
  const [annualData, setAnnualData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const token = await GetCookie("ondaPcToken");
      const tokenInfo = await decodeToken(token);
      const orderInfoId = tokenInfo.payload.it_maker;

      let dashboardURL =
        process.env.ONDA_API_URL + "/api/dashboard/partner/" + orderInfoId;
      const res = await axios.get(dashboardURL);
      setData(Object.values(res.data.data.monthly_total_array[0]));
      setAnnualData(Object.values(res.data.data.yearly_total_array[0]));
    };
    loadData();
  }, []);

  useEffect(() => {
    if (data != null) {
      var ctx = document.getElementById("monthLineChart").getContext("2d");
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
              data: data,
              label: "Hit",
              borderColor: "#3e95cd",
              backgroundColor: "#7bb6dd",
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
    }

    if (annualData != null) {
      var ctx2 = document.getElementById("annualLineChart").getContext("2d");
      var myChart2 = new Chart(ctx2, {
        type: "line",
        data: {
          labels: ["2023", "2024", "2025"],
          datasets: [
            {
              data: annualData,
              label: "Hit",
              borderColor: "#3cba9f",
              backgroundColor: "#71d1bd",
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
    }
  }, [data, annualData]);

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

