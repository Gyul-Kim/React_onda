import BaseLayout from "../../components/base_layout";
import EstimateNav from "../../components/navi/estimate_nav";
import QuotationNav from "../../components/navi/quotation_nav";
import SearchBox from "../../components/SearchBox";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import style from "../../styles/Home.module.css";
import { Text, Radio, RadioGroup, Stack } from "@chakra-ui/react";

const QuotationConditionsTable = dynamic(
  () => import("../../components/quotation/quotation_conditions_table"),
  {
    ssr: false,
  }
);

// 전역변수
export default function EstimateDetail() {
  return (
    <BaseLayout>
      <EstimateNav />
      <div id="quotation_conditions">
        <QuotationNav />
      </div>
      <div id="quotation_reply_grid">
        <div className={style.quotation_reply_menu}>
          <h4 className="">견적상황판</h4>
        </div>
        <div className={style.search_area_menu}>
          <div className={style.search_business_box}>
            <div className={style.search_business_indicator_box}>
              <Text>견적 완료 금액</Text>
              <Text>401,500</Text>
            </div>
            <div className={style.search_business_indicator_box}>
              <Text>견적 미완료 금액</Text>
              <Text>94,000</Text>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <SearchBox />
            <div
              className={style.search_radio_box}
              style={{ padding: "27px 20px", height: "fit-content" }}
            >
              <RadioGroup>
                <Stack direction="row">
                  <Radio value="1">전체</Radio>
                  <Radio value="2">견적완료</Radio>
                  <Radio value="3">견적 미완료</Radio>
                </Stack>
              </RadioGroup>
            </div>
          </div>
        </div>
        <div className="quotationGrid">
          <QuotationConditionsTable />
        </div>
      </div>
    </BaseLayout>
  );
}

