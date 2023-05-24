import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Text,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Box,
  Select,
} from "@chakra-ui/react";
import Grid from "@toast-ui/react-grid";
import TuiGrid from "tui-grid";
import { loadProgressBar } from "axios-progress-bar";
import { decodeToken } from "../../provider/auth";
import style from "../../styles/Home.module.css";

import Pagination from "react-js-pagination";
import WriteInput from "../common/writeInput";
import Btn from "../common/btn";

import SearchBox from "../../components/SearchBox";
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
  const [completion, setCompletion] = useState("");
  const [incompletion, setInCompletion] = useState("");
  const [text, setText] = useState("");

  const [value, setValue] = useState("");

  // 데이터 로드
  const loadData = async (e) => {
    try {
      // 토큰 설정 -> 해당 유저 it_maker 값 필요
      const token = await GetCookie("token");
      const tokenInfo = await decodeToken(token);
      const quotationInfoId = tokenInfo.payload.it_maker;

      // 온다파츠 견적 회신 리스트(총 데이터)
      // 처음 reload될 때 보여지는 화면
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

      // 견적완료 및 미완료 radio bo의 data를 보여주기 위해선
      // 첫 화면 setData의 위치를 불가피하게 맨 위로 보내게 됨
      setData(res.data.data);

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

      // 한 페이지 당 보여지는 데어터 개수 및 전체 데이터 개수 뿌리기
      setPerPage(perPage);
      setTotal(count.data.data);

      // 견적 완료 및 미완료 radio box 누를 때의 견적 회신 리스트
      // 견적 완료 및 미완료 전체 리스트
      if (e == "all") {
        let URL =
          process.env.ONDA_API_URL +
          "/api/quotation/id/detail/count/" +
          `${quotationInfoId}?offset=${perPage}&page=${page}&type=all`;
        const res = await axios.get(URL, {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer` + token,
          },
        });
        setData(res.data.data);
      }

      // 견적완료 리스트
      if (e == "complete") {
        let URL =
          process.env.ONDA_API_URL +
          "/api/quotation/id/detail/count/" +
          `${quotationInfoId}?offset=${perPage}&page=${page}&type=complete`;
        const res = await axios.get(URL, {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer` + token,
          },
        });
        setData(res.data.data);
      }

      // 견적 미완료 전체 리스트
      if (e == "incomplete") {
        let URL =
          process.env.ONDA_API_URL +
          "/api/quotation/id/detail/count/" +
          `${quotationInfoId}?offset=${perPage}&page=${page}&type=incomplete`;
        const res = await axios.get(URL, {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer` + token,
          },
        });
        setData(res.data.data);
      }

      //견적 상황판 완료 및 미완료 금액 설정
      const quotationMoneyURL =
        process.env.ONDA_API_URL + "/api/quotation/partner/sum";
      let body = { it_maker: quotationInfoId };
      const quotationRes = await axios.post(quotationMoneyURL, body, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${await GetCookie("token")}`,
        },
      });

      setInCompletion(quotationRes.data.data.incompleteSum);
      setCompletion(quotationRes.data.data.completeSum);
    } catch (e) {
      console.log("err" + e);
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

  // 엑셀 업로드 및 다운로드 [준비 중] 팝업 띄우기
  const handleAlert = () => alert("준비 중입니다.");
  // 전체 페이지 설정
  const handlePageChange = (page) => setPage(page);

  // radio box 클릭 이벤트
  const handleRadio = async (e) => {
    loadData(e);
  };

  // select 박스 부풒번호 및 제조사 선택칸
  const onSelect = (e) => {
    setValue(e.target.value);
  };

  // 검색어 입력 검색
  const searchText = useCallback((e) => {
    setText(e.target.value);
  });

  // 조회 버튼 클릭 시 이벤트
  const _handleSearch = async () => {
    // 토큰 설정 -> 해당 유저 it_maker 값 필요
    const token = await GetCookie("token");
    const tokenInfo = await decodeToken(token);
    const quotationInfoId = tokenInfo.payload.it_maker;
    try {
      // 검색어와 부품번호 및 제조사 선택 했을 때
      if (text && value) {
        let searchURL =
          process.env.ONDA_API_URL +
          "/api/quotation/id/detail/count/" +
          `${quotationInfoId}?offset=${perPage}&page=${page}&search=${value}&name=${text}`;
        const res = await axios.get(searchURL, {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer` + token,
          },
        });

        // 검색조건에 맞는 데이터가 있을 때
        if (res.data.data.length > 0) {
          setData(res.data.data);
        }
        // 검색조건에 맞는 데이터가 없을 때
        if (res.data.data == 0) {
          setData("undefined");
        }
      }

      // 부품번호 및 제조서 미선택
      // or 검색어 비어 있을 때.
      if (
        text === null ||
        text === " " ||
        text === "" ||
        text === "undefined" ||
        value === null ||
        value === " " ||
        value === "" ||
        value === "undefined"
      ) {
        // 부품번호 및 제조사 미선택 & 검색어는 입력했을 때.
        if (text && value === "") {
          alert("찾고자하는 부품번호 및 제조사 선택은 필수입니다.");
          return;
        }

        let URL =
          process.env.ONDA_API_URL +
          "/api/quotation/id/detail/count/" +
          `${quotationInfoId}?offset=${perPage}&page=${page}&type=all`;
        const res = await axios.get(URL, {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer` + token,
          },
        });
        setData(res.data.data);
      }
    } catch (e) {
      console.log("err " + e);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  if (data !== "undefined") {
    return (
      <>
        {/* 견적상황판 검색위젯 시작 */}
        <div className={style.search_area_menu}>
          <div className={style.search_business_box}>
            <div className={style.search_business_indicator_box}>
              <Text>견적 완료 금액</Text>
              <Text> {completion}</Text>
            </div>
            <div className={style.search_business_indicator_box}>
              <Text>견적 미완료 금액</Text>
              <Text>{incompletion}</Text>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <Box className="order-Header__box flex-center">
              <Box className="order-Header__search">
                <Select
                  placeholder="선택"
                  width="120px"
                  onChange={onSelect}
                  value={value}
                >
                  <option value="partnumber">부품번호</option>
                  <option value="manufacturer">제조사</option>
                </Select>
                <Box className="order-Header__search__right">
                  <WriteInput
                    example="부품번호 및 제조사 등"
                    writeEvent={searchText}
                    writeValue={text}
                  />
                  <Btn text="조회" clickEvent={_handleSearch} />
                </Box>
              </Box>
            </Box>
            <div
              className={style.search_radio_box}
              style={{ padding: "27px 20px", height: "fit-content" }}
            >
              <RadioGroup defaultValue="1" onChange={handleRadio}>
                <Stack direction="row">
                  <Radio value="all">전체</Radio>
                  <Radio value="complete">견적완료</Radio>
                  <Radio value="incomplete">견적 미완료</Radio>
                </Stack>
              </RadioGroup>
            </div>
          </div>
        </div>
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
          {/* 검색상황판 검색위젯 끝 */}
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
    return (
      <>
        {/* 견적상황판 검색위젯 시작 */}
        <div className={style.search_area_menu}>
          <div className={style.search_business_box}>
            <div className={style.search_business_indicator_box}>
              <Text>견적 완료 금액</Text>
              <Text> {completion}</Text>
            </div>
            <div className={style.search_business_indicator_box}>
              <Text>견적 미완료 금액</Text>
              <Text>{incompletion}</Text>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <Box className="order-Header__box flex-center">
              <Box className="order-Header__search">
                <Select
                  placeholder="선택"
                  width="120px"
                  onChange={onSelect}
                  value={value}
                >
                  <option value="partnumber">부품번호</option>
                  <option value="manufacturer">제조사</option>
                </Select>
                <Box className="order-Header__search__right">
                  <WriteInput
                    example="견적번호, 부품번호, 제조사, 유통사 등"
                    writeEvent={searchText}
                    writeValue={text}
                  />
                  <Btn text="조회" clickEvent={_handleSearch} />
                </Box>
              </Box>
            </Box>
            <div
              className={style.search_radio_box}
              style={{ padding: "27px 20px", height: "fit-content" }}
            >
              <RadioGroup defaultValue="1" onChange={handleRadio}>
                <Stack direction="row">
                  <Radio value="all">전체</Radio>
                  <Radio value="complete">견적완료</Radio>
                  <Radio value="incomplete">견적 미완료</Radio>
                </Stack>
              </RadioGroup>
            </div>
          </div>
        </div>
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
          {/* 검색상황판 검색위젯 끝 */}
          <Grid
            ref={ref}
            columns={columns}
            columnOptions={{ resizable: true }}
            rowHeaders={[{ type: "checkbox", checked: false }]}
          />
        </div>
      </>
    );
  }
}
