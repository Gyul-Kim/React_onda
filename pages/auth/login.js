import {
  Text,
  Input,
  Button,
  Checkbox,
  Stack,
  Center,
  Link,
  Box,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import BaseLayout from "../../components/base_layout";
import React, { useState, useCallback, useEffect } from "react";
import { authLogin, socialLoginPop } from "../../provider/auth";
import { SetToken, SetCookie, GetCookie } from "../../provider/common";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { before } = router.query;
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      if ((await GetCookie("isLogin")) === "1") {
        window.location.replace("/estimate/lists");
      }
    };
    checkLogin();
  }, []);

  // 로그인 버튼 함수
  const _handleSubmit = async () => {
    //로그인 검증하는 로딩하는 부분 띄우기
    //중복 클릭 방지등
    setIsLoading(true);
    //로그인 빈칸 검증
    if (email !== "" || password !== "") {
      const auth = await authLogin(email.trim(), password.trim());
      if (auth.status === 201) {
        await setIsLoading(true);
        await SetToken(auth.access_token);
        await SetCookie("isLogin", 1);
        //장바구니 숫자 최신화
        if (before == null) {
          window.location.replace("/");
        } else {
          // 이전페이지로 이동
          window.location.replace(before);
        }
      } else {
        setIsLoading(true);
        alert("잘못된 비밀번호 혹은 이메일을 입력하셨습니다.");
      }
    } else {
      alert("로그인 정보를 입력하세요");
    }
  };
  const keyPressLogin = (e) => {
    if (e.key === "Enter") {
      _handleSubmit();
    }
  };

  // input state 함수
  const handleEmail = useCallback((e) => {
    setEmail(e.target.value);
  });
  const handlepassword = useCallback((e) => {
    setPassword(e.target.value);
  });
  return (
    <BaseLayout>
      <Box className="base_container" w="400px!important">
        {/* <form onSubmit={onFormSubmit}> */}
        <Stack spacing={1} width={400} marginTop={20}>
          <Text>아이디(이메일)</Text>
          <Input
            variant="outline"
            id="id"
            name="email"
            placeholder="example@pandaparts.com"
            marginTop="2"
            padding="6"
            value={email}
            onChange={handleEmail}
            onKeyPress={keyPressLogin}
          />
        </Stack>
        <Stack spacing={1} width={400} marginTop={5}>
          <Text>비밀번호</Text>
          <Input
            variant="outline"
            placeholder="비밀번호 입력"
            id="password"
            name="password"
            padding="6"
            type={"password"}
            value={password}
            onChange={handlepassword}
            onKeyPress={keyPressLogin}
          />
        </Stack>
        <Checkbox
          size="md"
          colorScheme="red"
          marginRight="5"
          borderColor="gray.300"
          paddingTop="3"
        >
          자동로그인
        </Checkbox>
        <Stack spacing={4} direction="row" align="center">
          <Button
            // colorScheme="red"
            size="lg"
            width="100%"
            padding="7"
            marginTop={5}
            fontSize="16"
            letterSpacing="-1px"
            onClick={() => _handleSubmit()}
            onKeyPress={() => keyPressLogin()}
            bg="#272953"
            color="#fff"
          >
            로그인
          </Button>
        </Stack>
      </Box>
    </BaseLayout>
  );
}
