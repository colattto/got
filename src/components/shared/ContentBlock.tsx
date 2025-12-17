/**
 * ContentBlock Component
 * Standard content container with consistent styling
 */

import React from "react";
import { Flex, Typography, theme } from "antd";

const { Text } = Typography;

interface ContentBlockProps {
  /** Content to render inside the block */
  children: React.ReactNode;
  /** Internal padding (default: 16) */
  padding?: number | string;
  /** Make the block fill available height */
  fullHeight?: boolean;
  /** Optional title above the content */
  title?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  children,
  padding = 16,
  fullHeight = false,
  title,
  style,
}) => {
  const { token } = theme.useToken();

  return (
    <Flex
      vertical
      style={{
        background: token.colorBgContainer,
        borderRadius: token.borderRadius,
        border: `1px solid ${token.colorSplit}`,
        padding,
        overflow: "hidden",
        flex: fullHeight ? 1 : undefined,
        ...style,
      }}
    >
      {title && (
        <Text strong style={{ marginBottom: 12 }}>
          {title}
        </Text>
      )}
      {children}
    </Flex>
  );
};
