/**
 * OpeningHoursTab Component
 * Displays and manages store opening hours
 *
 * Refactored with multi-select day replication
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  Table,
  Button,
  Flex,
  Typography,
  theme,
  Switch,
  TimePicker,
  Popover,
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { OpeningHoursDay, TimePeriod } from "../../types/gotime.types";
import { DEFAULT_OPENING_HOURS } from "../../constants/gotime.constants";

const { Text } = Typography;

interface OpeningHoursTabProps {
  storeId: string;
}

// Replication Popover Content Component
const ReplicationPopover: React.FC<{
  sourceDay: string;
  allDays: OpeningHoursDay[];
  onReplicate: (targetDays: string[]) => void;
  onClose: () => void;
}> = ({ sourceDay, allDays, onReplicate, onClose }) => {
  const { token } = theme.useToken();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const otherDays = allDays.filter((d) => d.day !== sourceDay);

  const handleConfirm = () => {
    if (selectedDays.length > 0) {
      onReplicate(selectedDays);
      setSelectedDays([]);
      onClose();
    }
  };

  return (
    <Flex vertical gap={12} style={{ width: 180 }}>
      <Text strong style={{ fontSize: 13 }}>Replicar para:</Text>
      <Checkbox.Group
        value={selectedDays}
        onChange={(values) => setSelectedDays(values as string[])}
      >
        <Flex vertical gap={6}>
          {otherDays.map((day) => (
            <Checkbox key={day.day} value={day.day}>
              <Text style={{ fontSize: 13 }}>{day.day}</Text>
            </Checkbox>
          ))}
        </Flex>
      </Checkbox.Group>
      <Button
        type="primary"
        size="small"
        onClick={handleConfirm}
        disabled={selectedDays.length === 0}
        block
      >
        Replicar ({selectedDays.length})
      </Button>
    </Flex>
  );
};

const OpeningHoursTabComponent: React.FC<OpeningHoursTabProps> = ({
  storeId,
}) => {
  const { token } = theme.useToken();
  const [openingHours, setOpeningHours] = useState<OpeningHoursDay[]>(
    DEFAULT_OPENING_HOURS
  );
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const handleToggleDay = useCallback((day: string, isOpen: boolean) => {
    setOpeningHours((prev) =>
      prev.map((item) => (item.day === day ? { ...item, isOpen } : item))
    );
  }, []);

  const handleTimeChange = useCallback(
    (day: string, periodIndex: number, field: "start" | "end", time: string) => {
      setOpeningHours((prev) =>
        prev.map((item) => {
          if (item.day !== day) return item;
          const updatedPeriods = [...item.periods];
          updatedPeriods[periodIndex] = {
            ...updatedPeriods[periodIndex],
            [field]: time,
          };
          return { ...item, periods: updatedPeriods };
        })
      );
    },
    []
  );

  const handleAddPeriod = useCallback((day: string) => {
    setOpeningHours((prev) =>
      prev.map((item) => {
        if (item.day !== day) return item;
        return {
          ...item,
          periods: [...item.periods, { start: "08:00", end: "18:00" }],
        };
      })
    );
  }, []);

  const handleRemovePeriod = useCallback((day: string, periodIndex: number) => {
    setOpeningHours((prev) =>
      prev.map((item) => {
        if (item.day !== day) return item;
        return {
          ...item,
          periods: item.periods.filter((_, i) => i !== periodIndex),
        };
      })
    );
  }, []);

  const handleReplicateToSelected = useCallback(
    (sourceDay: string, targetDays: string[]) => {
      setOpeningHours((prev) => {
        const source = prev.find((d) => d.day === sourceDay);
        if (!source) return prev;
        return prev.map((d) =>
          targetDays.includes(d.day)
            ? { ...d, isOpen: source.isOpen, periods: [...source.periods] }
            : d
        );
      });
    },
    []
  );

  const columns: ColumnsType<OpeningHoursDay> = useMemo(
    () => [
      {
        title: "Dia",
        dataIndex: "day",
        width: 160,
        render: (day: string) => <Text>{day}</Text>,
      },
      {
        title: "Escala",
        dataIndex: "isOpen",
        width: 80,
        align: "center" as const,
        onCell: () => ({ style: { opacity: 1 } }),
        render: (value: boolean, record) => (
          <Switch
            size="small"
            checked={value}
            onChange={(checked) => handleToggleDay(record.day, checked)}
            style={{
              backgroundColor: value
                ? token.colorPrimary
                : token.colorTextQuaternary,
            }}
          />
        ),
      },
      {
        title: "Períodos",
        dataIndex: "periods",
        render: (periods: TimePeriod[], record) => {
          if (!record.isOpen) {
            return <Text type="secondary">—</Text>;
          }

          return (
            <Flex align="center" gap={12} wrap="wrap">
              {periods.map((period, index) => (
                <Flex
                  key={index}
                  align="center"
                  gap={8}
                  style={{
                    background: token.colorBgLayout,
                    padding: "4px 12px",
                    borderRadius: token.borderRadius,
                  }}
                >
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, whiteSpace: "nowrap" }}
                  >
                    {index + 1}º Período
                  </Text>
                  <TimePicker
                    value={dayjs(period.start, "HH:mm")}
                    format="HH:mm"
                    onChange={(time) =>
                      handleTimeChange(
                        record.day,
                        index,
                        "start",
                        time?.format("HH:mm") || "00:00"
                      )
                    }
                    size="small"
                    style={{ width: 80 }}
                    allowClear={false}
                  />
                  <Text type="secondary">às</Text>
                  <TimePicker
                    value={dayjs(period.end, "HH:mm")}
                    format="HH:mm"
                    onChange={(time) =>
                      handleTimeChange(
                        record.day,
                        index,
                        "end",
                        time?.format("HH:mm") || "00:00"
                      )
                    }
                    size="small"
                    style={{ width: 80 }}
                    allowClear={false}
                  />
                  {periods.length > 1 && (
                    <Button
                      type="text"
                      className="btn-delete"
                      size="small"
                      danger
                      icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                      onClick={() => handleRemovePeriod(record.day, index)}
                      style={{ padding: "0 4px" }}
                    />
                  )}
                </Flex>
              ))}
              <Button
                type="dashed"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => handleAddPeriod(record.day)}
                className="btn-add-period"
              >
                Período
              </Button>
            </Flex>
          );
        },
      },
      {
        title: "Ações",
        width: 120,
        align: "center" as const,
        render: (_, record) => (
          <Popover
            open={openPopover === record.day}
            onOpenChange={(visible) => setOpenPopover(visible ? record.day : null)}
            trigger="click"
            placement="bottomRight"
            content={
              <ReplicationPopover
                sourceDay={record.day}
                allDays={openingHours}
                onReplicate={(targetDays) =>
                  handleReplicateToSelected(record.day, targetDays)
                }
                onClose={() => setOpenPopover(null)}
              />
            }
          >
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              className="btn-replicate"
            >
              Replicar
            </Button>
          </Popover>
        ),
      },
    ],
    [
      token,
      handleToggleDay,
      handleTimeChange,
      handleAddPeriod,
      handleRemovePeriod,
      handleReplicateToSelected,
      openingHours,
      openPopover,
    ]
  );

  const tableScrollHeight = "100%";

  return (
    <>
      <style>
        {`
          .btn-add-period {
            color: ${token.colorTextSecondary} !important;
            border-color: ${token.colorBorder} !important;
            border-style: dashed !important;
            transition: all 0.2s;
          }
          .btn-add-period:hover {
            color: ${token.colorPrimary} !important;
            border-color: ${token.colorPrimary} !important;
            background: ${token.colorPrimaryBg} !important;
          }
          .btn-replicate {
            color: ${token.colorTextSecondary} !important;
            transition: all 0.2s;
          }
          .btn-replicate:hover {
            color: ${token.colorPrimary} !important;
            background: ${token.colorPrimaryBg} !important;
          }
        `}
      </style>
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
            dataSource={openingHours}
            rowKey="day"
            pagination={false}
            size="middle"
            scroll={{ y: tableScrollHeight }}
            onRow={(record) => ({
              style: !record.isOpen
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
            <Text strong>Dias ativos:</Text>{" "}
            {openingHours.filter((h) => h.isOpen).length} de {openingHours.length}
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

export const OpeningHoursTab = React.memo(OpeningHoursTabComponent);
