/**
 * CollaboratorsTab Component
 * Displays and manages collaborators table
 *
 * Extracted from GotimeSettingsPage
 */

import React, { useMemo } from "react";
import { Table, Space, Switch, Typography, theme, Flex, Button } from "antd";
import { CalendarOutlined, UploadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Collaborator } from "../../types/gotime.types";

const { Text } = Typography;

interface CollaboratorsTabProps {
  collaborators: Collaborator[];
  searchTerm: string;
  onUpdate: (id: string, updates: Partial<Collaborator>) => void;
}

const CollaboratorsTabComponent: React.FC<CollaboratorsTabProps> = ({
  collaborators,
  searchTerm,
  onUpdate,
}) => {
  const { token } = theme.useToken();

  const filteredCollaborators = useMemo(() => {
    // ... filtering logic
    if (!searchTerm.trim()) return collaborators;

    const term = searchTerm.toLowerCase();
    return collaborators.filter((collaborator) => {
      const operatorCodeText = String(collaborator.operatorCode);
      return (
        collaborator.name.toLowerCase().includes(term) ||
        collaborator.role.toLowerCase().includes(term) ||
        operatorCodeText.includes(term)
      );
    });
  }, [collaborators, searchTerm]);

  const columns: ColumnsType<Collaborator> = useMemo(
    () => [
      // ... previous columns
      {
        title: "Nome",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        ellipsis: true,
        width: "20%",
      },
      {
        title: "Cód. Operador",
        dataIndex: "operatorCode",
        sorter: (a, b) => a.operatorCode - b.operatorCode,
        width: 112,
        onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      },
      {
        title: "Contrato",
        dataIndex: "contractCode",
        width: 88,
      },
      {
        title: "Função",
        dataIndex: "role",
        ellipsis: true,
        width: "20%",
        filters: [
          { text: "Atendente de Balcão", value: "Atendente de Balcão" },
          { text: "Operador de Caixa Rápido", value: "Operador de Caixa Rápido" },
          { text: "Operador de Frente de Caixa", value: "Operador de Frente de Caixa" },
        ],
        onFilter: (value, record) => record.role === value,
      },
      {
        title: "Últ. folga semana",
        dataIndex: "lastWeekOff",
        width: 152,
        onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
        render: (value: string) => (
          <Space size={8}>
            <CalendarOutlined style={{ color: token.colorTextTertiary, fontSize: 14 }} />
            <Text>{value}</Text>
          </Space>
        ),
      },
      {
        title: "Últ. folga domingo",
        dataIndex: "lastSundayOff",
        width: 152,
        onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
        render: (value: string) => (
          <Space size={8}>
            <CalendarOutlined style={{ color: token.colorTextTertiary, fontSize: 14 }} />
            <Text>{value}</Text>
          </Space>
        ),
      },
      {
        title: "Escala",
        dataIndex: "scaleActive",
        align: "center" as const,
        width: 72,
        render: (value: boolean, record: Collaborator) => (
          <Switch
            size="small"
            checked={value}
            onChange={(checked) => onUpdate(record.id, { scaleActive: checked })}
            style={{
              backgroundColor: value ? token.colorPrimary : token.colorTextQuaternary,
            }}
          />
        ),
      },
    ],
    [token, onUpdate]
  );

  const totalActiveScale = filteredCollaborators.filter((c) => c.scaleActive).length;
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
          dataSource={filteredCollaborators}
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
          padding: "16px 0 0 0",
          background: token.colorBgContainer,
          flexShrink: 0,
        }}
      >
        <Text>
          <Text strong>Total:</Text> {filteredCollaborators.length} colaboradores |{" "}
          <Text strong>Na escala:</Text> {totalActiveScale}
        </Text>

        <Button icon={<UploadOutlined />}>Importar colaboradores</Button>
      </Flex>
    </Flex>
  );
};

export const CollaboratorsTab = React.memo(CollaboratorsTabComponent);
