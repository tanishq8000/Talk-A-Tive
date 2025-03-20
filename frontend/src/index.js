import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Provider } from "E:/MERN CHAT APP/frontend/src/components/ui/provider.jsx";

import { BrowserRouter } from "react-router-dom";

import ChatProvider from "./Context/ChatProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Here we are fetching our main div which have id "root" and we are rendering everything inside root

// We installed Chakra UI in our frontend and for that we wrapped our APP into <Provider> for more visit offcial website of Chakra UI
root.render(
  <ChatProvider>
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </ChatProvider>
);
