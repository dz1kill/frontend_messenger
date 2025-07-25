import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";

import "./styles/index.css";
import App from "./components/app/app";
import store from "./store/store";
import { ToastContainer } from "react-toastify";

let root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <Provider store={store}>
    <ToastContainer />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
