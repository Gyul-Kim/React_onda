import { Box, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import Link from "next/link";
import { useRouter } from "next/router";

export default function QuotationNav() {
  const { pathname } = useRouter();

  return (
    <Box className="quotation-list_nav">
      <Box className="base_container">
        <Box w="260px!important" h="100%"></Box>
        <Box className="quotation-list_nav-box">
          <Text
            color={pathname === "/estimate/select" ? null : "bold"}
            fontSize="13.5px"
            marginRight="20px"
          >
            <Link href="/quotation/quotation_reply_list">견적회신하기</Link>
          </Text>
          <div></div>
          <Text
            color={
              pathname === "/quotation/quotation_reply_list" ? "bold" : null
            }
            fontSize="13.5px"
          >
            <Link href="/quotation/quotation_conditions">견적상황판</Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
