/**
 * Gotime Settings Types
 * Centralized type definitions for the Gotime Settings module
 */

// ============ Store Types ============

export interface Store {
  id: string;
  name: string;
}

// ============ Collaborator Types ============

export interface Collaborator {
  id: string;
  name: string;
  operatorCode: number;
  contractCode: string;
  role: string;
  lastWeekOff: string;
  lastSundayOff: string;
  scaleActive: boolean;
}

// ============ PDV Types ============

export type PdvType = "Normal" | "Rápido" | "Preferencial";

export interface Pdv {
  id: string;
  position: number;
  internalCode: number;
  type: PdvType;
  openOrder: string;
  orientation: "Direita" | "Esquerda";
  scaleActive: boolean;
}

// ============ Opening Hours Types ============

export interface TimePeriod {
  start: string;
  end: string;
}

export interface OpeningHoursDay {
  day: string;
  isOpen: boolean;
  periods: TimePeriod[];
}

// ============ Holiday Types ============

export type HolidayType = "Feriado" | "Data especial" | "Recesso";

export interface Holiday {
  id: string;
  date: string;
  name: string;
  type: HolidayType;
  recurring: boolean;
}

export interface CreateHolidayDTO {
  date: string;
  name: string;
  type: HolidayType;
  storeId: string;
}

export type UpdateHolidayDTO = Partial<Omit<Holiday, "id" | "storeId">>;

// ============ Sales Forecast Types ============

export interface SalesForecast {
  id: string;
  date: string;
  dayOfWeek: string;
  value: number;
}

// ============ Parameters Types ============

export interface ParametersState {
  preJornada: boolean;
  posJornada: boolean;
  almocoDuracaoTotal: string;
  almocoDuracaoMinima: string;
  tempoMinimoIniciar: string;
  tempoMaximoIniciar: string;
  diasFolga: string[];
  domingoOption: string;
  pdvMinimo: number;
  nivelServico: number;
  absenteismo: number;
}

// ============ Navigation Types ============

export type TabType =
  | "collaborators"
  | "pdv"
  | "hours"
  | "holidays"
  | "forecast"
  | "parameters";

export type MainSidebarItem =
  | "menu"
  | "star"
  | "history"
  | "notifications"
  | "apps"
  | "settings"
  | "user";

// ============ Option Types ============

export interface SelectOption {
  label: string;
  value: string;
}
