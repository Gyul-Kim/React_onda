import { Link, Box } from "@chakra-ui/react";
import IndexLayout from "../components/index_layout";
import BoxIndicator from "../components/box/box";
import ChartAll from "../components/chartAll";
import GetCookie from "../provider/common";
import { isMemberCheck, isGoingToIntro } from "../provider/auth";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { GetReviewData } from "../pages/api/base";
import style from "../styles/Home.module.css";

export default function Home() {
  //페이지 로딩시 데이터 반영
  useEffect(() => {
    isGoingToIntro();
  }, []);

  return (
    <IndexLayout>
      <div className={style.main_container}>
        <BoxIndicator />
        <ChartAll />
      </div>
    </IndexLayout>
  );
}
