/**
 * ParametersTab Component
 * Configuration parameters for store settings
 * Redesigned to match Figma design with modern UI/UX
 */

import React from "react";
import {
  Flex,
  Typography,
  theme,
  Checkbox,
  TimePicker,
  Radio,
  Button,
  InputNumber,
  Tooltip,
  Divider,
} from "antd";
import {
  QuestionCircleOutlined,
  UploadOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useParameters } from "../hooks/useParameters";

const { Text } = Typography;

interface ParametersTabProps {
  storeId: string;
}

// Reusable Block Header Component
const BlockHeader: React.FC<{
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
}> = ({ title, icon, iconBgColor }) => {
  const { token } = theme.useToken();
  
  return (
    <Flex align="center" gap={12} style={{ marginBottom: 20 }}>
      <Flex
        align="center"
        justify="center"
        style={{
          width: 36,
          height: 36,
          borderRadius: token.borderRadius,
          background: iconBgColor,
        }}
      >
        {icon}
      </Flex>
      <Text strong style={{ fontSize: 15 }}>{title}</Text>
    </Flex>
  );
};

// Reusable Section Title Component
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = theme.useToken();
  
  return (
    <Text 
      strong 
      style={{ 
        fontSize: 13, 
        color: token.colorTextSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        display: 'block',
      }}
    >
      {children}
    </Text>
  );
};

