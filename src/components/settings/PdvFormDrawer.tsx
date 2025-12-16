import React from "react";
import {
  Drawer,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Flex,
  Typography,
  Alert,
  Tooltip,
  theme,
  Space,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import type { Pdv, PdvType } from "../../types/gotime.types";

const { Text } = Typography;

interface PdvFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  initialValues?: Pdv | null;
}

export const PdvFormDrawer: React.FC<PdvFormDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialValues,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleFinish = (values: any) => {
    onSave(values);
    form.resetFields();
    onClose();
  };

  const handleDisplayLabel = (label: string, tooltip?: string) => (
    <Space size={4}>
      <Text>{label}</Text>
      {tooltip && (
        <Tooltip title={tooltip}>
          <QuestionCircleOutlined
            style={{ color: token.colorTextSecondary, fontSize: 14 }}
          />
        </Tooltip>
      )}
    </Space>
  );

  return (
    <Drawer
      title="Novo PDV"
      placement="right"
      width={480}
      onClose={onClose}
      open={open}
      styles={{
        body: { paddingBottom: 80 },
      }}
      footer={
        <Flex justify="end" gap={8} style={{ padding: "12px 0" }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" onClick={form.submit}>
            Salvar
          </Button>
        </Flex>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={(label, { required }) => (
          <Space size={2}>
            {required && <span style={{ color: token.colorError }}>*</span>}
            {label}
          </Space>
        )}
      >
        <Flex gap={16}>
          <Form.Item
            name="position"
            label={handleDisplayLabel("Posição", "Número da posição do PDV")}
            rules={[{ required: true, message: "Insira a posição" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Insira a posição" type="number" />
          </Form.Item>

          <Form.Item
            name="openOrder"
            label={handleDisplayLabel(
              "Ordem de abertura",
              "Ordem de prioridade na abertura"
            )}
            rules={[{ required: true, message: "Insira a ordem" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Insira a ordem" type="number" />
          </Form.Item>
        </Flex>

        <Form.Item
          name="internalCode"
          label={handleDisplayLabel(
            "Código interno",
            "Código identificador no sistema ERP"
          )}
          rules={[{ required: true, message: "Insira o código interno" }]}
        >
          <Input placeholder="Insira o código interno" />
        </Form.Item>

        <Alert
          message="Certifique-se de que o código interno do PDV seja igual ao ERP."
          type="warning"
          showIcon
          style={{
            marginBottom: 24,
            background: "#FFFBE6",
            border: "1px solid #FFE58F",
          }}
        />

        <Form.Item
          name="type"
          label="Tipo"
          rules={[{ required: true, message: "Selecione o tipo" }]}
        >
          <Select placeholder="Selecione o tipo">
            <Select.Option value="Normal">Normal</Select.Option>
            <Select.Option value="Rápido">Rápido</Select.Option>
            <Select.Option value="Preferencial">Preferencial</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="orientation"
          label="Orientação"
          rules={[{ required: true, message: "Selecione a orientação" }]}
        >
          <Select placeholder="Selecione a orientação">
            <Select.Option value="Esquerda">Esquerda</Select.Option>
            <Select.Option value="Direita">Direita</Select.Option>
            <Select.Option value="Frente">Frente</Select.Option>
          </Select>
        </Form.Item>

        <Flex align="center" justify="space-between" style={{ marginTop: 8 }}>
          <Text>Disponível na geração de escalas</Text>
          <Form.Item name="scaleActive" valuePropName="checked" style={{ margin: 0 }}>
            <Switch size="small" />
          </Form.Item>
        </Flex>
      </Form>
    </Drawer>
  );
};
