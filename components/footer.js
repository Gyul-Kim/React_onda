import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";

import { checkIEAccess } from "../provider/common";

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notice: [],
    };
  }
  componentDidMount() {
    checkIEAccess();
  }

  render() {
    const { notice } = this.state;
    return (
      <Box className="maxist_body">
        <Box w="100%" color="#555" borderColor="#ededed">
          <Flex maxWidth="1000px" margin="0 auto">
            <Box flex="1" bg="" pt={10} pb={10}>
              <Text
                style={{
                  display: "block",
                  textAlign: "center",
                  color: "#ccc",
                  fontSize: "12.5px",
                }}
              >
                @parts2023 All Rights Reserved
              </Text>
            </Box>
          </Flex>

          <Box
            bg=""
            borderTop="1px"
            borderColor="#ededed"
            w="100%"
            p={0}
            mb={5}
            color="#a3a5ad"
            fontSize={12}
            letterSpacing={-0.5}
          >

            <Text maxWidth="1000px" margin="0 auto" paddingTop="7">
             
            </Text>
            <Text
              maxWidth="1000px"
              margin="0 auto"
              textAlign="center"
              paddingTop={15}
            >
              구매, 배송, 반품, 취소, AS등에 대한 정책은 각 회사에 정책에
              따릅니다.{" "}
            </Text>
          </Box>
        </Box>
      </Box>
    );
  }
}
