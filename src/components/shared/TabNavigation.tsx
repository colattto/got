/**
 * TabNavigation Component
 * Reusable tab navigation with underline style
 */

import React from "react";
import { Flex, Button, theme } from "antd";

interface Tab {
  key: string;
  label: string;
}

interface TabNavigationProps {
  /** Array of tabs to display */
  tabs: readonly Tab[] | Tab[];
  /** Currently active tab key */
  activeKey: string;
  /** Callback when tab changes */
  onChange: (key: string) => void;
  /** Additional inline styles for container */
  style?: React.CSSProperties;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeKey,
  onChange,
  style,
}) => {
  const { token } = theme.useToken();

  return (
    <Flex
      style={{
        borderBottom: `1px solid ${token.colorSplit}`,
        paddingBottom: 0,
        ...style,
      }}
      gap={24}
    >
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          type="text"
          onClick={() => onChange(tab.key)}
          style={{
            color: activeKey === tab.key ? token.colorPrimary : token.colorText,
            borderRadius: 0,
            borderBottom:
              activeKey === tab.key
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
  );
};
