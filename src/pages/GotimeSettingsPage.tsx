/**
 * GotimeSettingsPage
 * Main settings page for Gotime configuration
 *
 * Refactored: Slim orchestrator using custom hooks and extracted components
 * Target: < 150 lines
 */

import React from "react";
import { Layout, Typography, Input, Button, Flex, theme } from "antd";
import { ArrowLeftOutlined, StarOutlined, SearchOutlined } from "@ant-design/icons";
import type { TabType } from "../types/gotime.types";
import { SETTINGS_TABS } from "../constants/gotime.constants";
import { useGotimeSettings } from "../hooks/useGotimeSettings";

// Components
import { MainSidebar } from "../components/MainSidebar";
import { StoresSidebar } from "../components/shared/StoresSidebar";
import { PageHeader } from "../components/shared/PageHeader";
import { PageLayout } from "../components/shared/PageLayout";
import { CollaboratorsTab } from "../components/settings/CollaboratorsTab";
import { PdvTab } from "../components/settings/PdvTab";
import { OpeningHoursTab } from "../components/settings/OpeningHoursTab";
import { HolidaysTab } from "../components/HolidaysTab";
import { SalesForecastTab } from "../components/SalesForecastTab";
import { ParametersTab } from "../components/ParametersTab";

const { Header, Content } = Layout;
const { Text, Title } = Typography;

export const GotimeSettingsPage: React.FC = () => {
  const { token } = theme.useToken();

  const {
    selectedStoreId,
    activeTab,
    sidebarCollapsed,
    searchTerm,
    storeSearchTerm,
    filteredStores,
    selectedStore,
    collaborators,
    pdvs,
    setSearchTerm,
    setStoreSearchTerm,
    handleStoreSelect,
    handleTabChange,
    setSidebarCollapsed,
    handleUpdateCollaborator,
    handleUpdatePdv,
    handleAddPdv,
  } = useGotimeSettings();

  const renderTabContent = () => {
    switch (activeTab) {
      case "collaborators":
        return (
          <CollaboratorsTab
            collaborators={collaborators}
            searchTerm={searchTerm}
            onUpdate={handleUpdateCollaborator}
          />
        );
      case "pdv":
        return (
          <PdvTab
            pdvs={pdvs}
            searchTerm={searchTerm}
            onUpdate={handleUpdatePdv}
            onAdd={handleAddPdv}
          />
        );
      case "hours":
        return <OpeningHoursTab storeId={selectedStoreId} />;
      case "holidays":
        return <HolidaysTab storeId={selectedStoreId} />;
      case "forecast":
        return <SalesForecastTab storeId={selectedStoreId} />;
      case "parameters":
        return <ParametersTab storeId={selectedStoreId} />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ height: "100vh", overflow: "hidden", background: "#FFFFFF" }} hasSider>
      <MainSidebar activeItem="settings" />
      <PageLayout
        header={
          <PageHeader
            title="Configurações Gotime"
            onBack={() => {}} // No functionality defined yet in original code, but button was there. User can wire it up later.
            icon={<StarOutlined style={{ color: token.colorTextQuaternary, fontSize: 20 }} />}
          >
            <Input
              allowClear
              placeholder="Buscar"
              suffix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
              style={{ width: 260 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </PageHeader>
        }
        sidebar={
          <StoresSidebar
            stores={filteredStores}
            selectedStoreId={selectedStoreId}
            collapsed={sidebarCollapsed}
            searchTerm={storeSearchTerm}
            onStoreSelect={handleStoreSelect}
            onCollapsedChange={setSidebarCollapsed}
            onSearchChange={setStoreSearchTerm}
          />
        }
      >
        {/* Main Content Area */}
        <Flex vertical gap={16} style={{ flex: 1, minHeight: 0 }}>
          {/* Store Name */}
          <Text strong>{selectedStore?.name}</Text>

          {/* Tab Navigation */}
          <Flex
            style={{
              borderBottom: `1px solid ${token.colorSplit}`,
              paddingBottom: 0,
            }}
            gap={24}
          >
            {SETTINGS_TABS.map((tab) => (
              <Button
                key={tab.key}
                type="text"
                onClick={() => handleTabChange(tab.key as TabType)}
                style={{
                  color: activeTab === tab.key ? token.colorPrimary : token.colorText,
                  borderRadius: 0,
                  borderBottom:
                    activeTab === tab.key
                      ? `2px solid ${token.colorPrimary}`
                      : "2px solid transparent",
                  marginBottom: -2,
                }}
                className="settings-tab-button"
              >
                {tab.label}
              </Button>
            ))}
          </Flex>

          {/* Tab Content */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            {renderTabContent()}
          </div>
        </Flex>
      </PageLayout>
    </Layout>
  );
};
