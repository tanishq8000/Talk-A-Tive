import React, { useState } from "react";
import { VStack, Input, Button } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { PasswordInput } from "E:/MERN CHAT APP/frontend/src/components/ui/password-input.jsx";
import { toaster } from "E:/MERN CHAT APP/frontend/src/components/ui/toaster.jsx";

import axios from "axios";
import { useHistory } from "react-router-dom";
import { useChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [email, setEmail] = useState();
  const { setUser } = useChatState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toaster.create({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 4000,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toaster.create({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        position: "bottom",
        type: "success",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <Field name="email" label="Email" id="email" required>
        <Input
          type="email"
          value={email}
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>

      <Field name="password" label="Password" id="password" required>
        <PasswordInput
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>

      <Button
        colorPalette="blue"
        width="100%"
        loading={loading}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>

      <Button
        variant="solid"
        colorPalette="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
