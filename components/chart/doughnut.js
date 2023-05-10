import { useEffect } from "react";
import { Chart } from "chart.js";
function DoughnutChart() {
  useEffect(() => {
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Accepted", "Pending", "Rejected"],
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
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
      },
    });
  }, []);

  return (
    <>
      {/* Doughnut chart */}
      <div className="w-[1100px] h-screen flex mx-auto my-auto">
        <div className="border border-gray-400 pt-0 rounded-xl w-full h-fit my-auto  shadow-xl pb-2">
          <div>
            <canvas
              id="myChart"
              style={{
                position: "absolute",
                width: "100% !important",
                height: "100% !important",
              }}
            ></canvas>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoughnutChart;

