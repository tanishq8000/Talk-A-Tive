import React, { useState } from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Box, Button, IconButton, Input, Spinner } from "@chakra-ui/react";
import { useChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvataar/UserBadgeItem";
import axios from "axios";
import { toaster } from "../ui/toaster";
import UserListItem from "../userAvataar/UserListItem";
import { IoSettings } from "react-icons/io5";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);

  const { selectedChat, setSelectedChat, user } = useChatState();

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toaster.create({
        title: "User Already in group!",
        type: "error",
        duration: 4000,
      });
      return;
    }

    const admin = { ...selectedChat.groupAdmin[0] };

    // console.log(user._id);

    if (admin._id !== user._id) {
      toaster.create({
        title: "Only admins can add someone!",
        type: "error",
        duration: 4000,
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
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
        duration: 4000,
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    const admin = { ...selectedChat.groupAdmin[0] };
    if (admin._id !== user._id && user1._id !== user._id) {
      toaster.create({
        title: "Only admins can remove someone!",
        type: "error",
        duration: 4000,
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
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
        duration: 4000,
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameloading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        type: "error",
        duration: 4000,
        description: error.response.data.message,
      });

      setRenameloading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        type: "error",
        duration: 4000,
        description: "Failed to Load the Search Results",
      });
      setLoading(false);
    }
  };

  return (
    <DialogRoot placement="center" size="sm">
      <DialogTrigger>
        <IconButton display={{ base: "flex" }}>
          <IoSettings />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader
          fontSize="35px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
        >
          <DialogTitle fontSize="35px" display="flex" justifyContent="center">
            {selectedChat.chatName}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Box>
          <Box display="flex">
            <Input
              placeholder="Chat Name"
              mb={3}
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
              variant="solid"
              colorScheme="teal"
              ml={1}
              isLoading={renameloading}
              onClick={handleRename}
            >
              Update
            </Button>
          </Box>
          <Input
            placeholder="Add User to group"
            mb={1}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {loading ? (
            <Spinner size="lg" />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button onClick={() => handleRemove(user)} colorPalette="red">
              Leave Group
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default UpdateGroupChatModal;
