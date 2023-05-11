import { Link, Box } from "@chakra-ui/react";
import IndexLayout from "../components/index_layout";
import DoughnutChart from "../components/chart/doughnut";
import FilledLineChart from "../components/chart/filledlinechart";

import React, { useState, useEffect } from "react";
import { GetReviewData } from "../pages/api/base";
import style from "../styles/Home.module.css";

export default function Home() {
  //페이지 로딩시 데이터 반영
  useEffect(() => {}, []);

  return (
    <IndexLayout>
      <div className={style.main_container}>
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
      </div>
    </IndexLayout>
  );
}
