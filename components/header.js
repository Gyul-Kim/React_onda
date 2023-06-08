import styles from "../styles/Home.module.css";
import { Box, Button, Center, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { GetCookie } from "../provider/common";
import { authLogout, decodeToken } from "../provider/auth";

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState();

  async function isLoginCheck() {
    const isLogin = await GetCookie("isLogin");
    setIsLogin(Number(isLogin));

    if (isLogin == 1) {
      const token = await GetCookie("ondaPcToken");
      const tokenInfo = await decodeToken(token);
      setUserName(tokenInfo.payload.name);
    }
  }

  // 로그아웃 기능
  const _handleLogout = async () => {
    await authLogout();
  };

  const handleAlert = () => alert("준비 중입니다.");

  useEffect(() => {
    isLoginCheck();
  }, []);

  return (
    <>
      <Box className="header">
        <Box bg="" w="95%" pt={5} pb={5} color="#555" className="top-bar">
          {isLogin === 1 ? (
            <>
              <Box
                className="top-bar_box"
                variant="ghost"
                size="md"
                fontSize={14}
                p="0"
              >
                환영합니다! {userName} 님
              </Box>
              <Box className="flex-between">
                <Button
                  onClick={() => _handleLogout()}
                  className="logout-btn"
                  width="30px"
                >
                  logout
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box
                className="top-bar_box"
                variant="ghost"
                size="md"
                fontSize={14}
                p="0"
              >
                환영합니다!
              </Box>
              <Box width="fit-content" className="flex-between">
                <Box pl="10px">
                  <Link href="/auth/login" passHref>
                    login
                  </Link>
                </Box>
              </Box>
            </>
          )}
        </Box>
        <Box className="search-bar">
          <Flex color="white" w="95%" h="80px" className="search-gnb">
            <Center w="260px!important">
              <Box className={"header-logo cursor"} w>
                <Link href="/" className="onda-logo" passHref>
                  <img
                    src="/images/ondalogo.png"
                    alt="로고"
                    style={{ display: "block" }}
                  />
                </Link>
              </Box>
            </Center>

            <Box className={"header-link"}>
              <Link p="4" href="/quotation/quotation_reply_list" passHref>
                판매관리
              </Link>
            </Box>
            <Box className={"header-link"}>
              <div
                p="0"
                onClick={handleAlert}
                className={"header-link"}
                style={{ marginLeft: "0", cursor: "pointer" }}
              >
                재고관리
              </div>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
}

