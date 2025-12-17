/**
 * Holiday Mock Data
 * Centralized fixture data for holidays
 */

import type { Holiday } from "../../types/gotime.types";

export const HOLIDAYS_MOCK: Holiday[] = [
  {
    id: "1",
    date: "01/01/2025",
    name: "Ano Novo",
    type: "Feriado",
    recurring: true,
  },
  {
    id: "2",
    date: "20/02/2025",
    name: "Carnaval",
    type: "Feriado",
    recurring: false,
  },
  {
    id: "3",
    date: "18/04/2025",
    name: "Sexta-feira Santa",
    type: "Feriado",
    recurring: false,
  },
  {
    id: "4",
    date: "21/04/2025",
    name: "Tiradentes",
    type: "Feriado",
    recurring: true,
  },
  {
    id: "5",
    date: "01/05/2025",
    name: "Dia do Trabalho",
    type: "Feriado",
    recurring: true,
  },
  {
    id: "6",
    date: "19/06/2025",
    name: "Corpus Christi",
    type: "Feriado",
    recurring: false,
  },
  {
    id: "7",
    date: "07/09/2025",
    name: "Independência do Brasil",
    type: "Feriado",
    recurring: true,
  },
  {
    id: "8",
    date: "12/10/2025",
    name: "Nossa Senhora Aparecida",
    type: "Feriado",
    recurring: true,
  },
  {
    id: "9",
    date: "02/11/2025",
    name: "Finados",
    type: "Feriado",
    recurring: true,
  },
  {
    id: "10",
    date: "15/11/2025",
    name: "Proclamação da República",
    type: "Feriado",
    recurring: true,
  },
  {
    id: "11",
    date: "25/12/2025",
    name: "Natal",
    type: "Feriado",
    recurring: true,
  },
  {
    id: "12",
    date: "24/12/2025",
    name: "Véspera de Natal",
    type: "Data especial",
    recurring: true,
  },
  {
    id: "13",
    date: "31/12/2025",
    name: "Véspera de Ano Novo",
    type: "Data especial",
    recurring: true,
  },
];

/**
 * In-memory holiday storage for mock operations
 * This simulates a database that persists during the session
 */
class HolidayStore {
  private holidays: Map<string, Holiday>;

  constructor(initialData: Holiday[]) {
    this.holidays = new Map(initialData.map((h) => [h.id, { ...h }]));
  }

  getAll(): Holiday[] {
    return Array.from(this.holidays.values());
  }

  getById(id: string): Holiday | undefined {
    return this.holidays.get(id);
  }

  add(holiday: Holiday): void {
    this.holidays.set(holiday.id, holiday);
  }

  update(id: string, updates: Partial<Holiday>): Holiday | undefined {
    const existing = this.holidays.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.holidays.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.holidays.delete(id);
  }
}

// Singleton store instance
export const holidayStore = new HolidayStore(HOLIDAYS_MOCK);
