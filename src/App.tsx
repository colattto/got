import React from "react";
import { Layout, App as AntApp } from "antd";
import { GotimeSettingsPage } from "./pages/GotimeSettingsPage";

const App: React.FC = () => {
  return (
    <AntApp>
      <Layout style={{ minHeight: "100vh" }}>
        <GotimeSettingsPage />
      </Layout>
    </AntApp>
  );
};

export default App;


