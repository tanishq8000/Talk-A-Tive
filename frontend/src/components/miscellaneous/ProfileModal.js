import { Button, IconButton, Input, Stack, Text } from "@chakra-ui/react";
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
import { IoMdEye } from "react-icons/io";

const ProfileModal = ({ user, children }) => {
  return (
    <DialogRoot placement="center" size="sm">
      <DialogTrigger>
        {children ? (
          <Button asChild variant="plain" size="sm">
            My Profile
          </Button>
        ) : (
          <IconButton display={{ base: "flex" }}>
            <IoMdEye />
          </IconButton>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle fontSize="35px" display="flex" justifyContent="center">
            {user.name ? `${user.name}` : "Profile"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody pb="4">
          <Stack gap="4">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {user.pic ? (
                <img
                  src={user.pic}
                  alt={user.name || "User profile"}
                  style={{
                    width: "150px",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <p>No profile picture</p>
              )}
            </div>

            <Text
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize={{ base: "18px", md: "20px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          {/* <Button>Save</Button> */}
        </DialogFooter>
        {/* <DialogFooter>
          <Button
            ref={closeButtonRef}
            variant="outline"
            onClick={() => document.activeElement.blur()}
          >
            Close
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </DialogRoot>
  );
};

export default ProfileModal;
