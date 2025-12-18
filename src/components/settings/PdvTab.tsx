/**
 * PdvTab Component
 * Displays and manages PDV table
 *
 * Extracted from GotimeSettingsPage
 */

import React, { useMemo } from "react";
import {
  Table,
  Button,
  Tag,
  Switch,
  Typography,
  theme,
  Flex,
  Space,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Pdv, PdvType } from "../../types/gotime.types";

const { Text } = Typography;

interface PdvTabProps {
  pdvs: Pdv[];
  searchTerm: string;
  onUpdate: (id: string, updates: Partial<Pdv>) => void;
  onAdd: (newPdv: Omit<Pdv, "id">) => void;
  onDelete: (id: string) => void;
}

import { PdvFormDrawer } from "./PdvFormDrawer";

const PdvTabComponent: React.FC<PdvTabProps> = ({
  pdvs,
  searchTerm,
  onUpdate,
  onAdd,
  onDelete,
}) => {
  const { token } = theme.useToken();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [editingPdv, setEditingPdv] = React.useState<Pdv | null>(null);

  const filteredPdvs = useMemo(() => {
    // ... existing filtering logic (no changes)
    if (!searchTerm.trim()) return pdvs;

    const term = searchTerm.toLowerCase();
    return pdvs.filter((pdv) => {
      const internalCodeText = String(pdv.internalCode);
      const positionText = String(pdv.position);
      return (
        internalCodeText.includes(term) ||
        positionText.includes(term) ||
        pdv.type.toLowerCase().includes(term) ||
        pdv.orientation.toLowerCase().includes(term)
      );
    });
  }, [pdvs, searchTerm]);

  const handleEdit = (pdv: Pdv) => {
    setEditingPdv(pdv);
    setIsDrawerOpen(true);
  };

  const handleAddClick = () => {
    setEditingPdv(null);
    setIsDrawerOpen(true);
  };

  // ... existing columns logic (no changes)
  const columns: ColumnsType<Pdv> = useMemo(
    () => [
      {
        title: "Posição",
        dataIndex: "position",
        sorter: (a, b) => a.position - b.position,
        width: 80,
        onCell: (record) => ({
          style: {
            opacity: record.scaleActive ? 1 : 0.5,
            transition: "opacity 0.2s ease",
          },
        }),
      },
      {
        title: "Cód. Interno",
        dataIndex: "internalCode",
        sorter: (a, b) => a.internalCode - b.internalCode,
        width: 104,
        onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
        onCell: (record) => ({
          style: {
            opacity: record.scaleActive ? 1 : 0.5,
            transition: "opacity 0.2s ease",
          },
        }),
      },
      {
        title: "Tipo do PDV",
        dataIndex: "type",
        width: 112,
        onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
        onCell: (record) => ({
          style: {
            opacity: record.scaleActive ? 1 : 0.5,
            transition: "opacity 0.2s ease",
          },
        }),
        render: (value: PdvType) => {
          if (value === "Normal") return <Tag>{value}</Tag>;
          if (value === "Rápido")
            return <Tag color={token.colorWarning}>{value}</Tag>;
          return <Tag color={token.colorPrimary}>{value}</Tag>;
        },
      },
      {
        title: "Ordem abertura",
        dataIndex: "openOrder",
        width: 120,
        onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
        onCell: (record) => ({
          style: {
            opacity: record.scaleActive ? 1 : 0.5,
            transition: "opacity 0.2s ease",
          },
        }),
      },
      {
        title: "Orientação",
        dataIndex: "orientation",
        width: "30%",
        onCell: (record) => ({
          style: {
            opacity: record.scaleActive ? 1 : 0.5,
            transition: "opacity 0.2s ease",
          },
        }),
      },
      {
        title: "Escala",
        dataIndex: "scaleActive",
        align: "center" as const,
        width: 72,
        onCell: () => ({ style: { opacity: 1 } }),
        render: (value: boolean, record: Pdv) => (
          <Switch
            size="small"
            checked={value}
            onChange={(checked) =>
              onUpdate(record.id, { scaleActive: checked })
            }
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
        width: 120,
        onCell: () => ({ style: { opacity: 1 } }),
        render: (_, record) => (
          <Space size="small">
            <Button type="link" size="small" onClick={() => handleEdit(record)}>
              Gerenciar
            </Button>
            <Popconfirm
              title="Excluir PDV"
              description="Tem certeza que deseja excluir este PDV?"
              onConfirm={() => onDelete(record.id)}
              okText="Sim"
              cancelText="Não"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                className="btn-delete"
              />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [token, onUpdate, onDelete]
  );

  const pdvTypeCounters = filteredPdvs.reduce(
    (acc, pdv) => {
      acc[pdv.type] += 1;
      return acc;
    },
    { Normal: 0, Rápido: 0, Preferencial: 0 } as Record<PdvType, number>
  );

  const tableScrollHeight = "100%";

  const handleSavePdv = (values: any) => {
    if (editingPdv) {
      onUpdate(editingPdv.id, values);
    } else {
      onAdd(values);
    }
    setIsDrawerOpen(false);
  };

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
            dataSource={filteredPdvs}
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
            <Text strong>Total:</Text> {filteredPdvs.length} |{" "}
            <Text strong>Normal:</Text> {pdvTypeCounters.Normal} |{" "}
            <Text strong>Rápido:</Text> {pdvTypeCounters.Rápido} |{" "}
            <Text strong>Preferencial:</Text> {pdvTypeCounters.Preferencial}
          </Text>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClick}
          >
            Adicionar PDV
          </Button>
        </Flex>
      </Flex>

      <PdvFormDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSavePdv}
        initialValues={editingPdv}
      />
    </>
  );
};

export const PdvTab = React.memo(PdvTabComponent);
