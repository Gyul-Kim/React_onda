import BaseLayout from "../../components/base_layout";
import EstimateNav from "../../components/navi/estimate_nav";
import QuotationNav from "../../components/navi/quotation_nav";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Pagination from "react-js-pagination";
import style from "../../styles/Home.module.css";

const EstimateGrid = dynamic(
  () => import("../../components/quotation/quotation_detail"),
  {
    ssr: false,
  }
);

// 전역변수
export default function EstimateDetail() {
  return (
    <BaseLayout>
      <EstimateNav />
      <div id="quotation_reply_list">
        <QuotationNav />
      </div>

      <div className="" id="quotation_reply_grid">
        <div className={style.quotation_reply_menu}>
          <h4 className="">견적회신하기</h4>
        </div>
        <div className="quotationGrid">
          <EstimateGrid />
        </div>
      </div>
    </BaseLayout>
  );
}
