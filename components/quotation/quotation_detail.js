import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "@chakra-ui/react";
import Grid from "@toast-ui/react-grid";
import TuiGrid from "tui-grid";
import style from "../../styles/Home.module.css";
import { GetCookie } from "../../provider/common";
import { decodeToken } from "../../provider/auth";
import { loadProgressBar } from "axios-progress-bar";

import Pagination from "react-js-pagination";

import "tui-grid/dist/tui-grid.min.css";
import "axios-progress-bar/dist/nprogress.css";
import { check } from "prettier";

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
      background: "#f6f6f6 ",
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

export async function downloadExcel(workbook) {
  // 엑셀 다운로드
  workbook.xlsx
    .writeBuffer()
    .then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      let anchor = document.createElement("a");
      let url = URL.createObjectURL(blob);
      anchor.href = url;
      anchor.download = "Ondaparts_Quotation" + ".xlsx";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    })
    .catch((err) => console.log(err));
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
    "&type=incomplete";
  let fileName = "ondaparts_quotation.xlsx";

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
      alert("견적서 다운로드가 완료되었습니다.");
    })
    .catch(() => alert("다운로드 에러"));
}

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const url = process.env.ONDA_API_URL + "/api/quotation/upload_quotation_xls";
  const option = {
    method: "POST",
    mode: "no-cors",
    header: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  };

  fetch(url, option).then((response) => console.log(response));
};

