import DoughnutChart from "../components/chart/doughnut";
import FilledLineChart from "../components/chart/filledlinechart";
import style from "../styles/Home.module.css";

export default function ChartAll() {
  return (
    <div className={style.main_md}>
      <div className={style.main_lft}>
        <h3>거래액</h3>
        <div>
          <FilledLineChart />
        </div>
      </div>
      <div className={style.main_rt}>
        <h3>Hit Rate</h3>
        <div>
          <DoughnutChart />
        </div>
      </div>
    </div>
  );
}
