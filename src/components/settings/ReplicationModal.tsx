import React, { useState, useEffect } from "react";
import { Modal, Checkbox, Row, Col, Typography, theme } from "antd";
import type { OpeningHoursDay } from "../../types/gotime.types";

const { Text } = Typography;

interface ReplicationModalProps {
  open: boolean;
  sourceDay: string | null;
  days: OpeningHoursDay[];
  onClose: () => void;
  onConfirm: (targetDays: string[]) => void;
}

export const ReplicationModal: React.FC<ReplicationModalProps> = ({
  open,
  sourceDay,
  days,
  onClose,
  onConfirm,
}) => {
  const { token } = theme.useToken();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedDays([]);
    }
  }, [open]);

  const handleToggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedDays);
    onClose();
  };

  // Filter out the source day itself
  const targetDays = days.filter((d) => d.day !== sourceDay);

  return (
    <Modal
      title="Replicar horários"
      open={open}
      onCancel={onClose}
      onOk={handleConfirm}
      okText="Replicar"
      cancelText="Cancelar"
      okButtonProps={{ disabled: selectedDays.length === 0 }}
    >
      <Text style={{ display: "block", marginBottom: 16 }}>
        Replicar o horário de <Text strong>{sourceDay}</Text> para:
      </Text>

      <Row gutter={[16, 12]}>
        {targetDays.map((day) => (
          <Col span={12} key={day.day}>
            <Checkbox
              checked={selectedDays.includes(day.day)}
              onChange={() => handleToggleDay(day.day)}
            >
              {day.day}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};
