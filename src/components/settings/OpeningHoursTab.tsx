/**
 * OpeningHoursTab Component
 * Displays and manages store opening hours
 *
 * Refactored to match Figma design
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
  Space,
  Dropdown,
  MenuProps,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  SwapOutlined,
  DownOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { OpeningHoursDay, TimePeriod } from "../../types/gotime.types";
import { DEFAULT_OPENING_HOURS } from "../../constants/gotime.constants";
import { ReplicationModal } from "./ReplicationModal";

const { Text } = Typography;

interface OpeningHoursTabProps {
  storeId: string;
}

const OpeningHoursTabComponent: React.FC<OpeningHoursTabProps> = ({
  storeId,
}) => {
  const { token } = theme.useToken();
  const [openingHours, setOpeningHours] = useState<OpeningHoursDay[]>(
    DEFAULT_OPENING_HOURS
  );
  const [replicationModalOpen, setReplicationModalOpen] = useState(false);
  const [replicationSourceDay, setReplicationSourceDay] = useState<string | null>(
    null
  );

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

  const handleReplicateAll = useCallback(
    (sourceDay: string) => {
      setOpeningHours((prev) => {
        const source = prev.find((d) => d.day === sourceDay);
        if (!source) return prev;
        return prev.map((d) =>
          d.day === sourceDay
            ? d
            : { ...d, isOpen: source.isOpen, periods: [...source.periods] }
        );
      });
    },
    []
  );

  const handleReplicateToSelected = useCallback(
    (targetDays: string[]) => {
      if (!replicationSourceDay) return;
      setOpeningHours((prev) => {
        const source = prev.find((d) => d.day === replicationSourceDay);
        if (!source) return prev;
        return prev.map((d) =>
          targetDays.includes(d.day)
            ? { ...d, isOpen: source.isOpen, periods: [...source.periods] }
            : d
        );
      });
    },
    [replicationSourceDay]
  );

  const getDropdownItems = (day: string): MenuProps["items"] => [
    {
      key: "all",
      label: "Replicar em todos",
      icon: <CopyOutlined />,
      onClick: () => handleReplicateAll(day),
    },
    {
      key: "select",
      label: "Selecionar dias",
      icon: <SwapOutlined />,
      onClick: () => {
        setReplicationSourceDay(day);
        setReplicationModalOpen(true);
      },
    },
  ];

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
            <Flex gap={16} wrap="wrap">
              {periods.map((period, index) => (
                <Flex
                  key={index}
                  align="center"
                  gap={8}
                  style={{
                    background: token.colorBgLayout,
                    padding: "4px 8px",
                    borderRadius: token.borderRadius,
                  }}
                >
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, minWidth: 60 }}
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
                      icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                      onClick={() => handleRemovePeriod(record.day, index)}
                      style={{ padding: "0 4px" }}
                    />
                  )}
                </Flex>
              ))}
              <Button
                type="text"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => handleAddPeriod(record.day)}
                style={{ color: token.colorPrimary }}
              >
                Período
              </Button>
            </Flex>
          );
        },
      },
      {
        title: "Ações",
        width: 100,
        align: "center" as const,
        render: (_, record) => (
          <Dropdown
            menu={{ items: getDropdownItems(record.day) }}
            trigger={["click"]}
          >
            <Button
              type="text"
              size="small"
              icon={<SwapOutlined style={{ transform: "rotate(90deg)" }} />}
            />
          </Dropdown>
        ),
      },
    ],
    [
      token,
      handleToggleDay,
      handleTimeChange,
      handleAddPeriod,
      handleRemovePeriod,
      handleReplicateAll,
    ]
  );

  const tableScrollHeight = "100%";

  return (
    <>
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
            <Text strong>Dias ativos:</Text>{" "}
            {openingHours.filter((h) => h.isOpen).length} de {openingHours.length}
          </Text>
        </Flex>
      </Flex>

      <ReplicationModal
        open={replicationModalOpen}
        sourceDay={replicationSourceDay}
        days={openingHours}
        onClose={() => setReplicationModalOpen(false)}
        onConfirm={handleReplicateToSelected}
      />
    </>
  );
};

export const OpeningHoursTab = React.memo(OpeningHoursTabComponent);
