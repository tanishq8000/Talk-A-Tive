import { Badge } from "@chakra-ui/react";
import React from "react";
import { IoClose } from "react-icons/io5";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorPalette="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <IoClose pl="1" />
    </Badge>
  );
};

export default UserBadgeItem;