// 견적서 tui grid
export default function EstimateGrid(props) {
  const urlParams = new URLSearchParams(window.location.search);
  loadProgressBar();
  const ref = useRef();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(1);
  const [data, setData] = useState();

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const [file] = [event.target.files[0]];
    uploadFile(file);

    hiddenFileInput.current.value = "";
  };

  // 데이터 로드
  const loadData = async () => {
    // 토큰 설정 -> 해당 유저 it_maker 값 필요
    const token = await GetCookie("ondaPcToken");
    const tokenInfo = await decodeToken(token);
    const quotationInfoId = tokenInfo.payload.it_maker;

    // 온다파츠 견적 회신 리스트(총 데이터)
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

    // 온다파츠 견적 회신 리스트(총 개수)
    let countURL =
      process.env.ONDA_API_URL +
      "/api/quotation/id/detail/onlycount/" +
      `${quotationInfoId}` +
      "?status=incomplete";

    const count = await axios.get(countURL, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer` + token,
      },
    });
    setPerPage(perPage);
    setTotal(count.data.data);
    setData(res.data.data);
    console.log(res.data.data);
  };

  // 엑셀 다운로드 부분
  const downloadFilePart = async () => {
    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet();
    const checkedRows = ref.current.getInstance().getCheckedRows();
    const columnArr = ["A", "B", "C", "D", "E", "F", "G", "H"];

    if (checkedRows == 0) {
      alert("다운로드할 견적번호를 선택하세요.");
      return;
    }

    let jsonData = [];
    for (let row of checkedRows) {
      let arr = [];
      arr.push(row["rply_id"]);
      arr.push(row["partnumber"]);
      arr.push(row["manufacturer"]);
      arr.push(Number(row["quantity"]).toLocaleString());
      arr.push(`₩ ${Number(row["price"]).toLocaleString()}`);
      arr.push(row["dc"]);
      arr.push(row["packaging"]);
      arr.push(row["leadtime"]);
      jsonData.push(arr);
    }

    worksheet.properties.outlineLevelCol = 2;
    worksheet.properties.defaultRowHeight = 15;

    // css
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 30;

    worksheet.addTable({
      name: "MyTable",
      ref: "A1",
      style: {
        theme: "TableStyleMedium2",
      },

      columns: [
        { name: "견적번호" },
        { name: "부품번호" },
        { name: "제조사" },
        { name: "요청수량" },
        { name: "견적가" },
        { name: "제조일" },
        { name: "Packaging" },
        { name: "납기" },
      ],

      rows: [...jsonData],
    });

    await downloadExcel(workbook);
  };

  // 온다 마스터로 견적 회신하기
  const replyQuotationMaster = async () => {
    try {
      const checkedRows = ref.current.getInstance().getCheckedRows();
      // validation (checkedRows 0개 막기)
      if (checkedRows.length == 0) {
        alert("견적번호를 선택해주세요");
        return;
      }

      let body = { quotationsLists: [] };
      // validation (견적가 0 혹은 미입력일 경우 막기)
      for (const row of checkedRows) {
        if (row.price == 0) {
          alert("견적가는 0 혹은 미입력일 경우 회신할 수 없습니다.");
          return;
        }

        if (row.dc === null) {
          alert("제조년(D/C)을 입력해주세요. 예시(23+)");
          return;
        }

        if (row.packaging === null) {
          alert("Packaging 입력해주세요.");
          return;
        }

        if (row.leadtime === null) {
          alert("납기를 입력해 주세요. 예시(3WKS)");
          return;
        }

        body.quotationsLists.push({
          rply_id: row.rply_id,
          quantity: row.quantity,
          price: row.price,
          manufacturer: row.manufacturer,
          partnumber: row.partnumber,
          dc: row.dc,
          packaging: row.packaging,
          leadtime: row.leadtime,
          es_state: "replytomasterpanda",
          q_dtl_id: row.q_dtl_id,
          stock: row.stock,
        });
      }

      let replyURL = process.env.ONDA_API_URL + "/api/quotation/partner";

      const res = await axios.post(replyURL, body, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${await GetCookie("ondaPcToken")}`,
        },
      });

      if (res.data.status === 200) {
        alert("견적 회신이 완료되었습니다.");
        setTimeout(function () {
          location.reload();
        }, 1250);
      } else {
        alert("견적 회신에 실패하였습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 온다 마스터로 견적 회신하기
  const saveAsTemp = async () => {
    try {
      const checkedRows = ref.current.getInstance().getCheckedRows();
      // validation (checkedRows 0개 막기)
      if (checkedRows.length == 0) {
        alert("견적번호를 선택해주세요");
        return;
      }

      let body = { quotationsLists: [] };
      // validation (견적가 0 혹은 미입력일 경우 막기)
      for (const row of checkedRows) {
        body.quotationsLists.push({
          rply_id: row.rply_id,
          quantity: row.quantity,
          price: row.price,
          manufacturer: row.manufacturer,
          partnumber: row.partnumber,
          dc: row.dc,
          packaging: row.packaging,
          leadtime: row.leadtime,
          stock: row.stock,
          es_state: "incomplete",
        });
      }

      let replyURL = process.env.ONDA_API_URL + "/api/quotation/saveastemp";

      const res = await axios.post(replyURL, body, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${await GetCookie("ondaPcToken")}`,
        },
      });

      if (res.data.status === 200) {
        alert("임시 저장이 완료되었습니다.");
        setTimeout(function () {
          location.reload();
        }, 1250);
      } else {
        alert("임시 저장이 실패하였습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 컬럼 설정
  const columns = [
    {
      header: "순번",
      name: "",
      width: 30,
      className: "font12 text-center",
      renderer: {
        type: EstimateDataNumCustomRenderer,
      },
      filter: "select",
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
      width: 80,
      hidden: false,
    },
    {
      header: "제조사",
      name: "manufacturer",
      className: "font12 text-center",
      hidden: false,
      minWidth: 60,
    },
    {
      header: "셀러",
      name: "name",
      className: "font12 text-center",
      hidden: false,
      width: 70,
    },
    {
      header: "요청수량",
      name: "quantity",
      className: "font12 text-center",
      width: 90,
    },
    {
      header: "재고",
      name: "stock",
      className: "font12 text-center",
      editor: "text",
      renderer: {
        type: EstimateCustomCommonRenderer,
        options: {
          type: "number",
        },
      },
      width: 90,
    },
    {
      header: "견적가",
      name: "price",
      className: "font12 text-center",
      editor: "text",

      renderer: {
        type: EstimateCustomCommonRenderer,
        options: {
          type: "number",
        },
      },
      width: 120,
    },
    {
      header: "합계",
      name: "quotation_sum",
      className: "font12 text-center",
      hidden: false,
      renderer: {
        type: EstimateCustomCommonRenderer,
        options: {
          type: "number",
        },
      },
      width: 100,
    },
    {
      header: "제조년(D/C)",
      name: "dc",
      className: "font12 text-center",
      hidden: false,
      minWidth: 70,
      editor: "text",
    },
    {
      header: "packaging",
      name: "packaging",
      className: "font12 text-center",
      hidden: false,
      minWidth: 70,
      editor: "text",
    },
    {
      header: "납기(Lead Time)",
      name: "leadtime",
      className: "font12 text-center",
      hidden: false,
      minWidth: 70,
      editor: "text",
    },
    {
      header: "등록일",
      name: "CREATE_DATE",
      className: "font12",
      hidden: false,
      width: 90,
    },
  ];

  const handlePageChange = (page) => setPage(page);

  const reLoadData = async (e) => {
    try {
      loadData(e);
    } catch (e) {
      console.log("err " + e);
    }
  };

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
                onClick={downloadFile}
                style={{ marginRight: "10px" }}
              >
                엑셀 다운로드(전체)
              </Button>
              <Button
                type="button"
                className={style.estimate_list_detail_btn}
                onClick={downloadFilePart}
                style={{ marginRight: "10px" }}
              >
                엑셀 다운로드(선택)
              </Button>
              <Button
                type="button"
                className={style.estimate_list_detail_btn}
                onClick={handleClick}
              >
                엑셀 업로드
              </Button>
              <input
                type="file"
                accept=".xlsx, .xls"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </div>
            <div className={style.quotation_reply_btns_right}>
              <Button
                type="button"
                className={style.estimate_list_detail_btn}
                onClick={saveAsTemp}
              >
                임시저장
              </Button>
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
                onClick={replyQuotationMaster}
              >
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
    return (
      <>
        <div className="mb-5 estimate-detail__body quotation_reply_detail">
          <div className={style.quotation_reply_btns}>
            <div className={style.quotation_reply_btns_left}>
              <Button
                type="button"
                className={style.estimate_list_detail_btn}
                onClick={downloadFile}
                style={{ marginRight: "10px" }}
              >
                엑셀 다운로드
              </Button>
              <Button
                type="button"
                className={style.estimate_list_detail_btn}
                onClick={handleClick}
              >
                엑셀 업로드
              </Button>
              <input
                type="file"
                accept=".xlsx, .xls"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </div>
            <div className={style.quotation_reply_btns_right}>
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
                onClick={replyQuotationMaster}
              >
                견적회신하기
              </Button>
            </div>
          </div>
          <div className={style.quotation_reply_table}>
            <Grid
              ref={ref}
              columns={columns}
              columnOptions={{ resizable: true }}
              rowHeaders={[{ type: "checkbox", checked: false }]}
            />
          </div>
        </div>
      </>
    );
  }
}
