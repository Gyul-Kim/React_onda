import ReactDOM from "react-dom";
import { Button } from "@chakra-ui/react";
import Grid from "@toast-ui/react-grid";
import TuiGrid from "tui-grid";
import style from "../../styles/Home.module.css";
import { GetCookie } from "../../provider/common";
import { loadProgressBar } from "axios-progress-bar";

import Pagination from "react-js-pagination";

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
export default function EstimateGrid(props) {
  const urlParams = new URLSearchParams(window.location.search);
  loadProgressBar();
  const ref = useRef();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [total, setTotal] = useState(1);

  const es_id = props.es_id;
  const [data, setData] = useState();

  // 데이터 로드
  const loadData = async () => {
    try {
      let URL =
        process.env.ONDA_API_URL +
        "/api/quotation/count" +
        `?offset=${perPage}&page=${page}`;

      const res = await axios.get(URL, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${await GetCookie("token")}`,
        },
      });

      setPerPage(perPage);
      setTotal(9);
      setData(res.data.data);

      console.log(page);
    } catch (e) {}
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

  // const columns = [
  //   {
  //     header: "순번",
  //     name: "req_id",
  //     width: 30,
  //     className: "font12 text-center",

  //     filter: "select",
  //   },
  //   {
  //     header: "순번",
  //     name: "p_es_id",
  //     width: 30,
  //     className: "font12 text-center",

  //     filter: "select",
  //   },
  // ];

  const handlePageChange = (page) => setPage(page);
  const handleAlert = () => alert("준비 중입니다.");

  useEffect(() => {
    loadData();
  }, [page]);

  if (data) {
    return (
      <>
        <div className="mb-5 estimate-detail__body quotation_reply_detail">
          <div className={style.quotation_reply_btns}>
            <div className={style.quotation_reply_btns_left}>
              <Button
                type="button"
                className={style.estimate_list_detail_btn}
                onClick={handleAlert}
              >
                Excel 견적서 다운로드
              </Button>
              <Button
                type="button"
                className={style.estimate_list_detail_btn}
                onClick={handleAlert}
              >
                Excel 견적서 업로드
              </Button>
            </div>
            <div className={style.quotation_reply_btns_right}>
              <Button type="button" className={style.estimate_list_detail_btn}>
                견적회신하기
              </Button>
            </div>
          </div>
          <div className={style.quotation_reply_table}>
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

