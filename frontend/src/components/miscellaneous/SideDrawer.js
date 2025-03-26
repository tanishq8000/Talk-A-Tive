import { useState } from "react";
import React from "react";
import {
  Box,
  Text,
  Button,
  Avatar,
  Input,
  Spinner,
  Drawer,
  CloseButton,
} from "@chakra-ui/react";
import { Tooltip } from "E:/MERN CHAT APP/frontend/src/components/ui/tooltip.jsx";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";
import { FaBell, FaCircleChevronDown } from "react-icons/fa6";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { toaster } from "../ui/toaster";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvataar/UserListItem";

const TriggerButton = ({ children }) => {
  const [search, setSearch] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const { user, setSelectedChat, chats, setChats } = ChatState();

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: "Please Enter something in search",
        status: "warning",
        duration: 4000,
        type: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Failed to load the search results",
        description: "Error Occured",
        status: "warning",
        duration: 4000,
        type: "warning",
      });
    }
  };

  const accessChat = async (userId) => {
    //console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id == data._id)) setChats([data, ...chats]);

      //console.log(data);

      setSelectedChat(data);
      setLoadingChat(false);
      document.getElementById("close-drawer-btn").click();
    } catch (error) {
      toaster.create({
        title: "Error fetching the chat",
        type: "error",
        duration: 4000,
        description: error.message,
      });
    }
  };

  return (
    <DrawerRoot placement="start">
      <DrawerBackdrop />
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle
            paddingBottom="5px"
            borderColor="whiteAlpha.300"
            borderBottomWidth="1px"
          >
            Search Users
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <Box display="flex" pb={2}>
            <Input
              placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}
          {loadingChat && <Spinner ml="auto" display="flex" />}
        </DrawerBody>
        <DrawerFooter>
          <DrawerActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerActionTrigger>
        </DrawerFooter>
        <Drawer.CloseTrigger asChild>
          <button id="close-drawer-btn" style={{ display: "none" }}></button>
        </Drawer.CloseTrigger>
      </DrawerContent>
    </DrawerRoot>
  );
};
const SideDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  //console.log("isOpen state:", isOpen, typeof isOpen);

  const history = useHistory();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const { user } = ChatState();
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        color="black"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderColor="white"
        borderWidth="5px"
      >
        <TriggerButton>
          <Button
            _hover={{ bg: "#e8e9e9", color: "black" }}
            variant="ghost"
            color="black"
            onClick={() => setIsOpen(true)}
          >
            <Tooltip
              content="Search Users to chat"
              showArrow
              placement="bottom-end"
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <i className="fas fa-search"></i>
                <Text display={{ base: "none", md: "flex" }} px="2">
                  Search User
                </Text>
              </span>
            </Tooltip>
          </Button>
        </TriggerButton>

        <Text textStyle="3xl" fontFamily="serif">
          Talk-A-Tive
        </Text>

        <div>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button color="black" size="xl">
                <FaBell />
              </Button>
            </MenuTrigger>
          </MenuRoot>

          <MenuRoot>
            <MenuTrigger asChild>
              <Button color="black" size="xl">
                {/* <Avatar name={user?.name} src={user?.pic} /> */}
                <Avatar.Root size="lg">
                  <Avatar.Fallback name={user.name} />
                  <Avatar.Image src={user.pic} />
                </Avatar.Root>
                <FaCircleChevronDown />
              </Button>
            </MenuTrigger>

            <MenuContent>
              <ProfileModal user={user} />

              <MenuItem>
                <Button variant="plain" onClick={logoutHandler}>
                  Logout...
                </Button>
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </div>
      </Box>
    </>
  );
};

export default SideDrawer;
