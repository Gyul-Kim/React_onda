import { useEffect, useState } from "react";
import { Chart } from "chart.js";
import { decodeToken } from "../../provider/auth";
import { GetCookie } from "../../provider/common";
import style from "../../styles/Home.module.css";
const axios = require("axios").default;

function DoughnutChart() {
  const [quotationData, setQuotationData] = useState(null);
  const [replyData, setReplyData] = useState(null);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const token = await GetCookie("ondaPcToken");
      const tokenInfo = await decodeToken(token);
      const orderInfoId = tokenInfo.payload.it_maker;

      let dashboardURL =
        process.env.ONDA_API_URL + "/api/dashboard/partner/" + orderInfoId;
      const res = await axios.get(dashboardURL);
      setQuotationData(res.data.data.totalCount);
      setReplyData(res.data.data.totalCountReply);
      setOrderData(res.data.data.totalCountOrder);
    };

    if (quotationData === null || replyData === null || orderData === null) {
      loadData();
    }

    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["견적요청", "견적회신", "주문건수"],
        datasets: [
          {
            data: [quotationData, replyData, orderData],
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
  }, [quotationData, replyData, orderData]);

  return (
    <>
      {/* Doughnut chart */}
      <div className={style.earning_chart}>
        <canvas id="myChart"></canvas>
      </div>
    </>
  );
}

export default DoughnutChart;
