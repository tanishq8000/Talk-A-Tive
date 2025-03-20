import React, { useState } from "react";
import { VStack, Input, Button } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { PasswordInput } from "E:/MERN CHAT APP/frontend/src/components/ui/password-input.jsx";
import {
  Toaster,
  toaster,
} from "E:/MERN CHAT APP/frontend/src/components/ui/toaster.jsx";

import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toaster.create({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      // append and fetch data from cloudnary where we can store and upload pics
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dvdhrxpi4");
      // to fetch data from cloudinary
      fetch("https://api.cloudinary.com/v1_1/dvdhrxpi4/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toaster.create({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toaster.create({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toaster.create({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      toaster.create({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

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
      <Field name="name" label="Name" id="firstName" required>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <Field name="email" label="Email" id="email" required>
        <Input
          type="email"
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>

      <Field name="password" label="Password" id="password" required>
        <PasswordInput
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>

      <Field
        name="confirm password"
        label="Confirm Password"
        id="confirmPassword"
        required
      >
        <PasswordInput
          placeholder="Re-Enter your password"
          onChange={(e) => setConfirmpassword(e.target.value)}
        />
      </Field>

      <Field
        name="upload"
        label="Upload Your Picture"
        id="uploadPic"
        isRequired
      >
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </Field>

      <Button
        colorPalette="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        loading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
