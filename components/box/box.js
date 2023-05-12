import style from "../../styles/Home.module.css";

export default function BoxIndicator() {
  return (
    <div className={style.main_tp}>
      <div className={style.bx_indicator}>
        <h4>견적요청 건수</h4>
        <p>3,456</p>
        <p>+ 2.3%</p>
        <p>Since Yesterday</p>
      </div>
      <div className={style.bx_indicator}>
        <h4>견적회신건수</h4>
        <p>3,456</p>
        <p>+ 2.3%</p>
        <p>Since Yesterday</p>
      </div>
      <div className={style.bx_indicator}>
        <h4>주문건수</h4>
        <p>3,456</p>
        <p>+ 2.3%</p>
        <p>Since Yesterday</p>
      </div>
      <div className={style.bx_indicator}>
        <h4>월 거래액</h4>
        <p>3,456</p>
        <p>+ 2.3%</p>
        <p>Since Yesterday</p>
      </div>
      <div className={style.bx_indicator}>
        <h4>연 거래액</h4>
        <p>3,456</p>
        <p>+ 2.3%</p>
        <p>Since Yesterday</p>
      </div>
    </div>
  );
}
