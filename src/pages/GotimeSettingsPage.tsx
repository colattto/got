/**
 * GotimeSettingsPage
 * Main settings page for Gotime configuration
 *
 * Refactored to use base components: AppLayout, TabNavigation
 */

import React from "react";
import { Typography, Input, Flex, theme } from "antd";
import { StarOutlined, SearchOutlined } from "@ant-design/icons";
import type { TabType } from "../types/gotime.types";
import { SETTINGS_TABS } from "../constants/gotime.constants";
import { useGotimeSettings } from "../hooks/useGotimeSettings";

// Shared Components
import {
  AppLayout,
  PageHeader,
  StoresSidebar,
  TabNavigation,
} from "../components/shared";

// Tab Components
import { CollaboratorsTab } from "../components/settings/CollaboratorsTab";
import { PdvTab } from "../components/settings/PdvTab";
import { OpeningHoursTab } from "../components/settings/OpeningHoursTab";
import { HolidaysTab } from "../components/settings/HolidaysTab";
import { SalesForecastTab } from "../components/SalesForecastTab";
import { ParametersTab } from "../components/ParametersTab";

const { Text } = Typography;

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
    <AppLayout
      activeMenuItem="settings"
      header={
        <PageHeader
          title="Configurações Gotime"
          onBack={() => {}}
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
        <TabNavigation
          tabs={SETTINGS_TABS}
          activeKey={activeTab}
          onChange={(key) => handleTabChange(key as TabType)}
        />

        {/* Tab Content */}
        <Flex style={{ flex: 1, overflow: "hidden" }}>
          {renderTabContent()}
        </Flex>
      </Flex>
    </AppLayout>
  );
};
