import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import  store  from "./store/store";
import { BrowserRouter } from "react-router-dom";
import { Flowbite } from "flowbite-react";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <Flowbite>
    <App />
    </Flowbite>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
