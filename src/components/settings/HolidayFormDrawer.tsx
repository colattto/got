import React, { useState, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Checkbox,
  Button,
  Flex,
  Typography,
  Space,
  theme,
  Select,
} from "antd";

const { Text } = Typography;

interface HolidayFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
}

export const HolidayFormDrawer: React.FC<HolidayFormDrawerProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [drawerSize, setDrawerSize] = useState(480);
  
  // Watch for the 'closed' checkbox to disable time pickers
  const closed = Form.useWatch("closed", form);

  // Reset size when drawer opens
  useEffect(() => {
    if (open) {
      setDrawerSize(480);
    }
  }, [open]);

  const handleFinish = (values: any) => {
    onSave(values);
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title="Novo feriado ou dia especial"
      placement="right"
      onClose={onClose}
      open={open}
      size={drawerSize}
      resizable={{
        onResize: (newSize) => setDrawerSize(newSize),
      }}
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
        <Form.Item
          name="name"
          label="Nome"
          rules={[{ required: true, message: "Insira o nome" }]}
        >
          <Input placeholder="Insira o nome" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Tipo"
          rules={[{ required: true, message: "Selecione o tipo" }]}
        >
          <Select placeholder="Selecione o tipo">
            <Select.Option value="Feriado">Feriado</Select.Option>
            <Select.Option value="Data especial">Data especial</Select.Option>
            <Select.Option value="Recesso">Recesso</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="Data"
          rules={[{ required: true, message: "Selecione a data" }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            placeholder="Selecione a data"
          />
        </Form.Item>

        <Flex gap={16}>
          <Form.Item
            name="startTime"
            label="Hora inicial"
            rules={[{ required: !closed, message: "Selecione a hora" }]}
            style={{ flex: 1 }}
          >
            <TimePicker
              format="HH:mm"
              style={{ width: "100%" }}
              placeholder="Selecione a hora"
              disabled={closed}
            />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="Hora final"
            rules={[{ required: !closed, message: "Selecione a hora" }]}
            style={{ flex: 1 }}
          >
            <TimePicker
              format="HH:mm"
              style={{ width: "100%" }}
              placeholder="Selecione a hora"
              disabled={closed}
            />
          </Form.Item>
        </Flex>

        <Form.Item name="closed" valuePropName="checked">
          <Checkbox>Fechado</Checkbox>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
