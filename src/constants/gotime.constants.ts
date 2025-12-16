/**
 * Gotime Settings Constants
 * Centralized mock data and configuration constants
 */

import type {
  Store,
  Collaborator,
  Pdv,
  OpeningHoursDay,
  SelectOption,
} from "../types/gotime.types";

// ============ Stores Mock Data ============

export const STORES_MOCK: Store[] = [
  { id: "estrela", name: "Supermercado Estrela" },
  { id: "verdejante", name: "Supermercado Verdejante" },
  { id: "sol-nascente", name: "Hipermercado Sol Nascente" },
  { id: "povo", name: "Mercado do Povo" },
];

// ============ Collaborators Mock Data ============

export const COLLABORATORS_BY_STORE: Record<string, Collaborator[]> = {
  estrela: [
    {
      id: "lia-andrade",
      name: "Lia Andrade",
      operatorCode: 42,
      contractCode: "04h00",
      role: "Atendente de Balcão",
      lastWeekOff: "01/11/2025",
      lastSundayOff: "01/12/2025",
      scaleActive: true,
    },
    {
      id: "rafael-costa",
      name: "Rafael Costa",
      operatorCode: 78,
      contractCode: "04h00",
      role: "Operador de Caixa Rápido",
      lastWeekOff: "15/11/2025",
      lastSundayOff: "01/12/2025",
      scaleActive: true,
    },
    {
      id: "sofia-almeida",
      name: "Sofia Almeida",
      operatorCode: 34,
      contractCode: "07h40",
      role: "Operador de Frente de Caixa",
      lastWeekOff: "20/11/2025",
      lastSundayOff: "01/12/2025",
      scaleActive: true,
    },
    {
      id: "lucas-ferreira",
      name: "Lucas Ferreira",
      operatorCode: 61,
      contractCode: "07h40",
      role: "Operador de Caixa Rápido",
      lastWeekOff: "25/11/2025",
      lastSundayOff: "01/12/2025",
      scaleActive: true,
    },
    {
      id: "ana-clara",
      name: "Ana Clara",
      operatorCode: 27,
      contractCode: "07h40",
      role: "Operador de Frente de Caixa",
      lastWeekOff: "30/11/2025",
      lastSundayOff: "01/12/2025",
      scaleActive: false,
    },
  ],
  verdejante: [
    {
      id: "joao-martins",
      name: "João Martins",
      operatorCode: 11,
      contractCode: "06h00",
      role: "Repositor de Hortifruti",
      lastWeekOff: "03/11/2025",
      lastSundayOff: "10/11/2025",
      scaleActive: true,
    },
    {
      id: "camilia-souza",
      name: "Camila Souza",
      operatorCode: 19,
      contractCode: "06h00",
      role: "Operador de Frente de Caixa",
      lastWeekOff: "08/11/2025",
      lastSundayOff: "24/11/2025",
      scaleActive: true,
    },
  ],
  "sol-nascente": [
    {
      id: "bruno-oliveira",
      name: "Bruno Oliveira",
      operatorCode: 90,
      contractCode: "08h00",
      role: "Líder de Frente de Caixa",
      lastWeekOff: "12/11/2025",
      lastSundayOff: "17/11/2025",
      scaleActive: true,
    },
  ],
  povo: [
    {
      id: "mariana-lopes",
      name: "Mariana Lopes",
      operatorCode: 55,
      contractCode: "04h00",
      role: "Atendente de Balcão",
      lastWeekOff: "05/11/2025",
      lastSundayOff: "23/11/2025",
      scaleActive: false,
    },
  ],
};

// ============ PDV Mock Data ============

