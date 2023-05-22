import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  Text,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
  useDisclosure,
  Center,
  Box,
  Input,
} from "@chakra-ui/react";
import Grid from "@toast-ui/react-grid";
import TuiGrid from "tui-grid";
import { loadProgressBar } from "axios-progress-bar";
import { decodeToken, isLoginCheck } from "../../provider/auth";
import style from "../../styles/Home.module.css";

import Pagination from "react-js-pagination";

import "tui-grid/dist/tui-grid.min.css";
import "axios-progress-bar/dist/nprogress.css";
import { GetCookie } from "../../provider/common";

// 전역변수
const axios = require("axios").default;
// Toast-ui에서 사용하는 Grid css
TuiGrid.setLanguage("ko");
TuiGrid.applyTheme("default", {
  grid: {
    border: "#ccc",
    text: "#333",
  },
  cell: {
    header: {
      background: "#5499C7",
      text: "#fff",
    },
    rowHeader: {
      background: "#fff",
    },
    normal: {
      background: "#fff",
      showVerticalBorder: true,
      showHorizontalBorder: true,
    },
    disabled: {
      background: "#fff",
      text: "#7a7a7a",
    },
  },
});

export class EstimateCustomCommonRenderer {
  constructor(props) {
    this.el = document.createElement("span");
    const { type } = props.columnInfo.renderer.options;
    this.type = type;
    this.value = this.formatter(props);
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  formatter(props) {
    if (this.type === "number") {
      return Number(props.value).toLocaleString();
    } else if (this.type === "float") {
      return props.value > 100
        ? Number(props.value).toLocaleString()
        : Number(props.value).toLocaleString();
    } else {
      return isNaN(props.value)
        ? props.value
        : Number(props.value).toLocaleString();
    }
  }

  render(props) {
    if (props.value) {
      if (this.type === "number" || this.type === "float") {
        let val = props.value.toString().replace(",", "");
        if (isNaN(val) !== false) {
          alert("숫자만 입력 가능합니다");
          return false;
        }
      }
      let value = this.formatter(props);
      // 입력된 값으로 변경
      this.el.textContent = value;
    } else {
      this.el.textContent = "";
    }
    this.el.classList.add("ml-2");
    this.el.classList.add("mr-2");
  }
}

// 견적서 tui grid
export default function QuotationConditionsTable() {
  const urlParams = new URLSearchParams(window.location.search);
  loadProgressBar();
  const ref = useRef();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [total, setTotal] = useState(1);
  // 데이터 로드
  const loadData = async () => {
    try {
      // 토큰 설정 -> 해당 유저 it_maker 값 필요
      const token = await GetCookie("token");
      const tokenInfo = await decodeToken(token);
      const quotationInfoId = tokenInfo.payload.it_maker;

      // 온다파츠 견적 회신 리스트(총 데이터)
      let URL =
        process.env.ONDA_API_URL +
        "/api/quotation/id/detail/count/" +
        `${quotationInfoId}?offset=${perPage}&page=${page}`;

      const res = await axios.get(URL, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer` + token,
        },
      });

      // 온다파츠 견적 회신 리스트(총 개수)
      let countURL =
        process.env.ONDA_API_URL +
        "/api/quotation/id/detail/onlycount/" +
        `${quotationInfoId}`;

      const count = await axios.get(countURL, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer` + token,
        },
      });

      setPerPage(perPage);
      setTotal(count.data.data);
      setData(res.data.data);

      console.log(page);
    } catch (e) {
      consoel.log(e);
    }
  };

  // 컬럼 설정
  const columns = [
    {
      header: "순번",
      name: "data_num",
      width: 30,
      className: "font12 text-center",
    },
    {
      header: "견적번호",
      name: "rply_id",
      className: "font12 text-center",

      width: 80,
      hidden: false,
      filter: "select",
    },

    {
      header: "부품번호",
      name: "partnumber",
      className: "font12 text-center",
      hidden: false,
      minWidth: 150,
    },
    {
      header: "상태",
      name: "es_state",
      className: "font12 text-center",
      hidden: false,
      width: 70,
    },
    {
      header: "제조사",
      name: "manufacturer",
      className: "font12 text-center",
      hidden: false,
      minWidth: 80,
    },
    {
      header: "유통사",
      name: "mb_id",
      className: "font12 text-center",
      hidden: false,
      minWidth: 70,
    },
    {
      header: "요청수량",
      name: "quantity",
      className: "font12 text-center",
      align: "center",

      width: 70,
    },
    {
      header: "견적가",
      name: "price",
      className: "font12 text-center",
      align: "center",
      width: 60,
      className: "font-12",
    },

    {
      header: "합계",
      name: "quantity",
      hidden: false,
      align: "center",

      minWidth: 60,
      filter: "select",
    },
    {
      header: "제조일(D/C)",
      name: "dc",
      className: "font12 text-center",
      hidden: false,
      minWidth: 70,
    },
    {
      header: "packaging",
      name: "packaging",
      className: "font12 text-center",
      hidden: false,
      minWidth: 70,
    },
    {
      header: "납기(Lead Time)",
      name: "leadtime",
      className: "font12 text-center",
      hidden: false,
      minWidth: 70,
    },
  ];

  const handleAlert = () => alert("준비 중입니다.");

  const handlePageChange = (page) => setPage(page);

  useEffect(() => {
    loadData();
  }, [page]);

  if (data) {
    return (
      <>
        <div className="mb-5 estimate-detail__body">
          <div className={style.quotation_conditions_btns}>
            <div className={style.quotation_conditions_btns_right}>
              <div></div>
              <Button
                type="button"
                className={style.estimate_list_detail_btn}
                onClick={handleAlert}
              >
                엑셀 다운로드
              </Button>
            </div>
          </div>
          <div className={style.quotation_conditions_table}>
            <Grid
              ref={ref}
              data={data}
              columns={columns}
              columnOptions={{ resizable: true }}
              rowHeaders={[{ type: "checkbox", checked: false }]}
            />
          </div>

          <div className="menu_pagination">
            <Pagination
              activePage={page}
              itemsCountPerPage={perPage}
              totalItemsCount={total}
              pageRangeDisplayed={5}
              prevPageText={"‹"}
              nextPageText={"›"}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}