const ParametersTabComponent: React.FC<ParametersTabProps> = ({ storeId }) => {
  const { token } = theme.useToken();
  const { params, loading, updateParam } = useParameters({ storeId });

  if (loading || !params) {
    return null;
  }

  // Days of week options for folgas
  const diasFolgaOptions = [
    { label: "Domingo", value: "domingo" },
    { label: "Segunda-feira", value: "segunda" },
    { label: "Terça-feira", value: "terca" },
    { label: "Quarta-feira", value: "quarta" },
    { label: "Quinta-feira", value: "quinta" },
    { label: "Sexta-feira", value: "sexta" },
    { label: "Sábado", value: "sabado" },
  ];

  // Domingo options
  const domingoOptions = [
    { label: "Todo domingo", value: "todo" },
    { label: "1x1", value: "1x1" },
    { label: "2x1", value: "2x1" },
    { label: "3x1", value: "3x1" },
  ];

  // Mock PDV counts for display
  const pdvCounts = {
    normal: 5,
    rapido: 5,
    preferencial: 5,
    total: 15,
  };

  const blockStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 200,
    background: token.colorBgContainer,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    padding: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: token.borderRadius,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    color: token.colorTextSecondary,
    marginBottom: 6,
    display: 'block',
  };

  return (
    <Flex
      justify="space-between"
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        paddingTop: 8,
        gap: 24,
      }}
    >
      {/* Column 1: Intervalos */}
      <Flex vertical style={blockStyle}>
        <BlockHeader
          title="Intervalos"
          icon={<ClockCircleOutlined style={{ fontSize: 18, color: token.colorPrimary }} />}
          iconBgColor={token.colorPrimaryBg}
        />

        {/* Pre/Post Jornada Checkboxes */}
        <Flex vertical gap={12} style={{ marginBottom: 24 }}>
          <Checkbox
            checked={params.preJornada}
            onChange={(e) => updateParam("preJornada", e.target.checked)}
          >
            <Flex vertical gap={2}>
              <Text style={{ fontSize: 13 }}>Considerar 20 minutos pré jornada</Text>
              <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.3 }}>
                Tempo para preparação antes do expediente
              </Text>
            </Flex>
          </Checkbox>

          <Checkbox
            checked={params.posJornada}
            onChange={(e) => updateParam("posJornada", e.target.checked)}
          >
            <Flex vertical gap={2}>
              <Text style={{ fontSize: 13 }}>Considerar 20 minutos pós-jornada</Text>
              <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.3 }}>
                Tempo para fechamento após expediente
              </Text>
            </Flex>
          </Checkbox>
        </Flex>

        <Divider style={{ margin: '16px 0' }} />

        {/* Almoço Section */}
        <SectionTitle>Almoço</SectionTitle>

        <Flex vertical gap={14} style={{ marginBottom: 24 }}>
          <Flex vertical gap={4}>
            <Text style={labelStyle}>Duração total do almoço</Text>
            <TimePicker
              format="HH:mm"
              value={dayjs(params.almocoDuracaoTotal || "00:00", "HH:mm")}
              onChange={(time) =>
                updateParam("almocoDuracaoTotal", time?.format("HH:mm") || "00:00")
              }
              style={inputStyle}
              placeholder="00:00"
              size="middle"
            />
          </Flex>

          <Flex vertical gap={4}>
            <Text style={labelStyle}>Duração mínima do almoço</Text>
            <TimePicker
              format="HH:mm"
              value={dayjs(params.almocoDuracaoMinima || "00:00", "HH:mm")}
              onChange={(time) =>
                updateParam("almocoDuracaoMinima", time?.format("HH:mm") || "00:00")
              }
              style={inputStyle}
              placeholder="00:00"
              size="middle"
            />
          </Flex>

          <Flex vertical gap={4}>
            <Text style={labelStyle}>Tempo mínimo para iniciar</Text>
            <TimePicker
              format="HH:mm"
              value={dayjs(params.tempoMinimoIniciar || "00:00", "HH:mm")}
              onChange={(time) =>
                updateParam("tempoMinimoIniciar", time?.format("HH:mm") || "00:00")
              }
              style={inputStyle}
              placeholder="00:00"
              size="middle"
            />
          </Flex>

          <Flex vertical gap={4}>
            <Text style={labelStyle}>Tempo máximo para iniciar</Text>
            <TimePicker
              format="HH:mm"
              value={dayjs(params.tempoMaximoIniciar || "00:00", "HH:mm")}
              onChange={(time) =>
                updateParam("tempoMaximoIniciar", time?.format("HH:mm") || "00:00")
              }
              style={inputStyle}
              placeholder="00:00"
              size="middle"
            />
          </Flex>
        </Flex>

        <Divider style={{ margin: '16px 0' }} />

        {/* Acordo Coletivo Section */}
        <SectionTitle>Acordo coletivo</SectionTitle>
        <Button 
          icon={<UploadOutlined />} 
          style={{ width: "100%" }}
          type="default"
        >
          Enviar acordo coletivo
        </Button>
      </Flex>

      {/* Column 2: Folgas */}
      <Flex vertical style={blockStyle}>
        <BlockHeader
          title="Folgas"
          icon={<CalendarOutlined style={{ fontSize: 18, color: '#52c41a' }} />}
          iconBgColor="rgba(82, 196, 26, 0.1)"
        />

        {/* Dias de folga Section */}
        <SectionTitle>Dias de folga</SectionTitle>
        <Checkbox.Group
          value={params.diasFolga}
          onChange={(values) => updateParam("diasFolga", values as string[])}
          style={{ marginBottom: 24 }}
        >
          <Flex vertical gap={8}>
            {diasFolgaOptions.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                <Text style={{ fontSize: 13 }}>{option.label}</Text>
              </Checkbox>
            ))}
          </Flex>
        </Checkbox.Group>

        <Divider style={{ margin: '16px 0' }} />

        {/* Aos domingos Section */}
        <SectionTitle>Aos domingos</SectionTitle>
        <Radio.Group
          value={params.domingoOption}
          onChange={(e) => updateParam("domingoOption", e.target.value)}
        >
          <Flex vertical gap={8}>
            {domingoOptions.map((option) => (
              <Radio key={option.value} value={option.value}>
                <Text style={{ fontSize: 13 }}>{option.label}</Text>
              </Radio>
            ))}
          </Flex>
        </Radio.Group>
      </Flex>

      {/* Column 3: Tolerância de atendimento */}
      <Flex vertical style={blockStyle}>
        <BlockHeader
          title="Tolerância de atendimento"
          icon={<DashboardOutlined style={{ fontSize: 18, color: '#722ed1' }} />}
          iconBgColor="rgba(114, 46, 209, 0.1)"
        />

        {/* Quantidade PDV na escala Section */}
        <SectionTitle>Quantidade PDV na escala</SectionTitle>
        <Flex 
          vertical 
          gap={6} 
          style={{ 
            marginBottom: 16,
            padding: 12,
            background: token.colorFillQuaternary,
            borderRadius: token.borderRadius,
          }}
        >
          <Flex justify="space-between">
            <Text style={{ fontSize: 13, color: token.colorTextSecondary }}>Normal</Text>
            <Text style={{ fontSize: 13 }}>{pdvCounts.normal}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text style={{ fontSize: 13, color: token.colorTextSecondary }}>Rápido</Text>
            <Text style={{ fontSize: 13 }}>{pdvCounts.rapido}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text style={{ fontSize: 13, color: token.colorTextSecondary }}>Preferencial</Text>
            <Text style={{ fontSize: 13 }}>{pdvCounts.preferencial}</Text>
          </Flex>
        </Flex>

        <Flex 
          justify="space-between" 
          style={{ 
            marginBottom: 24,
            padding: '10px 12px',
            background: token.colorPrimaryBg,
            borderRadius: token.borderRadius,
          }}
        >
          <Text strong style={{ fontSize: 13, color: token.colorPrimary }}>Total de PDV</Text>
          <Text strong style={{ fontSize: 14, color: token.colorPrimary }}>{pdvCounts.total}</Text>
        </Flex>

        <Divider style={{ margin: '16px 0' }} />

        {/* Parâmetros de tolerância Section */}
        <SectionTitle>Parâmetros de tolerância</SectionTitle>
        <Flex vertical gap={14}>
          <Flex vertical gap={4}>
            <Flex align="center" gap={4}>
              <Text type="danger" style={{ fontSize: 12 }}>*</Text>
              <Text style={{ fontSize: 13 }}>PDV mínimo</Text>
              <Tooltip title="Número mínimo de PDVs ativos">
                <QuestionCircleOutlined
                  style={{ color: token.colorTextQuaternary, fontSize: 11 }}
                />
              </Tooltip>
            </Flex>
            <InputNumber
              value={params.pdvMinimo}
              onChange={(value) => updateParam("pdvMinimo", value || 0)}
              min={0}
              style={inputStyle}
              placeholder="0"
              size="middle"
            />
          </Flex>

          <Flex vertical gap={4}>
            <Flex align="center" gap={4}>
              <Text type="danger" style={{ fontSize: 12 }}>*</Text>
              <Text style={{ fontSize: 13 }}>Nível de serviço</Text>
              <Tooltip title="Porcentagem de atendimentos dentro do SLA">
                <QuestionCircleOutlined
                  style={{ color: token.colorTextQuaternary, fontSize: 11 }}
                />
              </Tooltip>
            </Flex>
            <InputNumber
              value={params.nivelServico}
              onChange={(value) => updateParam("nivelServico", value || 0)}
              min={0}
              max={100}
              style={inputStyle}
              placeholder="0"
              addonAfter="%"
              size="middle"
            />
          </Flex>

          <Flex vertical gap={4}>
            <Flex align="center" gap={4}>
              <Text type="danger" style={{ fontSize: 12 }}>*</Text>
              <Text style={{ fontSize: 13 }}>Absenteísmo</Text>
              <Tooltip title="Taxa esperada de ausências">
                <QuestionCircleOutlined
                  style={{ color: token.colorTextQuaternary, fontSize: 11 }}
                />
              </Tooltip>
            </Flex>
            <InputNumber
              value={params.absenteismo}
              onChange={(value) => updateParam("absenteismo", value || 0)}
              min={0}
              max={100}
              style={inputStyle}
              placeholder="0"
              addonAfter="%"
              size="middle"
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const ParametersTab = React.memo(ParametersTabComponent);
