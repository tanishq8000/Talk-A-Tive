import SingleChat from "./SingleChat";
import { useChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
