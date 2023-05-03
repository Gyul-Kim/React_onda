import BaseLayout from "../../components/base_layout";
import EstimateNav from "../../components/navi/estimate_nav";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import style from "../../styles/Home.module.css";

const EstimateGrid = dynamic(
  () => import("../../components/quotation/quotation_detail"),
  {
    ssr: false,
  }
);


// 전역변수
const axios = require("axios").default;
export default function EstimateDetail() {
  return (
    <BaseLayout>
      <EstimateNav />
      <div className="flex-center" id="quotation_reply_grid">
        <div className={style.quotation_reply_menu}>
          <h4 className="">견적관리</h4>
          <a href="/quotation/quotation_reply_list" className="">
            견적회신하기
          </a>
          <div>ㅣ</div>
          <a href="/quotation/quotation_conditions" className="">
            견적상황
          </a>
        </div>
        <EstimateGrid />
      </div>
    </BaseLayout>
  );
}
