import React from "react";
import { Layout, Flex, Typography, Button, theme } from "antd";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";

const { Sider } = Layout;
const { Text } = Typography;

interface CollapsibleSidebarProps {
  title: string;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  width?: number;
  collapsedWidth?: number;
  children: React.ReactNode;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  title,
  collapsed,
  onCollapse,
  width = 260,
  collapsedWidth = 56,
  children,
}) => {
  const { token } = theme.useToken();

  return (
    <Sider
      width={width}
      collapsedWidth={collapsedWidth}
      collapsed={collapsed}
      collapsible
      trigger={null}
      className={`collapsible-sidebar ${collapsed ? "collapsed" : ""}`}
      style={{
        background: token.colorBgContainer,
        borderRadius: token.borderRadius,
        border: `1px solid ${token.colorSplit}`,
        // borderInlineEnd: `1px solid ${token.colorSplit}`, // Already has full border
        transition: "all 0.3s ease",
      }}
    >
      <Flex vertical style={{ height: "100%" }}>
        {/* Collapsed State: Icon + Rotated Title */}
        {collapsed ? (
          <Flex
            vertical
            align="center"
            style={{
              padding: "16px 0",
              height: "100%",
            }}
          >
            <Button
              type="text"
              size="small"
              icon={
                <RightCircleOutlined
                  style={{ color: token.colorTextSecondary, fontSize: 16 }}
                />
              }
              onClick={() => onCollapse(false)}
            />
            <Text
              strong
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                marginTop: 16,
                fontSize: 14,
                color: token.colorText,
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </Text>
          </Flex>
        ) : (
          /* Expanded State */
          <>
            <Flex
              align="center"
              justify="space-between"
              style={{ padding: 16 }}
            >
              <Text strong style={{ color: token.colorText }}>
                {title}
              </Text>
              <Button
                type="text"
                size="small"
                icon={
                  <LeftCircleOutlined
                    style={{ color: token.colorTextSecondary, fontSize: 16 }}
                  />
                }
                onClick={() => onCollapse(true)}
              />
            </Flex>
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {children}
            </div>
          </>
        )}
      </Flex>
    </Sider>
  );
};
