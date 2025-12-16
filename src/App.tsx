import React from "react";
import { Layout } from "antd";
import { GotimeSettingsPage } from "./pages/GotimeSettingsPage";

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <GotimeSettingsPage />
    </Layout>
  );
};

export default App;


