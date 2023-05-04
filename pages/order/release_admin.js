import BaseLayout from "../../components/base_layout";
import EstimateNav from "../../components/navi/estimate_nav";
import OrderNav from "../../components/navi/order_nav";
import SearchBox from "../../components/SearchBox";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import style from "../../styles/Home.module.css";
import { Text, Radio, RadioGroup, Stack } from "@chakra-ui/react";

const ReleaseAdminGrid = dynamic(
  () => import("../../components/order/release_table"),
  {
    ssr: false,
  }
);

// 전역변수
const axios = require("axios").default;

export default function ReleaseAdminDetail() {
  return (
    <BaseLayout>
      <EstimateNav />
      <div id="release-list-admin">
        <OrderNav />
      </div>

      <div className="flex-center" id="quotation_reply_grid">
        <div className={style.quotation_reply_menu}>
          <h4 className="">출고현황</h4>
        </div>
        <div className={style.search_area_menu}>
          <div className={style.search_business_box}>
            <div className={style.search_business_indicator_box}>
              <Text>출고완료 금액</Text>
              <Text>401,500</Text>
            </div>
            <div className={style.search_business_indicator_box}>
              <Text>출고 미완료 금액</Text>
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
                  <Radio value="2">출고완료</Radio>
                  <Radio value="3">출고 미완료</Radio>
                </Stack>
              </RadioGroup>
            </div>
          </div>
        </div>

        <ReleaseAdminGrid />
      </div>
    </BaseLayout>
  );
}
