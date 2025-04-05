import "./App.css";
import { Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import { Toaster } from "../src/components/ui/toaster";

function App() {
  return (
    <div className="App">
      {/* It is routing our home page with path '/' and bcz / is also in below path so it will also render in that path so to remove this we are using exact here */}
      <Route path="/" component={HomePage} exact />
      <Route path="/chats" component={ChatPage} />
      <Toaster />
    </div>
  );
}

export default App;
