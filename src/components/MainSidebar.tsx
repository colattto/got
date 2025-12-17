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

// Icon button styles with hover effects
const getIconButtonStyle = (isActive: boolean, isHovered: boolean) => ({
  width: 36,
  height: 36,
  borderRadius: 8,
  background: isActive 
    ? "rgba(255, 255, 255, 0.15)" 
    : isHovered 
      ? "rgba(255, 255, 255, 0.08)" 
      : "transparent",
  border: "none",
  transition: "all 0.2s ease",
  transform: isHovered ? "scale(1.05)" : "scale(1)",
});

export const MainSidebar: React.FC<MainSidebarProps> = ({
  activeItem,
  onItemClick,
}) => {
  const { token } = theme.useToken();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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

  const renderIconButton = (
    item: string,
    icon: React.ReactNode,
    isCircle?: boolean
  ) => {
    const isActive = item === "menu" ? menuOpen : activeItem === item;
    const isHovered = hoveredItem === item;

    if (isCircle) {
      return (
        <Button
          type="text"
          shape="circle"
          style={{
            width: 36,
            height: 36,
            background: isActive ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.8)",
            border: "none",
            marginTop: 8,
            transition: "all 0.2s ease",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            boxShadow: isHovered ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
          }}
          icon={icon}
          onClick={() => handleClick(item)}
          onMouseEnter={() => setHoveredItem(item)}
          onMouseLeave={() => setHoveredItem(null)}
        />
      );
    }

    return (
      <Button
        type="text"
        style={getIconButtonStyle(isActive, isHovered)}
        icon={icon}
        onClick={() => handleClick(item)}
        onMouseEnter={() => setHoveredItem(item)}
        onMouseLeave={() => setHoveredItem(null)}
      />
    );
  };

  return (
    <>
      {/* Black sidebar with icons */}
      <Sider
        width={56}
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
          padding: "16px 0",
          zIndex: 100,
          position: "sticky",
          top: 0,
          height: "100vh",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Flex
          vertical
          align="center"
          justify="space-between"
          style={{ height: "100%" }}
        >
          {/* Top icons group */}
          <Flex vertical align="center" gap={6}>
            {/* Logo */}
            <div
              style={{
                width: 40,
                height: 40,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1) rotate(5deg)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1) rotate(0deg)")}
            >
              <svg
                width="36"
                height="36"
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

            {renderIconButton("menu", <MenuOutlined style={{ color: "#FFFFFF", fontSize: 18 }} />)}

            <Divider
              style={{
                borderColor: "rgba(255, 255, 255, 0.1)",
                margin: "12px 0",
                width: 36,
                minWidth: 36,
              }}
            />

            {renderIconButton("star", <StarOutlined style={{ color: "#FFFFFF", fontSize: 18 }} />)}
            {renderIconButton("history", <HistoryOutlined style={{ color: "#FFFFFF", fontSize: 18 }} />)}
            {renderIconButton("notifications", <BellOutlined style={{ color: "#FFFFFF", fontSize: 18 }} />)}
          </Flex>

          {/* Bottom icons group */}
          <Flex vertical align="center" gap={6}>
            {renderIconButton("apps", <AppstoreOutlined style={{ color: "#FFFFFF", fontSize: 18 }} />)}
            {renderIconButton("settings", <SettingOutlined style={{ color: "#FFFFFF", fontSize: 18 }} />)}
            {renderIconButton("user", <UserOutlined style={{ color: "#000000", fontSize: 16 }} />, true)}
          </Flex>
        </Flex>
      </Sider>

      {/* Overlay backdrop with smooth animation */}
      <div
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          top: 0,
          left: 56,
          right: 0,
          bottom: 0,
          background: menuOpen ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0)",
          backdropFilter: menuOpen ? "blur(6px)" : "blur(0px)",
          WebkitBackdropFilter: menuOpen ? "blur(6px)" : "blur(0px)",
          zIndex: 50,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: menuOpen ? 1 : 0,
        }}
      />

      {/* Navigation Panel with smooth slide animation */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 56,
          bottom: 0,
          width: 280,
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          display: "flex",
          flexDirection: "column",
          zIndex: 60,
          boxShadow: menuOpen ? "8px 0 24px rgba(0, 0, 0, 0.15)" : "none",
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease",
          opacity: 1,
        }}
      >
        {/* Panel Header */}
        <Flex
          align="center"
          justify="space-between"
          style={{
            padding: "20px 16px",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            background: token.colorBgElevated,
          }}
        >
          <Flex align="center" gap={10}>
            <svg width="24" height="24" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 30C22.5081 30 29 23.2843 29 15C29 6.71573 22.5081 0 14.5 0C6.49187 0 0 6.71573 0 15C0 23.2843 6.49187 30 14.5 30Z" fill="#FADB14"/>
              <path d="M21.75 11.25C21.75 13.3211 20.1266 15 18.125 15C16.1234 15 14.5 13.3211 14.5 11.25C14.5 9.17893 16.1234 7.5 18.125 7.5C20.1266 7.5 21.75 9.17893 21.75 11.25Z" fill="#FFF566"/>
              <path d="M14.5 15C14.5 21.2132 10.4281 26.25 5.4375 26.25C5.4375 20.0368 9.50937 15 14.5 15Z" fill="#FADB14"/>
            </svg>
            <Text strong style={{ fontSize: 18, letterSpacing: "-0.5px" }}>
              Gotime
            </Text>
          </Flex>
          <Button
            type="text"
            size="small"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={<CloseOutlined style={{ fontSize: 12 }} />}
            onClick={() => setMenuOpen(false)}
          />
        </Flex>

        {/* Panel Menu with custom styling */}
        <Menu
          mode="vertical"
          selectable={false}
          onClick={({ key }) => handleMenuItemClick(key)}
          items={[
            {
              key: "escalas",
              icon: <UnorderedListOutlined style={{ fontSize: 16 }} />,
              label: "Lista de escalas",
            },
            {
              key: "settings",
              icon: <SettingOutlined style={{ fontSize: 16 }} />,
              label: "Configurações",
            },
          ]}
          style={{ 
            border: "none", 
            flex: 1, 
            padding: "8px",
            background: "transparent",
          }}
        />

        {/* Footer */}
        <Flex
          style={{
            padding: "16px",
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            background: token.colorBgElevated,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            v6.1.1 • Ant Design
          </Text>
        </Flex>
      </div>
    </>
  );
};
