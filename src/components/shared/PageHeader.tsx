import React from "react";
import { Layout, Flex, Typography, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  icon,
  children,
}) => {
  return (
    <Header
      style={{
        background: "#FFFFFF",
        padding: "16px 24px",
        height: "auto",
        lineHeight: "normal",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Flex align="center" gap={12}>
        {onBack && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            style={{ padding: 0 }}
          />
        )}
        <Title level={4} style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
          {title}
        </Title>
        {icon && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {icon}
            </div>
        )}
      </Flex>

      {children}
    </Header>
  );
};
