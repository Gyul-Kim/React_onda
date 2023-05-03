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

import "tui-grid/dist/tui-grid.min.css";
import "axios-progress-bar/dist/nprogress.css";
import { removeData } from "jquery";
import { reset } from "numeral";
import { areIntervalsOverlapping } from "date-fns";
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

async function getPartnerData(keyword) {
  try {
    let URL = process.env.API_URL + "/api/;
    if (keyword) {
      URL += `?keyword=${keyword}`;
    }

    //`?keyword=${offset}&page=${page}`;
    const res = await axios.get(URL, {
      headers: {
        "content-type": "application/json",
        // Authorization: `Bearer ${await GetCookie("token")}`,
      },
    });
    if (res.data.status === 200) {
      return res.data;
    }
    if (res.data.status === 204) {
      return null;
    }
    return 0;
  } catch (e) {
    return 0;
  }
}

// 견적서 tui grid
export default function QuotationConditionsTable(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const urlParams = new URLSearchParams(window.location.search);
  loadProgressBar();
  const ref = useRef();

  const ref_partner = useRef();
  const ref_estimate_partner = useRef();

  const es_id = props.es_id;
  const type = urlParams.get("type");
  const [data, setData] = useState();
  const [keyword, setKeyword] = useState();
  const [mb_id, setMbId] = useState(null);

  const [dataPartner, setDataPartner] = useState();
  const [dataSendPartner, setDataSendPartner] = useState();

  useEffect(() => {
    initPartnerData();
  }, []);

  const initPartnerData = async () => {
    try {
      const res = await getPartnerData();
      setDataPartner(res.data.partners);
    } catch (e) {
      // setLoadingShow(false);
    }
  };

  const urlFromOndaQuotation =
    process.env.API_URL + `/api/${}`;

  const [keywordData, setKeywordData] = useState({
    it_maker: "",
  });

  // 데이터 로드
  const loadData = async (props) => {
    // await axios.get(urlFromOndaQuotation).then((res) => {
    //   setData(res.data.data);
    //   getMbId();
    // });

    let beforeOndaPC = [
      {
        data_num: 1,
        data_type: "parent",
        partnumber: "WR04X000PTL",
        manufacturer: "WALSIN",
        it_maker: "arrow",
        sku: "3772975",
        qty: "300",
        korean_price_attr: "12455",
        korean_est_price_attr: "10000",
        korean_total_est_price: "3000000",
        quantity: 10000,
        packaging: "In Stock",
        dc: "",
        lead_time: 3,
      },
      {
        data_num: 2,
        data_type: "parent",
        partnumber: "WR04X000PTL",
        manufacturer: "WALSIN",
        it_maker: "digikey",
        sku: "3772975",
        qty: "400",
        korean_price_attr: "13455",
        korean_est_price_attr: "10000",
        korean_total_est_price: "4000000",
        quantity: 10000,
        packaging: "Cut Stripes",
        dc: "",
        lead_time: 5,
      },
      {
        data_num: 3,
        data_type: "parent",
        partnumber: "WR04X000PTL",
        manufacturer: "WALSIN",
        it_maker: "mouser",
        sku: "3772975",
        qty: "500",
        korean_price_attr: "11455",
        korean_est_price_attr: "10000",
        korean_total_est_price: "5000000",
        quantity: 10000,
        packaging: "Tube",
        dc: "",
        lead_time: 4,
      },
    ];
    setData(beforeOndaPC);
  };

  const getMbId = async () => {
    //로그인 했을때만 mb_id를 던지도록 보완
    const isLogin = await isLoginCheck();
    if (isLogin) {
      const info = await decodeToken();
      setMbId(info.payload.mb_id);
    } else {
      setMbId(null);
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
      name: "partnumber",
      className: "font12",
      // renderer: {
      //   type: EsitmateCustomPartnumberRenderer,
      // },
      minWidth: 130,
      hidden: false,
      filter: "select",
    },

    {
      header: "부품번호",
      name: "manufacturer",
      className: "font12",
      hidden: false,
      minWidth: 130,
    },
    {
      header: "제조사",
      name: "it_maker",
      className: "font12",
      hidden: false,
      minWidth: 60,
    },
    {
      header: "유통사",
      name: "it_maker",
      className: "font12",
      hidden: false,
      minWidth: 60,
    },
    {
      header: "요청수량",
      name: "sku",
      className: "font12",
      hidden: false,
      minWidth: 60,
    },
    {
      header: "견적가",
      name: "qty",
      className: "font12",
      renderer: {
        type: EstimateCustomCommonRenderer,
        options: {
          type: "number",
        },
      },
      align: "center",
      width: 60,
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
      className: "font12",
      hidden: false,
      minWidth: 70,
    },
    {
      header: "packaging",
      name: "packaging",
      className: "font12",
      hidden: false,
      minWidth: 70,
    },
    {
      header: "납기(Lead Time)",
      name: "lead_time",
      className: "font12",
      hidden: false,
      minWidth: 70,
    },
  ];

  const handleSearch = async () => {
    (async () => {
      if (keyword == null || keyword == "undefined") {
        alert("검색어 입력은 필수입니다.");
        return;
      }

      try {
        const res = await getPartnerData(keyword);
        setDataPartner(res.data.partners);
      } catch (e) {
        // setLoadingShow(false);
      }
    })();
  };

  const handleSelect = async () => {
    const rows = ref_partner.current.getInstance().getCheckedRows();

    if (rows.length != 0) {
      if (dataSendPartner === undefined) {
        let dt_ids = rows.map((item) => {
          return {
            id: item.id,
            partner_name: item.partner_name,
            _attributes: { checkDisabled: false, checked: true },
          };
        });

        setDataSendPartner(dt_ids);
      } else {
        let dt_ids = ref_estimate_partner.current.getInstance().getData();

        rows.map((item) => {
          let ret = dataSendPartner.find((el, idx, data) => {
            if (el.id === item.id) {
              return true;
            }
          });

          if (ret == undefined) {
            dt_ids.push({
              id: item.id,
              partner_name: item.partner_name,
              _attributes: { checkDisabled: false, checked: true },
            });
          }
        });
        setDataSendPartner(dt_ids);
      }
    }
  };

  // 유통사 선택 견적요청하기
  const requestQuotationFromDistribution = async () => {
    // 추후 체크하는 견적 내역 변경때 사용
    let rows = ref.current.getInstance().getCheckedRows();

    if (rows.length === 0) {
      alert("견적요청할 부품번호 선택은 필수입니다.");
      return;
    }
    onOpen();
  };

  // 유통사 선택 견적 요청한 후, 데이터 세팅
  const handleAfterData = async () => {
    let childrenRows = ref_estimate_partner.current
      .getInstance()
      .getCheckedRows();
    let rows = ref.current.getInstance().getCheckedRows();
    let body = [];

    if (childrenRows == 0) {
      alert("견적대상 유통사를 선택해야 합니다.");
      return;
    }

    for (let i = 0; i < rows.length; i++) {
      body[i] = {
        dtl_id: rows[i].dtl_id,
        data_num: rows[i].data_num,
        partnumber: rows[i].partnumber,
        manufacturer: rows[i].manufacturer,
        it_maker: rows[i].it_maker,
        sku: rows[i].sku,
        qty: rows[i].qty,
        quantity: rows[i].quantity,
        korean_price_attr: rows[i].korean_price_attr,
        korean_est_price_attr: rows[i].korean_est_price_attr,
        korean_total_est_price: rows[i].korean_total_est_price,
        packaging: rows[i].packaging,
        dc: rows[i].dc,
        lead_time: rows[i].lead_time,
        _children: [],
      };

      for (let j = 0; j < childrenRows.length; j++) {
        body[i]._children.push({
          data_type: "child",
          partnumber: rows[i].partnumber,
          manufacturer: rows[i].manufacturer,
          it_maker: childrenRows[j].id,
          sku: "",
          qty: "",
          korean_price_attr: "",
          korean_est_price_attr: "",
          korean_total_est_price: "",
          quantity: "",
          packaging: "",
          dc: "",
          lead_time: "",
        });
      }
    }

    // try {
    //   if (keywordRows == 0) {
    //     alert("유통사 선택은 필수입니다.");
    //     return;
    //   }

    //   if (childrenRows == 0) {
    //     alert("견적대상 유통사를 선택해야 합니다.");
    //     return;
    //   }
    //   onClose();
    // } catch (e) {
    //   console.log(e);
    // }

    onClose();
  };

  // 판다파츠 견적회신하기
  const replyQuotationToPandaParts = async () => {};

  // [유통사 선택 젼적 요청하기] 모달창 검색
  const searchKeyword = useCallback((e) => {
    keywordData.it_maker = e.target.value;
    setKeyword(e.target.value);
  });

  const columns_def = [
    {
      header: "유통사번호",
      name: "id",
      minWidth: 130,
      className: "font12",
      hidden: false,
      filter: "select",
    },

    {
      header: "유통사명",
      name: "partner_name",
      minWidth: 260,
      className: "font12",
      hidden: false,
    },
  ];

  useEffect(() => {
    if (!data) {
      loadData(es_id);
    }
  }, []);

  if (data) {
    return (
      <>
        <div className="mb-5 estimate-detail__body">
          <div className={style.quotation_reply_btns}>
            <div className={style.quotation_reply_btns_right}>
              <Button
                type="button"
                className={style.estimate_list_detail_btn}
                onClick={requestQuotationFromDistribution}
              >
                엑셀 다운로드
              </Button>
            </div>
          </div>
          <div className={style.quotation_reply_table}>
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
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
