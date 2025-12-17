/**
 * SalesForecastTab Component
 * Displays and manages sales forecast data with editable values
 * 
 * Refactored: Logic extracted to useSalesForecast hook
 */

import React, { useMemo } from "react";
import {
  Table,
  Button,
  Flex,
  Typography,
  theme,
  Space,
  Segmented,
  InputNumber,
} from "antd";
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  UnorderedListOutlined,
  TableOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { SalesForecast } from "../types/gotime.types";
import { useSalesForecast } from "../hooks/useSalesForecast";
import { formatCurrency, formatCurrencyInput, parseCurrency } from "../utils/formatters";
import { MONTH_NAMES } from "../constants/gotime.constants";

const { Text } = Typography;

interface SalesForecastTabProps {
  storeId: string;
}

const SalesForecastTabComponent: React.FC<SalesForecastTabProps> = ({
  storeId,
}) => {
  const { token } = theme.useToken();

  const {
    currentMonth,
    currentYear,
    viewMode,
    forecasts,
    totalValue,
    setViewMode,
    handlePreviousMonth,
    handleNextMonth,
    handleValueChange,
  } = useSalesForecast({ storeId });

  const columns: ColumnsType<SalesForecast> = useMemo(
    () => [
      {
        title: "Data",
        dataIndex: "date",
        key: "date",
        render: (date: string) => (
          <Space>
            <CalendarOutlined style={{ color: token.colorTextQuaternary }} />
            <Text>{date}</Text>
          </Space>
        ),
      },
      {
        title: "Dia da semana",
        dataIndex: "dayOfWeek",
        key: "dayOfWeek",
        render: (day: string) => <Text>{day}</Text>,
      },
      {
        title: "Valor (R$)",
        dataIndex: "value",
        key: "value",
        align: "right" as const,
        width: 200,
        render: (value: number, record: SalesForecast) => (
          <InputNumber
            value={value}
            onChange={(newValue) => handleValueChange(record.id, newValue)}
            formatter={(val) => formatCurrencyInput(val)}
            parser={(val) => parseCurrency(val)}
            style={{ width: "100%" }}
            controls={false}
            min={0}
            step={1000}
            decimalSeparator=","
          />
        ),
      },
    ],
    [token.colorTextQuaternary, handleValueChange]
  );

  const tableScrollHeight = "calc(100vh - 320px)";

  return (
    <Flex
      vertical
      style={{
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Flex
        vertical
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
      >
        <Table
          columns={columns}
          dataSource={forecasts}
          rowKey="id"
          pagination={false}
          size="middle"
          scroll={{ y: tableScrollHeight }}
        />
      </Flex>

      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: `${token.paddingMD}px 0`,
          background: token.colorBgContainer,
          flexShrink: 0,
        }}
      >
        <Text>
          <Text strong>Total de previsão de vendas:</Text>{" "}
          {formatCurrency(totalValue)}
        </Text>

        <Flex align="center" gap="middle">
          <Flex align="center" gap="small">
            <Text>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </Text>
            <Button
              type="text"
              size="small"
              icon={<LeftOutlined />}
              onClick={handlePreviousMonth}
            />
            <Button
              type="text"
              size="small"
              icon={<RightOutlined />}
              onClick={handleNextMonth}
            />
          </Flex>

          <Segmented
            value={viewMode}
            onChange={(value) => setViewMode(value as "list" | "calendar")}
            options={[
              { value: "list", icon: <UnorderedListOutlined /> },
              { value: "calendar", icon: <TableOutlined /> },
            ]}
          />

          <Button icon={<DownloadOutlined />}>Previsões</Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

// Memoized export to prevent unnecessary re-renders
export const SalesForecastTab = React.memo(SalesForecastTabComponent);
