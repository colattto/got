/**
 * StoresSidebar Component
 * Collapsible sidebar for store selection
 *
 * Extracted from GotimeSettingsPage for reusability
 */

import React from "react";
import {
  Layout,
  Flex,
  Typography,
  Button,
  Input,
  Menu,
} from "antd";
import { CollapsibleSidebar } from "./CollapsibleSidebar";
import {
  ShopOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { theme } from "antd";
import type { Store } from "../../types/gotime.types";

const { Text } = Typography;

interface StoresSidebarProps {
  stores: Store[];
  selectedStoreId: string;
  collapsed: boolean;
  searchTerm: string;
  onStoreSelect: (storeId: string) => void;
  onCollapsedChange: (collapsed: boolean) => void;
  onSearchChange: (term: string) => void;
}

const StoresSidebarComponent: React.FC<StoresSidebarProps> = ({
  stores,
  selectedStoreId,
  collapsed,
  searchTerm,
  onStoreSelect,
  onCollapsedChange,
  onSearchChange,
}) => {
  const { token } = theme.useToken();

  return (
    <CollapsibleSidebar
      title="Lojas"
      collapsed={collapsed}
      onCollapse={onCollapsedChange}
    >
      <Flex vertical gap={8} style={{ padding: "0 16px", marginBottom: 16 }}>
        <Input
          allowClear
          placeholder="Buscar"
          suffix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </Flex>

      <Menu
        mode="inline"
        selectedKeys={[selectedStoreId]}
        onClick={({ key }) => onStoreSelect(key)}
        items={stores.map((store) => ({
          key: store.id,
          icon: <ShopOutlined />,
          label: store.name,
        }))}
        style={{ borderInlineEnd: "none", flex: 1, overflowY: "auto" }}
      />
    </CollapsibleSidebar>
  );
};

// Memoized export
export const StoresSidebar = React.memo(StoresSidebarComponent);
