import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  Text,
  Button,
  Select,
  Box,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import Grid from "@toast-ui/react-grid";
import TuiGrid from "tui-grid";
import { loadProgressBar } from "axios-progress-bar";
import { decodeToken } from "../../provider/auth";
import { GetCookie } from "../../provider/common";

import style from "../../styles/Home.module.css";
import Btn from "../common/btn";
import Pagination from "react-js-pagination";
import WriteInput from "../common/writeInput";

import "tui-grid/dist/tui-grid.min.css";
import "axios-progress-bar/dist/nprogress.css";
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
      element = (
        <button
          onClick={() => this.onClick()}
          className="btn chakra-link chakra-button btn-primary font-11"
        >
          선택
        </button>
      );
    }
    ReactDOM.render(element, this.el);
  }
}

// 제조사 렌더러
export class EsitmateCustomPartnumberRenderer {
  constructor(props) {
    const el = document.createElement("a");
    this.el = el;
    this.value = props.value; // 초기 값
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    this.el.classList.add("ml-2");
    // 수정된 text로 변경한다.
    let row = props.grid.getRow(props.rowKey);
    this.el.textContent = props.value;
    if (row.stock_no) {
      this.el.href = `/parts/view/PD${Number(row.stock_no)}`;
      this.el.target = "_blank";
      this.el.classList.add("text-primary");
    }
    if (row.data_num !== null) {
      if (row.data_type === "child") {
        this.el.classList.add("font12");
      } else {
        this.el.classList.add("font-weight-bold");
      }
      // 초기값과 변경된 값이 다르다면
      if (props.value) {
        if (this.value !== props.value) {
          const i = document.createElement("i");
          i.className = "fas fa-check text-success ml-2";
          this.el.append(i);
        } else {
        }
        this.value = props.value;
      }
    }
  }
}

