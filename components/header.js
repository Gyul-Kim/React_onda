import styles from "../styles/Home.module.css";
import {
  Box,
  Button,
  Center,
  SimpleGrid,
  Heading,
  Flex,
  Spacer,
  Square,
  Badge,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Typeahead, withAsync } from "react-bootstrap-typeahead";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { GetCookie, GoSearch } from "../provider/common";
import { authLogout } from "../provider/auth";
import { useRecoilState } from "recoil";
import { cartCntState, estimateCntState } from "../atoms/state";
import { GetCartCnt } from "../pages/api/cart";
import { getEstimateDataCnt } from "../pages/api/estimate";
import Btn from "../components/common/btn";
import { set } from "js-cookie";

const AsyncTypeahead = withAsync(Typeahead);

export default function Header(props) {
  const router = useRouter();
  const { keyword } = router.query; //미리 할당을 해줘야 처리됨
  const [inputKeyword, setInputKeyword] = useState(keyword);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [cartBadge, setCartBadge] = useState("red");
  const [cartCnt, setCartCnt] = useRecoilState(cartCntState);
  const [estimateCnt, setEstimateCnt] = useRecoilState(estimateCntState);

  useEffect(() => {
    isLoginCheck();
    showCnt();
  }, []);

  async function isLoginCheck() {
    const isLogin = await GetCookie("isLogin");
    setIsLogin(Number(isLogin));
  }

  const showCnt = async () => {
    setCartCnt(await GetCartCnt());
    //GetCartCnt();
    const estimateCnt = await getEstimateDataCnt();
    setEstimateCnt(estimateCnt);
  };

  // 로그아웃 기능
  const _handleLogout = async () => {
    await authLogout();
  };

  const _handleAutocomplete = (query) => {
    query = encodeURIComponent(query);
    setisLoading(true);
    setInputKeyword(query);
    fetch(
      process.env.SEARCH_API_URL + `/search?keyword=${query}&type=autocomplete`
    )
      .then((resp) => resp.json())
      .then(({ data }) => {
        const options = data.hits.hits.map((i) => ({
          id: Number(i._id),
          login: i._source.it_name,
          it_name: i._source.it_name,
        }));
        setOptions(options);
        setisLoading(false);
      });
  };

  const onClick = async (e) => {
    e.preventDefault();
    if (!inputKeyword) {
      alert("검색어를 입력하세요");
    } else {
      window.location.href =
        "/search/lists?keyword=" + encodeURIComponent(inputKeyword);
    }
    return;
  };

  const onChange = (e) => {
    setInputKeyword(e.target.value);
  };
  return (
    <>
      <Box className="header">
        <Box bg="" w="95%" pt={5} pb={5} color="#555" className="top-bar">
          <Box
            className="top-bar_box"
            variant="ghost"
            size="md"
            fontSize={14}
            p="0"
          >
            BETA
          </Box>
          {isLogin === 1 ? (
            <Box width="130px" className="flex-between">
              <Box width="30px">
                <Link href="/mypage/orders">mypage</Link>
              </Box>

              <Button
                onClick={() => _handleLogout()}
                className="logout-btn"
                width="30px"
              >
                logout
              </Button>
            </Box>
          ) : (
            <Box width="280px" className="flex-between">
              <Box width="30px" pl="10px">
                <Link href="/auth/login">login</Link>
              </Box>
            </Box>
          )}
        </Box>
        <Box className="search-bar">
          <Flex color="white" w="95%" h="80px" className="search-gnb">
            <Center w="260px!important">
              <Box className={"header-logo cursor"} w>
                <Link href="/" className="onda-logo">
                  <img
                    src="/images/ondalogo.png"
                    alt="로고"
                    style={{ display: "block" }}
                  />
                </Link>
              </Box>
            </Center>

            <Box className={"header-link"}>
              <Link p="4" href="quotation/quotation_reply_list">
                판매관리
              </Link>
            </Box>
            <Box className={"header-link"}>
              <Link p="4" href="#" onClick={() => {}} className={"header-link"}>
                재고관리
              </Link>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
}
