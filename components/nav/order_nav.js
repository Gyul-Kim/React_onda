import { Box, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import Link from "next/link";
import { useRouter } from "next/router";

export default function OrderNav() {
  const { pathname } = useRouter();

  return (
    <Box className="order-list_nav">
      <Box className="base_container">
        <Box w="260px!important" h="100%"></Box>
        <Box className="orderlist_nav-box">
          <Text fontSize="13.5px" marginRight="20px">
            <Link href="/order/purchase">주문관리</Link>
          </Text>
          <Text fontSize="13.5px" marginRight="20px">
            <Link href="/order/purchase">출고관리</Link>
          </Text>
          <Text fontSize="13.5px">
            <Link href="/order/purchase">매출관리</Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
