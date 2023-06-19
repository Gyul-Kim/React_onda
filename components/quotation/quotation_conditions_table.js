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
import ReactDOM from "react-dom";
import TuiGrid from "tui-grid";
import { loadProgressBar } from "axios-progress-bar";
import { decodeToken } from "../../provider/auth";
import style from "../../styles/Home.module.css";

import { useRouter } from "next/router";
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
      background: "#f6f6f6",
      showVerticalBorder: true,
      showHorizontalBorder: true,
    },
    disabled: {
      background: "#fff",
      text: "#7a7a7a",
    },
  },
});
// 순번표시 렌더러
export class EstimateDataNumCustomRenderer {
  constructor(props) {
    const rootDom = document.createElement("div");
    const row = props.grid.getRow(props.rowKey);
    rootDom.style.overflow = "hidden";
    this.el = rootDom;
    // set instance property for grid
    this.grid = props.grid;
    this.props = props;
    this.row = row;
    if (props.columnInfo.renderer.options) {
      this.click = props.columnInfo.renderer.options.handler;
    }
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  onClick() {
    if (this.click) {
      this.click(this.props);
    }
  }

  render() {
    let element;
    if (this.row.data_type === "parent") {
      element = <span>{this.props.value}</span>;
    } else {
      element = this.props.rowKey + 1;
    }
    ReactDOM.render(element, this.el);
  }
}
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

async function downloadFile() {
  // 토큰 설정 -> 해당 유저 it_maker 값 필요
  const token = await GetCookie("ondaPcToken");
  const tokenInfo = await decodeToken(token);
  const mbid = tokenInfo.payload.it_maker;

  let reqUrl =
    process.env.ONDA_API_URL +
    "/api/quotation/download_quotation_xls?mbid=" +
    mbid +
    "&type=all";
  let fileName = "ondaparts_quotation_status.xlsx";

  fetch(reqUrl)
    .then((resp) => resp.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      // the filename you want
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      alert("문서가 다운로드가 완료되었습니다.");
    })
    .catch(() => alert("다운로드 에러"));
}
// 견적서 tui grid
export default function QuotationConditionsTable(e) {
  const urlParams = new URLSearchParams(window.location.search);
  loadProgressBar();
  const ref = useRef();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(null);
  const [completion, setCompletion] = useState("");
  const [incompletion, setInCompletion] = useState("");
  const [text, setText] = useState("");
  const [value, setValue] = useState("");
  const [checkBox, setCheckBox] = useState("all");
  const router = useRouter();

  const loadData = async () => {
    const token = await GetCookie("ondaPcToken");
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

    const word = window.location.search.split("&type=");
    let e = word[1];

    // 견적완료 및 미완료 radio bo의 data를 보여주기 위해선
    // 첫 화면 setData의 위치를 불가피하게 맨 위로 보내게 됨
    setData(res.data.data);
    setPerPage(perPage);

    if (text && value) {
      let searchURL =
        process.env.ONDA_API_URL +
        "/api/quotation/id/detail/count/" +
        `${quotationInfoId}?offset=${perPage}&page=${page}&search=${value}&name=${text}&type=all`;
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

      setTotal(res.data.data_length);
    }

    //부품번호 및 제조서 미선택
    //or 검색어 비어 있을 때.
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
        setText("");
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

      if (Math.round(res.data.data_length / perPage) < page) {
        setPage(1);
        return;
      }

      setPage(page);
      setTotal(res.data.data_length);
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

      // 다른 조건의 페이지네이션에서 없는 페이지인 상태로 해당 조건 전환할 때,
      // ex) 전체 설정 5페이 -> 견적 완료인 상태로 5페이지로 이동 but, 견적 완료에서 5페이지가 없다
      // 강제로 페이지 1로 보냄
      if (Math.ceil(res.data.data_length / perPage) < page) {
        setPage(1);
        return;
      }
      setTotal(res.data.data_length);
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
      if (Math.ceil(res.data.data_length / perPage) < page) {
        setPage(1);
        return;
      }
      setTotal(res.data.data_length);
      setData(res.data.data);
    }

    //견적 상황판 완료 및 미완료 금액 설정
    const quotationMoneyURL =
      process.env.ONDA_API_URL + "/api/quotation/partner/sum";
    let body = { it_maker: quotationInfoId };
    const quotationRes = await axios.post(quotationMoneyURL, body, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${await GetCookie("ondaPcToken")}`,
      },
    });
    setInCompletion(quotationRes.data.data.incompleteSum);
    setCompletion(quotationRes.data.data.completeSum);
  };

  // 컬럼 설정
  const columns = [
    {
      header: "순번",
      name: "data_num",
      width: 30,
      className: "font12 text-center",
      renderer: {
        type: EstimateDataNumCustomRenderer,
      },
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
      name: "state_kr",
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
      name: "name",
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
      name: "quotation_sum",
      hidden: false,
      align: "center",

      minWidth: 60,
      filter: "select",
    },
    {
      header: "제조년(D/C)",
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
    {
      header: "등록일",
      name: "CREATE_DATE",
      className: "font12",
      hidden: false,
      width: 90,
    },
  ];

  // 전체 페이지 설정
  const handlePageChange = (page) => {
    setPage(page);
    // const word = window.location.search.split("&type=");
    // let e = word[1];
    // console.log("out " + page);
    // router.push(
    //   `/quotation/quotation_conditions?offset=${perPage}&Page=${page}&type=${e}`
    // );
  };

  // radio box 클릭 이벤트
  const handleRadio = async (e) => {
    loadData(e);
    router.push(
      `/quotation/quotation_conditions?offset=${perPage}&Page=${page}&type=${e}`
    );
    setText("");
    setValue("");
    setCheckBox(e);
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
    loadData();
    router.push(
      `/quotation/quotation_conditions?offset=${perPage}&Page=${page}&search=${value}&name=${text}`
    );
    setPage(1);
    setCheckBox("all");
  };

  //갱신
  const reLoadData = async (e) => {
    try {
      loadData(e);
    } catch (e) {
      console.log("err " + e);
    }
  };

  useEffect(() => {
    // 데이터 로드 (가장 처음 화면 구성)
    const loadDataFirst = async () => {
      const token = await GetCookie("ondaPcToken");
      const tokenInfo = await decodeToken(token);
      const quotationInfoId = tokenInfo.payload.it_maker;
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

      setData(res.data.data);
      setTotal(res.data.data_length);
    };

    if (total === null) {
      loadDataFirst();
    }

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
              <RadioGroup
                defaultValue="all"
                onChange={handleRadio}
                value={checkBox}
              >
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
                onClick={reLoadData}
              >
                갱신
              </Button>
              <Button
                type="button"
                className={style.estimate_list_detail_btn}
                onClick={downloadFile}
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
              <RadioGroup defaultValue="all" onChange={handleRadio}>
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
                onClick={reLoadData}
              >
                갱신
              </Button>
              <Button
                type="button"
                className={style.estimate_list_detail_btn}
                onClick={downloadFile}
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

