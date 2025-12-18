/**
 * HolidaysTab Component
 * Displays and manages holidays and special dates
 *
 * Refactored: Logic extracted to useHolidays hook
 */

import React, { useMemo, useCallback } from "react";
import {
  Table,
  Button,
  Flex,
  Typography,
  theme,
  Space,
  Tag,
  Switch,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Popconfirm,
} from "antd";
import {
  CalendarOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { Holiday, HolidayType } from "../../types/gotime.types";
import { useHolidays } from "../../hooks/useHolidays";
import { getWeekdayName } from "../../utils/formatters";
import { HolidayFormDrawer } from "./HolidayFormDrawer";

const { Text } = Typography;

interface HolidaysTabProps {
  storeId: string;
}

const HolidaysTabComponent: React.FC<HolidaysTabProps> = ({ storeId }) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const {
    holidays,
    isModalOpen,
    handleAddHoliday,
    handleDeleteHoliday,
    handleRecurringChange,
    openModal,
    closeModal,
  } = useHolidays({ storeId });

  const getTagColor = useCallback(
    (type: HolidayType): string => {
      switch (type) {
        case "Feriado":
          return token.colorError;
        case "Data especial":
          return token.colorWarning;
        case "Recesso":
          return token.colorInfo;
        default:
          return token.colorTextSecondary;
      }
    },
    [token]
  );

  const columns: ColumnsType<Holiday> = useMemo(
    () => [
      {
        title: "Data",
        dataIndex: "date",
        sorter: (a, b) => a.date.localeCompare(b.date),
        render: (text) => text,
      },
      {
        title: "Dia da semana",
        dataIndex: "date",
        sorter: (a, b) =>
          getWeekdayName(a.date).localeCompare(getWeekdayName(b.date)),
        render: (_, record) => (
          <Space size={8}>
            <CalendarOutlined
              style={{ color: token.colorTextTertiary, fontSize: 14 }}
            />
            <Text>{getWeekdayName(record.date)}</Text>
          </Space>
        ),
      },
      {
        title: "Nome",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Tipo",
        dataIndex: "type",
        filters: [
          { text: "Feriado", value: "Feriado" },
          { text: "Data especial", value: "Data especial" },
          { text: "Recesso", value: "Recesso" },
        ],
        onFilter: (value, record) => record.type === value,
        render: (type: HolidayType) => (
          <Tag color={getTagColor(type)}>{type}</Tag>
        ),
      },
      {
        title: "Recorrente",
        dataIndex: "recurring",
        align: "center" as const,
        width: 120,
        onCell: () => ({ style: { opacity: 1 } }),
        render: (value: boolean, record) => (
          <Switch
            size="small"
            checked={value}
            onChange={(checked) => handleRecurringChange(record, checked)}
            style={{
              backgroundColor: value
                ? token.colorPrimary
                : token.colorTextQuaternary,
            }}
          />
        ),
      },
      {
        title: "Ações",
        dataIndex: "id",
        width: 100,
        onCell: () => ({ style: { opacity: 1 } }),
        render: (_, record) => (
          <Popconfirm
            title="Excluir feriado"
            description="Tem certeza que deseja excluir este feriado?"
            onConfirm={() => handleDeleteHoliday(record)}
            okText="Sim"
            cancelText="Não"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              className="btn-delete"
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        ),
      },
    ],
    [token, getTagColor, handleRecurringChange, handleDeleteHoliday]
  );

  const handleFormSubmit = useCallback(async (values: any) => {
    try {
      await handleAddHoliday({
        date: values.date.format("DD/MM/YYYY"),
        name: values.name,
        type: values.type,
      });
    } catch (error) {
      console.error("Error adding holiday:", error);
    }
  }, [handleAddHoliday]);

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
          dataSource={holidays}
          rowKey="id"
          pagination={false}
          size="middle"
          scroll={{ y: tableScrollHeight }}
          rowClassName={(record) => (!record.recurring ? 'row-disabled' : '')}
          onRow={(record) => ({
            style: !record.recurring
              ? { opacity: 0.5, transition: 'opacity 0.2s ease' }
              : { opacity: 1, transition: 'opacity 0.2s ease' },
          })}
        />
      </Flex>

      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "16px 0 0 0",
          background: token.colorBgContainer,
          flexShrink: 0,
        }}
      >
        <Text>
          <Text strong>Total de feriados:</Text> {holidays.length}
        </Text>

        <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
          Adicionar feriado
        </Button>
      </Flex>

      <HolidayFormDrawer
        open={isModalOpen}
        onClose={closeModal}
        onSave={handleFormSubmit}
      />
    </Flex>
  );
};

// Memoized export to prevent unnecessary re-renders
export const HolidaysTab = React.memo(HolidaysTabComponent);
