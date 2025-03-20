import React from "react";
import { Container, Box, Text, Tabs } from "@chakra-ui/react";
import { LuUser, LuFolder } from "react-icons/lu";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent={"center"}
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work Sans" color="black">
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        color="black"
        p={4}
        borderRadius="lg"
        borderColor="white"
      >
        <Tabs.Root defaultValue="login">
          <Tabs.List
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb="1em"
            borderRadius="lg"
            overflow="hidden"
            borderColor="white"
          >
            <Tabs.Trigger
              value="login"
              flex="1"
              p="2"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              color="black"
              bg="gray.100"
              transition="background-color 0.3s"
              _selected={{
                bg: "#89d1fb",
              }}
              borderRight="1px solid white"
              borderTopLeftRadius="2xl"
              borderBottomLeftRadius="2xl"
            >
              <LuUser size={20} />
              <Text paddingBottom="7px">Login</Text>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="signup"
              flex="1"
              p="2"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              bg="gray.100"
              color="black"
              transition="background-color 0.3s"
              _selected={{
                bg: "#89d1fb",
              }}
              borderTopRightRadius="3xl"
              borderBottomRightRadius="3xl"
            >
              <LuFolder size={20} />
              <Text paddingBottom="7px">Sign Up</Text>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="login" p="4" borderRadius="lg" bg="gray.50">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="signup" p="4" borderRadius="lg" bg="gray.50">
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default HomePage;
