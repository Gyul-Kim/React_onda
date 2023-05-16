import DoughnutChart from "../components/chart/doughnut";
import FilledLineChart from "../components/chart/filledlinechart";
import style from "../styles/Home.module.css";

export default function ChartAll() {
  return (
    <div className={style.main_md}>
      <div className={style.main_lft}>
        <div style={{ display: "flex", width: "92%" }}>
          <h3>거래액</h3>
          <button>월별</button>
          <button>연별</button>
        </div>

        <div className={style.chart_frame}>
          <FilledLineChart />
        </div>
      </div>
      <div className={style.main_rt}>
        <h3>Hit Rate</h3>

        <div className={style.chart_frame}>
          <DoughnutChart />
        </div>
      </div>
    </div>
  );
}
