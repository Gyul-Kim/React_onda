import { Link, Box } from "@chakra-ui/react";
import IndexLayout from "../components/index_layout";
import BoxIndicator from "../components/box/box";
import ChartAll from "../components/chartAll";

import React, { useState, useEffect } from "react";
import { GetReviewData } from "../pages/api/base";
import style from "../styles/Home.module.css";

export default function Home() {
  //페이지 로딩시 데이터 반영
  useEffect(() => {}, []);

  return (
    <IndexLayout>
      <div className={style.main_container}>
        <BoxIndicator />
       <ChartAll /> 
      </div>
    </IndexLayout>
  );
}
