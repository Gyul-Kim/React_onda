import BaseLayout from "../../components/base_layout";
import EstimateNav from "../../components/navi/estimate_nav";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import style from "../../styles/Home.module.css";
import $ from "jquery";

const EstimateGrid = dynamic(
  () => import("../../components/quotation/quotation_detail"),
  {
    ssr: false,
  }
);

const EstimateConditionsGrid = dynamic(
  () => import("../../components/quotation/quotation_conditions_table"),
  {
    ssr: false,
  }
);

// 전역변수
const axios = require("axios").default;
export default function EstimateDetail(props) {
  const ref = useRef();
  const ref_grid = useRef();

  const quotationGridShow = (props) => {
    $(".quotationGrid").show();
    $(".quotationConditions").hide();
    // ref_grid.current.getInstance().setRequestParams(props.params);
    console.log(ref_grid);
    console.log(props);
  };

  const quotationConditionsShow = (props) => {
    $(".quotationGrid").hide();
    $(".quotationConditions").show();
    ref.current.getInstance().readData();ㅋ
    console.log(ref);
  };

  return (
    <BaseLayout>
      <EstimateNav />
      <div className="flex-center" id="quotation_reply_grid">
        <div className={style.quotation_reply_menu}>
          <h4 className="">견적관리</h4>
          <button className="" onClick={quotationGridShow}>
            견적회신하기
          </button>
          <div>ㅣ</div>
          <button href="#" className="" onClick={quotationConditionsShow}>
            견적상황
          </button>
        </div>
        <div className="quotationGrid">
          <EstimateGrid
            ref={ref_grid}
            onBeforeRequest={(props) => {
              props.instance.setRequestParams(props.params);
            }}
          />
        </div>
        <div className="quotationConditions" style={{ display: "none" }}>
          <EstimateConditionsGrid ref={ref} />
        </div>
      </div>
    </BaseLayout>
  );
}
