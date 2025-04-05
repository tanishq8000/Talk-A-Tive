import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { useChatState } from "../Context/ChatProvider";
import { Avatar, Button } from "@chakra-ui/react";
import { Tooltip } from "../components/ui/tooltip";
import { useId } from "react";

const ScrollableChat = ({ messages }) => {
  const { user } = useChatState();
  const id = useId();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip ids={{ trigger: id }} content={m.sender.name} showArrow>
                <Avatar.Root
                  ids={{ root: id }}
                  mt="7px"
                  mr={1}
                  cursor="pointer"
                  size="sm"
                >
                  <Avatar.Image src={m.sender.pic} />
                  <Avatar.Fallback name={m.sender.name} />
                </Avatar.Root>
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                color: "black",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