// 요청수량 렌더러
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
export default function PurchaseAdminGrid(props) {
  const urlParams = new URLSearchParams(window.location.search);
  loadProgressBar();
  const ref = useRef();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(1);
  const [data, setData] = useState();

  const [released, setReleased] = useState("");
  const [inReleased, setInReleased] = useState("");
  const [cancelled, setCancelled] = useState("");

  const [text, setText] = useState("");
  const [value, setValue] = useState("");

  // 데이터 로드
  const loadData = async (e) => {
    // 토큰 설정 -> 해당 유저 it_maker 값 필요
    const token = await GetCookie("token");
    const tokenInfo = await decodeToken(token);
    const orderInfoId = tokenInfo.payload.it_maker;

    let URL =
      process.env.ONDA_API_URL +
      "/api/order/partner/" +
      `${orderInfoId}?offset=${perPage}&page=${page}`;

    const res = await axios.get(URL, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer` + token,
      },
    });

    setData(res.data.data);
    setPerPage(perPage);
    setTotal(res.data.data.length);

    //견적 상황판 완료 및 미완료 금액 설정
    const releaseMoneyURL =
      process.env.ONDA_API_URL + "/api/order/partner/ReleaseSum";
    const releaseRes = await axios.post(releaseMoneyURL, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${await GetCookie("token")}`,
      },
    });

    setReleased(releaseRes.data.data.completeSum);
    setInReleased(releaseRes.data.data.onGoingSum);
    setCancelled(releaseRes.data.data.cancecledSum);

    if (e == "all") {
      let URL =
        process.env.ONDA_API_URL +
        "/api/order/partner/" +
        `${orderInfoId}?offset=${perPage}&page=${page}&type=all`;
      const res = await axios.get(URL, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer` + token,
        },
      });
      setData(res.data.data);
    }

    // 견적완료 리스트
    if (e == "ongoing") {
      let URL =
        process.env.ONDA_API_URL +
        "/api/order/partner/" +
        `${orderInfoId}?offset=${perPage}&page=${page}&type=placed`;
      const res = await axios.get(URL, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer` + token,
        },
      });
      setData(res.data.data);
    }

    // 견적 미완료 전체 리스트
    if (e == "confirmed") {
      let URL =
        process.env.ONDA_API_URL +
        "/api/order/partner/" +
        `${orderInfoId}?offset=${perPage}&page=${page}&type=incomplete`;
      const res = await axios.get(URL, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer` + token,
        },
      });
      setData(res.data.data);
    }

    if (e == "cancelled") {
      let URL =
        process.env.ONDA_API_URL +
        "/api/order/partner/" +
        `${orderInfoId}?offset=${perPage}&page=${page}&type=cancelled`;
      const res = await axios.get(URL, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer` + token,
        },
      });
      setData(res.data.data);
    }
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
      filter: "select",
    },
    {
      header: "견적번호",
      name: "od_id",
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
      width: 150,
    },
    {
      header: "상태",
      name: "od_status",
      className: "font12 text-center",
      hidden: false,
      minWidth: 130,
    },
    {
      header: "제조사",
      name: "manufacturer",
      className: "font12 text-center",
      hidden: false,
      minWidth: 60,
    },
    {
      header: "유통사",
      name: "it_maker",
      className: "font12 text-center",
      hidden: false,
      minWidth: 60,
    },
    {
      header: "요청수량",
      name: "quantity",
      className: "font12 text-center",
      hidden: false,
      width: 60,
    },
    {
      header: "견적가",
      name: "panda_price",
      className: "font12 text-center",
      renderer: {
        type: EstimateCustomCommonRenderer,
        options: {
          type: "number",
        },
      },
      align: "center",
      width: 80,
      className: "font-12",
    },

    {
      header: "합계",
      name: "quantity",
      hidden: false,
      align: "center",
      renderer: {
        type: EstimateCustomCommonRenderer,
        options: {
          type: "number",
        },
      },
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

  // 주문확정하기
  const confirmOrder = async () => {
    try {
      let rows = ref.current.getInstance().getCheckedRows();

      if (rows.length === 0) {
        alert("주문 확정할 부품번호 선택은 필수입니다.");
        return;
      }

      let body = {};
      for (let i = 0; i < rows.length; i++) {
        body[i] = {
          od_id: rows[i].od_id,
          p_it_maker: rows[i].p_it_maker,
          od_status: "confirmed",
          price: rows[i].price,
          panda_price: rows[i].panda_price,
          manufacturer: rows[i].manufacturer,
          partnumber: rows[i].partnumber,
          quantity: rows[i].quantity,
          dc: rows[i].dc,
          p_es_id: rows[i].p_es_id,
          leadtime: rows[i].leadtime,
          packaging: rows[i].packaging,
        };
      }

      let URL = process.env.ONDA_API_URL + "/api/order/partner/changeStatus";

      const res = await axios.get(URL, body, {
        headers: {
          "content-type": "application/json",
        },
      });

      if (res.status === 200) {
        alert("주문확정이 완료되었습니다.");
        setTimeout(function () {
          location.reload();
        }, 1000);
      } else {
        alert("다시 시도해주세요");
      }
    } catch (e) {
      console.log("err " + e);
    }
  };

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
    const orderInfoId = tokenInfo.payload.it_maker;
    try {
      // 검색어와 부품번호 및 제조사 선택 했을 때
      if (text && value) {
        let searchURL =
          process.env.ONDA_API_URL +
          "/api/order/partner/" +
          `${orderInfoId}?offset=${perPage}&page=${page}&search=${value}&name=${text}`;
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
          "/api/order/partner/" +
          `${orderInfoId}?offset=${perPage}&page=${page}&type=all`;
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
    loadData(data);
  }, []);

  if (data) {
    return (
      <>
        <div className={style.search_area_menu}>
          <div className={style.search_business_box}>
            <div className={style.search_business_indicator_box}>
              <Text>진행 중인 매출</Text>
              <Text> {released}</Text>
            </div>
            <div className={style.search_business_indicator_box}>
              <Text>매출촐합(완료)</Text>
              <Text>{inReleased}</Text>
            </div>
            <div className={style.search_business_indicator_box}>
              <Text>취소 금액</Text>
              <Text>{cancelled}</Text>
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
                  <Radio value="confirmed">매출총합</Radio>
                  <Radio value="ongoing">진행 중인 매출</Radio>
                  <Radio value="cancelled">매출 취소</Radio>
                </Stack>
              </RadioGroup>
            </div>
          </div>
        </div>
        <div className="mb-5 estimate-detail__body">
          <div className={style.order_btns}></div>
          <div className={style.order_conditions_table}>
            <Grid
              ref={ref}
              data={data}
              columns={columns}
              columnOptions={{ resizable: true }}
              heightResizable={true}
              w="100%"
              treeColumnOptions={{
                name: "partnumber",
                useIcon: false,
                useCascadingCheckbox: true,
              }}
              rowHeaders={[{ type: "checkbox", checked: false }]}
              refresh={() => loadData()}
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
