import { Link, Box } from "@chakra-ui/react";
import IndexLayout from "../components/no_header_layout";

import React, { useState, useEffect } from "react";
import style from "../styles/Home.module.css";

export default function Home() {
  useEffect(() => {}, []);

  return (
    <IndexLayout>
      <div className={style.main_content}>
        <section className={style.main_1st}>
          <article className={style.main_vid}>
            <video autoPlay loop muted>
              <source src="/video/onda_vid.mp4" />
            </video>
          </article>
          <article className={style.main_title}>
            <div className={style.main_center}>
              <h1>전자부품 온라인 소싱 솔루션</h1>
              <p>
                온다파츠는 전자부품 마켓의 셀러에게 <br />
                과잉, 잉여, 불용 재고를 판매하는데 <br />
                필요한 솔루션을 제공하고, <br />
                바이어들이 안전하게 <br />
                거래할 수 있도록 돕습니다.
              </p>{" "}
              <br />
            </div>
          </article>
          <div className={style.main_vid_bg}></div>
        </section>

        <div className={style.main_2nd}>
          <section className={style.cont_main}>
            <article className={style.cont_left}>
              <div
                className={style.cont_img}
                style={{
                  background: "url(./images/img_1.png) 0 0 no-repeat",
                  backgroundSize: "cover",
                }}
              >
                {/* <img src="./images/img_1.png" /> */}
              </div>
            </article>
            <article className={style.cont_right}>
              <div className={style.cont_ex}>
                <h3>
                  매출 올리고 <br /> 더 많은 고객을 유치하는 방법 <br />
                  바로
                  <span className={style.title_bold}> 온다파츠</span>
                </h3>
                <p>
                  온다파츠 판매자 맞춤형 대시보드에서
                  <br />
                  견적하고 지금 바로 매출을 올려보세요.
                </p>
                <a href="/auth/login">온다파츠 바로가기</a>
              </div>
            </article>
          </section>
        </div>
        <div className={style.main_2nd}>
          {" "}
          <section className={style.cont_main}>
            <article className={style.cont_left}>
              <div className={style.cont_ex}>
                <h3>
                  전자부품 재고 판매 <br /> 이제{" "}
                  <span className={style.title_bold}>온다파츠</span>에서!
                </h3>
                <p>
                  창고에 쌓여있는 전자부품의 과잉 재고로 <br /> 어려움을 겪고
                  계신가요? <br />
                </p>
                <p>
                  온다파츠는 웹 기반{" "}
                  <span className={style.title_bold}>
                    재고 데이터 공유 솔루션
                  </span>
                  을 <br /> 통해 글로벌 마켓으로 <br /> 판매할 수 있도록
                  지원합니다.
                </p>
                <a href="#">재고판매 신청하기</a>
              </div>
            </article>
            <article className={style.cont_right}>
              <div
                className={style.cont_img}
                style={{
                  background: "url(./images/img_3.png) 0 0 no-repeat",
                  backgroundSize: "contain",
                  width: "600px",
                  height: "390px",
                }}
              >
                {/* <img src="" /> */}
              </div>
            </article>
          </section>
        </div>
        <div className={style.main_2nd}>
          <section className={style.cont_main}>
            <article className={style.cont_left}>
              <div
                className={style.cont_img}
                style={{
                  background: "url(./images/img_2.png) 0 0 no-repeat",
                  backgroundSize: "contain",
                  width: "600px",
                  height: "390px",
                }}
              >
                {/* <img src="" /> */}
              </div>
            </article>
            <article className={style.cont_right}>
              <div className={style.cont_ex}>
                <h3>
                  가장 완벽한 전자부품 견적 <br /> 쉽고 빠르고 안전하게
                </h3>
                <p>
                  온다파츠에서 전 세계의 전자부품을 <br />{" "}
                  <span className={style.title_bold}>효율적</span>으로
                  소싱하세요.
                </p>
                <a href="#">온다파츠 견적 문의하기</a>
              </div>
            </article>
          </section>
        </div>
      </div>
    </IndexLayout>
  );
}
