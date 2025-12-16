import React, { useState } from "react";
import { Layout, Flex, Button, Divider, Menu, Typography, theme } from "antd";
import {
  MenuOutlined,
  StarOutlined,
  HistoryOutlined,
  BellOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UnorderedListOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { Text } = Typography;

interface MainSidebarProps {
  activeItem?: "menu" | "star" | "history" | "notifications" | "apps" | "settings" | "user";
  onItemClick?: (item: string) => void;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({
  activeItem,
  onItemClick,
}) => {
  const { token } = theme.useToken();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (item: string) => {
    if (item === "menu") {
      setMenuOpen(!menuOpen);
    } else {
      onItemClick?.(item);
    }
  };

  const handleMenuItemClick = (key: string) => {
    setMenuOpen(false);
    onItemClick?.(key);
  };

  const handleBackdropClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Black sidebar with icons */}
      <Sider
        width={48}
        style={{
          background: "#000000",
          padding: "16px 0",
          zIndex: 100,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <Flex
          vertical
          align="center"
          justify="space-between"
          style={{ height: "100%" }}
        >
          {/* Top icons group */}
          <Flex vertical align="center" gap={4}>
            {/* Logo */}
            <div
              style={{
                width: 32,
                height: 32,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="29"
                height="30"
                viewBox="0 0 29 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5 30C22.5081 30 29 23.2843 29 15C29 6.71573 22.5081 0 14.5 0C6.49187 0 0 6.71573 0 15C0 23.2843 6.49187 30 14.5 30Z"
                  fill="#FADB14"
                />
                <path
                  d="M21.75 11.25C21.75 13.3211 20.1266 15 18.125 15C16.1234 15 14.5 13.3211 14.5 11.25C14.5 9.17893 16.1234 7.5 18.125 7.5C20.1266 7.5 21.75 9.17893 21.75 11.25Z"
                  fill="#FFF566"
                />
                <path
                  d="M14.5 15C14.5 21.2132 10.4281 26.25 5.4375 26.25C5.4375 20.0368 9.50937 15 14.5 15Z"
                  fill="#FADB14"
                />
              </svg>
            </div>

            <Button
              type="text"
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: menuOpen ? "#333333" : "transparent",
              }}
              icon={<MenuOutlined style={{ color: "#FFFFFF", fontSize: 16 }} />}
              onClick={() => handleClick("menu")}
            />

            <Divider
              style={{
                borderColor: "#444444",
                margin: "8px 0",
                width: 32,
                minWidth: 32,
              }}
            />

            <Button
              type="text"
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: activeItem === "star" ? "#333333" : "transparent",
              }}
              icon={<StarOutlined style={{ color: "#FFFFFF", fontSize: 16 }} />}
              onClick={() => handleClick("star")}
            />
            <Button
              type="text"
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: activeItem === "history" ? "#333333" : "transparent",
              }}
              icon={<HistoryOutlined style={{ color: "#FFFFFF", fontSize: 16 }} />}
              onClick={() => handleClick("history")}
            />
            <Button
              type="text"
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: activeItem === "notifications" ? "#333333" : "transparent",
              }}
              icon={<BellOutlined style={{ color: "#FFFFFF", fontSize: 16 }} />}
              onClick={() => handleClick("notifications")}
            />
          </Flex>

          {/* Bottom icons group */}
          <Flex vertical align="center" gap={4}>
            <Button
              type="text"
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: activeItem === "apps" ? "#333333" : "transparent",
              }}
              icon={<AppstoreOutlined style={{ color: "#FFFFFF", fontSize: 16 }} />}
              onClick={() => handleClick("apps")}
            />
            <Button
              type="text"
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: activeItem === "settings" ? "#333333" : "transparent",
              }}
              icon={<SettingOutlined style={{ color: "#FFFFFF", fontSize: 16 }} />}
              onClick={() => handleClick("settings")}
            />
            <Button
              type="text"
              shape="circle"
              style={{
                width: 32,
                height: 32,
                background: activeItem === "user" ? "#BFBFBF" : "#D9D9D9",
                border: "none",
                marginTop: 8,
              }}
              icon={<UserOutlined style={{ color: "#000000", fontSize: 16 }} />}
              onClick={() => handleClick("user")}
            />
          </Flex>
        </Flex>
      </Sider>

      {/* Overlay backdrop with blur */}
      {menuOpen && (
        <div
          onClick={handleBackdropClick}
          style={{
            position: "fixed",
            top: 0,
            left: 48, // Start after the black menu
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 50,
          }}
        />
      )}

      {/* Navigation Panel - positioned absolutely beside menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 48, // Start right after the black menu
            bottom: 0,
            width: 240,
            background: token.colorBgContainer,
            borderRight: `1px solid ${token.colorSplit}`,
            display: "flex",
            flexDirection: "column",
            zIndex: 60,
            boxShadow: "4px 0 16px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Panel Header */}
          <Flex
            align="center"
            justify="space-between"
            style={{
              padding: "16px",
              borderBottom: `1px solid ${token.colorSplit}`,
            }}
          >
            <Text strong style={{ fontSize: 16 }}>
              Gotime
            </Text>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined style={{ fontSize: 12 }} />}
              onClick={() => setMenuOpen(false)}
            />
          </Flex>

          {/* Panel Menu */}
          <Menu
            mode="vertical"
            selectable={false}
            onClick={({ key }) => handleMenuItemClick(key)}
            items={[
              {
                key: "escalas",
                icon: <UnorderedListOutlined />,
                label: "Lista de escalas",
              },
              {
                key: "settings",
                icon: <SettingOutlined />,
                label: "Configurações",
              },
            ]}
            style={{ border: "none", flex: 1 }}
          />
        </div>
      )}
    </>
  );
};
