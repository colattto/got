import React from "react";
import { Layout, theme } from "antd";

interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  header,
  sidebar,
}) => {
  const { token } = theme.useToken();

  return (
    <Layout style={{ height: "100vh", background: "#FFFFFF" }}>
      {header}
      <Layout
        hasSider={!!sidebar}
        style={{
          padding: "0 24px 24px 24px", // Standard external padding: Top 0 (aligns with header), Sides/Bottom 24px
          gap: 16, // Standard gap between sidebar and content blocks
          flex: 1,
          background: "#FFFFFF",
          overflow: "hidden", // Ensures no full page scroll, internal blocks scroll instead
        }}
      >
        {sidebar}
        <Layout.Content
          style={{
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
            border: `1px solid ${token.colorSplit}`,
            // padding: 16, // Internal padding for content blocks. NOTE: Some tabs control their own internal padding. 
            // The user requested standardization. Looking at current Content implementation in GotimeSettingsPage:
            // It has explicit style {{ ... , padding: 16 }}. 
            // So we should enforce it here.
            padding: 16,
            overflow: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
