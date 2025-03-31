import React, { useState } from "react";
import {
  Box,
  Button,
  DrawerActionTrigger,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
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
import { useChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { toaster } from "../ui/toaster";
import UserListItem from "../userAvataar/UserListItem";
import UserBadgeItem from "../userAvataar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = useChatState();

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
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toaster.create({
        title: "Please fill all the fields",
        type: "warning",
        duration: 4000,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      <DrawerActionTrigger />;
      toaster.create({
        title: "New Group Chat Created!",
        type: "success",
        duration: 4000,
      });
    } catch (error) {
      toaster.create({
        title: "Failed to Create the Chat!",
        type: "error",
        description: error.response.data,
        duration: 4000,
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toaster.create({
        title: "User already added",
        type: "warning",
        duration: 4000,
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <DialogRoot placement="center" size="sm">
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </DialogTitle>
        </DialogHeader>
        <DialogBody display="flex" flexDir="column" alignItems="center">
          <Input
            placeholder="Chat Name"
            mb={3}
            onChange={(e) => setGroupChatName(e.target.value)}
          />

          <Input
            placeholder="Add Users eg: John, Piyush, Jane"
            mb={1}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Box w="100%" display="flex" flexWrap="wrap">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>
          {loading ? (
            // <ChatLoading />
            <div>Loading...</div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default GroupChatModal;