export const PDVS_BY_STORE: Record<string, Pdv[]> = {
  estrela: [
    {
      id: "pdv-2-1743",
      position: 2,
      internalCode: 1743,
      type: "Normal",
      openOrder: "2º",
      orientation: "Direita",
      scaleActive: true,
    },
    {
      id: "pdv-3-5829",
      position: 3,
      internalCode: 5829,
      type: "Normal",
      openOrder: "3º",
      orientation: "Direita",
      scaleActive: true,
    },
    {
      id: "pdv-5-9031",
      position: 5,
      internalCode: 9031,
      type: "Rápido",
      openOrder: "5º",
      orientation: "Direita",
      scaleActive: true,
    },
    {
      id: "pdv-4-2468",
      position: 4,
      internalCode: 2468,
      type: "Rápido",
      openOrder: "4º",
      orientation: "Esquerda",
      scaleActive: true,
    },
    {
      id: "pdv-1-7310",
      position: 1,
      internalCode: 7310,
      type: "Preferencial",
      openOrder: "1º",
      orientation: "Esquerda",
      scaleActive: true,
    },
  ],
  verdejante: [
    {
      id: "pdv-v-1",
      position: 1,
      internalCode: 2101,
      type: "Normal",
      openOrder: "1º",
      orientation: "Direita",
      scaleActive: true,
    },
  ],
  "sol-nascente": [
    {
      id: "pdv-s-1",
      position: 1,
      internalCode: 3301,
      type: "Rápido",
      openOrder: "1º",
      orientation: "Direita",
      scaleActive: true,
    },
  ],
  povo: [
    {
      id: "pdv-p-1",
      position: 1,
      internalCode: 4401,
      type: "Normal",
      openOrder: "1º",
      orientation: "Esquerda",
      scaleActive: false,
    },
  ],
};

// ============ Opening Hours Default ============

export const DEFAULT_OPENING_HOURS: OpeningHoursDay[] = [
  {
    day: "Domingo",
    isOpen: true,
    periods: [
      { start: "06:00", end: "12:00" },
      { start: "06:00", end: "12:00" },
    ],
  },
  {
    day: "Segunda-feira",
    isOpen: false,
    periods: [{ start: "08:00", end: "18:00" }],
  },
  {
    day: "Terça-feira",
    isOpen: true,
    periods: [{ start: "08:00", end: "18:00" }],
  },
  {
    day: "Quarta-feira",
    isOpen: false,
    periods: [{ start: "08:00", end: "18:00" }],
  },
  {
    day: "Quinta-feira",
    isOpen: true,
    periods: [{ start: "08:00", end: "18:00" }],
  },
  {
    day: "Sexta-feira",
    isOpen: false,
    periods: [{ start: "08:00", end: "18:00" }],
  },
  {
    day: "Sábado",
    isOpen: false,
    periods: [{ start: "08:00", end: "12:00" }],
  },
];

// ============ Month Names ============

export const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// ============ Weekday Names ============

export const WEEKDAY_NAMES = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

// ============ Parameters Options ============

export const DIAS_FOLGA_OPTIONS: SelectOption[] = [
  { label: "Segunda", value: "segunda" },
  { label: "Terça", value: "terca" },
  { label: "Quarta", value: "quarta" },
  { label: "Quinta", value: "quinta" },
  { label: "Sexta", value: "sexta" },
  { label: "Sábado", value: "sabado" },
];

export const DOMINGO_OPTIONS: SelectOption[] = [
  { label: "Todo domingo", value: "todo-domingo" },
  { label: "1x1", value: "1x1" },
  { label: "2x1", value: "2x1" },
  { label: "3x1", value: "3x1" },
];

// ============ Parameters Initial State ============

export const INITIAL_PARAMETERS_STATE = {
  preJornada: false,
  posJornada: false,
  almocoDuracaoTotal: "00:00",
  almocoDuracaoMinima: "00:00",
  tempoMinimoIniciar: "00:00",
  tempoMaximoIniciar: "00:00",
  diasFolga: [] as string[],
  domingoOption: "todo-domingo",
  pdvMinimo: 2,
  nivelServico: 85,
  absenteismo: 5,
};

// ============ Tab Configuration ============

export const SETTINGS_TABS = [
  { key: "collaborators", label: "Colaboradores" },
  { key: "pdv", label: "PDV" },
  { key: "hours", label: "Horários de Funcionamento" },
  { key: "holidays", label: "Feriados e dias especiais" },
  { key: "forecast", label: "Previsão de Vendas" },
  { key: "parameters", label: "Parâmetros" },
] as const;
