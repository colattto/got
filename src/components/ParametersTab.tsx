/**
 * ParametersTab Component
 * Configuration parameters for store settings
 *
 * Refactored: Logic extracted to useParameters hook
 */

import React from "react";
import {
  Row,
  Col,
  Card,
  Flex,
  Typography,
  theme,
  Checkbox,
  TimePicker,
  Radio,
  Button,
  InputNumber,
  Divider,
  Tooltip,
} from "antd";
import {
  HourglassOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useParameters } from "../hooks/useParameters";
import { DIAS_FOLGA_OPTIONS, DOMINGO_OPTIONS } from "../constants/gotime.constants";

const { Text, Title } = Typography;

interface ParametersTabProps {
  storeId: string;
}

const ParametersTabComponent: React.FC<ParametersTabProps> = ({ storeId }) => {
  const { token } = theme.useToken();
  const { params, updateParam, handleUpload } = useParameters({ storeId });

  return (
    <Row gutter={24}>
      {/* Card 1: Intervalos */}
      <Col span={8}>
        <Card
          title={
            <Flex align="center" gap={8}>
              <HourglassOutlined style={{ color: token.colorPrimary }} />
              <Text strong>Intervalos</Text>
            </Flex>
          }
          size="small"
        >
          <Flex vertical gap={16}>
            <Flex vertical gap={8}>
              <Checkbox
                checked={params.preJornada}
                onChange={(e) => updateParam("preJornada", e.target.checked)}
              >
                Pré-jornada
              </Checkbox>
              <Checkbox
                checked={params.posJornada}
                onChange={(e) => updateParam("posJornada", e.target.checked)}
              >
                Pós-jornada
              </Checkbox>
            </Flex>

            <Divider style={{ margin: "8px 0" }} />

            <Flex vertical gap={8}>
              <Text type="secondary">Duração total do almoço</Text>
              <TimePicker
                format="HH:mm"
                value={dayjs(params.almocoDuracaoTotal, "HH:mm")}
                onChange={(time) =>
                  updateParam(
                    "almocoDuracaoTotal",
                    time?.format("HH:mm") || "00:00"
                  )
                }
                style={{ width: "100%" }}
              />
            </Flex>

            <Flex vertical gap={8}>
              <Text type="secondary">Duração mínima do almoço</Text>
              <TimePicker
                format="HH:mm"
                value={dayjs(params.almocoDuracaoMinima, "HH:mm")}
                onChange={(time) =>
                  updateParam(
                    "almocoDuracaoMinima",
                    time?.format("HH:mm") || "00:00"
                  )
                }
                style={{ width: "100%" }}
              />
            </Flex>

            <Flex vertical gap={8}>
              <Text type="secondary">Tempo mínimo para iniciar</Text>
              <TimePicker
                format="HH:mm"
                value={dayjs(params.tempoMinimoIniciar, "HH:mm")}
                onChange={(time) =>
                  updateParam(
                    "tempoMinimoIniciar",
                    time?.format("HH:mm") || "00:00"
                  )
                }
                style={{ width: "100%" }}
              />
            </Flex>

            <Flex vertical gap={8}>
              <Text type="secondary">Tempo máximo para iniciar</Text>
              <TimePicker
                format="HH:mm"
                value={dayjs(params.tempoMaximoIniciar, "HH:mm")}
                onChange={(time) =>
                  updateParam(
                    "tempoMaximoIniciar",
                    time?.format("HH:mm") || "00:00"
                  )
                }
                style={{ width: "100%" }}
              />
            </Flex>
          </Flex>
        </Card>
      </Col>

      {/* Card 2: Folgas */}
      <Col span={8}>
        <Card
          title={
            <Flex align="center" gap={8}>
              <CalendarOutlined style={{ color: token.colorPrimary }} />
              <Text strong>Folgas</Text>
            </Flex>
          }
          size="small"
        >
          <Flex vertical gap={16}>
            <Flex vertical gap={8}>
              <Text type="secondary">Quais dias poderão receber folga?</Text>
              <Checkbox.Group
                value={params.diasFolga}
                onChange={(values) =>
                  updateParam("diasFolga", values as string[])
                }
              >
                <Flex vertical gap={8}>
                  {DIAS_FOLGA_OPTIONS.map((option) => (
                    <Checkbox key={option.value} value={option.value}>
                      {option.label}
                    </Checkbox>
                  ))}
                </Flex>
              </Checkbox.Group>
            </Flex>

            <Divider style={{ margin: "8px 0" }} />

            <Flex vertical gap={8}>
              <Text type="secondary">Domingo</Text>
              <Radio.Group
                value={params.domingoOption}
                onChange={(e) => updateParam("domingoOption", e.target.value)}
              >
                <Flex vertical gap={8}>
                  {DOMINGO_OPTIONS.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Flex>
              </Radio.Group>
            </Flex>
          </Flex>
        </Card>
      </Col>

      {/* Card 3: Tolerância de atendimento */}
      <Col span={8}>
        <Card
          title={
            <Flex align="center" gap={8}>
              <InfoCircleOutlined style={{ color: token.colorPrimary }} />
              <Text strong>Tolerância de atendimento</Text>
            </Flex>
          }
          size="small"
        >
          <Flex vertical gap={16}>
            <Flex vertical gap={8}>
              <Flex align="center" gap={4}>
                <Text type="secondary">PDV mínimo</Text>
                <Tooltip title="Número mínimo de PDVs ativos">
                  <InfoCircleOutlined
                    style={{ color: token.colorTextQuaternary, fontSize: 12 }}
                  />
                </Tooltip>
              </Flex>
              <InputNumber
                value={params.pdvMinimo}
                onChange={(value) => updateParam("pdvMinimo", value || 0)}
                min={0}
                max={20}
                style={{ width: "100%" }}
              />
            </Flex>

            <Flex vertical gap={8}>
              <Flex align="center" gap={4}>
                <Text type="secondary">Nível de serviço (%)</Text>
                <Tooltip title="Porcentagem de atendimentos dentro do SLA">
                  <InfoCircleOutlined
                    style={{ color: token.colorTextQuaternary, fontSize: 12 }}
                  />
                </Tooltip>
              </Flex>
              <InputNumber
                value={params.nivelServico}
                onChange={(value) => updateParam("nivelServico", value || 0)}
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => Number(value?.replace("%", "") || 0)}
                style={{ width: "100%" }}
              />
            </Flex>

            <Flex vertical gap={8}>
              <Flex align="center" gap={4}>
                <Text type="secondary">Absenteísmo (%)</Text>
                <Tooltip title="Taxa de ausência esperada">
                  <InfoCircleOutlined
                    style={{ color: token.colorTextQuaternary, fontSize: 12 }}
                  />
                </Tooltip>
              </Flex>
              <InputNumber
                value={params.absenteismo}
                onChange={(value) => updateParam("absenteismo", value || 0)}
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => Number(value?.replace("%", "") || 0)}
                style={{ width: "100%" }}
              />
            </Flex>

            <Divider style={{ margin: "8px 0" }} />

            <Button icon={<UploadOutlined />} onClick={handleUpload} block>
              Importar parâmetros
            </Button>
          </Flex>
        </Card>
      </Col>
    </Row>
  );
};

// Memoized export to prevent unnecessary re-renders
export const ParametersTab = React.memo(ParametersTabComponent);
