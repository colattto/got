/**
 * PdvTab Component
 * Displays and manages PDV table
 *
 * Extracted from GotimeSettingsPage
 */

import React, { useMemo } from "react";
import { Table, Button, Tag, Switch, Typography, theme, Flex, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Pdv, PdvType } from "../../types/gotime.types";

const { Text } = Typography;

interface PdvTabProps {
  pdvs: Pdv[];
  searchTerm: string;
  onUpdate: (id: string, updates: Partial<Pdv>) => void;
  onAdd: (newPdv: Omit<Pdv, "id">) => void;
}

import { PdvFormDrawer } from "./PdvFormDrawer";

const PdvTabComponent: React.FC<PdvTabProps> = ({ pdvs, searchTerm, onUpdate, onAdd }) => {
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
      },
      {
        title: "Cód. Interno",
        dataIndex: "internalCode",
        sorter: (a, b) => a.internalCode - b.internalCode,
        width: 104,
        onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      },
      {
        title: "Tipo do PDV",
        dataIndex: "type",
        width: 112,
        onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
        render: (value: PdvType) => {
          if (value === "Normal") return <Tag>{value}</Tag>;
          if (value === "Rápido") return <Tag color={token.colorWarning}>{value}</Tag>;
          return <Tag color={token.colorPrimary}>{value}</Tag>;
        },
      },
      {
        title: "Ordem abertura",
        dataIndex: "openOrder",
        width: 120,
        onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      },
      {
        title: "Orientação",
        dataIndex: "orientation",
        width: "30%",
      },
      {
        title: "Escala",
        dataIndex: "scaleActive",
        align: "center" as const,
        width: 72,
        render: (value: boolean, record: Pdv) => (
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
      {
        title: "Ações",
        dataIndex: "id",
        width: 88,
        render: (_, record) => (
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            Gerenciar
          </Button>
        ),
      },
    ],
    [token, onUpdate]
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
          }}
        >
          <Table
            columns={columns}
            dataSource={filteredPdvs}
            rowKey="id"
            pagination={false}
            bordered={false}
            size="middle"
            scroll={{ y: tableScrollHeight }}
          />
        </Flex>

        <Flex
          align="center"
          justify="space-between"
          style={{
            padding: `${token.paddingMD}px 0`,
            borderTop: `1px solid ${token.colorSplit}`,
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

          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
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
