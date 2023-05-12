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
        {/* <ChartAll /> */}

        <div className={style.main_btm}>
          <div className={style.btm_title}>
            <h3>회원목록</h3>
            <button>+ More</button>
          </div>
          <div className={style.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>순번</th>
                  <th>회원정보</th>
                  <th>주문건수</th>
                  <th>가입날짜</th>
                  <th>회원레벨</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>5</td>
                  <td>bright</td>
                  <td>12</td>
                  <td>23-04-19</td>
                  <td>일반</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>dfrot</td>
                  <td>33</td>
                  <td>23-04-09</td>
                  <td>일반</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>arrow</td>
                  <td>62</td>
                  <td>23-04-04</td>
                  <td>일반</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>mouser</td>
                  <td>53</td>
                  <td>23-04-01</td>
                  <td>일반</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>digikey</td>
                  <td>45</td>
                  <td>23-03-15</td>
                  <td>일반</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </IndexLayout>
  );
}
