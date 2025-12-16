import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import App from "./App";
import "antd/dist/reset.css";
import "./index.css";

const { defaultAlgorithm } = theme;

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: defaultAlgorithm,
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);


