/**
 * AppLayout Component
 * Base application layout combining MainSidebar with PageLayout
 * 
 * Use this as the wrapper for all pages in the application
 */

import React from "react";
import { Layout } from "antd";
import { MainSidebar } from "../MainSidebar";
import { PageLayout } from "./PageLayout";

interface AppLayoutProps {
  /** Main content to render */
  children: React.ReactNode;
  /** Header component (typically PageHeader) */
  header?: React.ReactNode;
  /** Secondary sidebar (e.g., StoresSidebar) */
  sidebar?: React.ReactNode;
  /** Active menu item in MainSidebar */
  activeMenuItem?: "menu" | "star" | "history" | "notifications" | "apps" | "settings" | "user";
  /** Callback when menu item is clicked */
  onMenuItemClick?: (item: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  header,
  sidebar,
  activeMenuItem,
  onMenuItemClick,
}) => {
  return (
    <Layout style={{ height: "100vh", overflow: "hidden", background: "#FFFFFF" }} hasSider>
      <MainSidebar activeItem={activeMenuItem} onItemClick={onMenuItemClick} />
      <PageLayout header={header} sidebar={sidebar}>
        {children}
      </PageLayout>
    </Layout>
  );
};
