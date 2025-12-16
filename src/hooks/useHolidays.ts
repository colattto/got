/**
 * useHolidays Hook
 * Manages holidays CRUD operations and state
 */

import { useState, useCallback } from "react";
import { App } from "antd";
import type { Holiday, HolidayType } from "../types/gotime.types";
import { generateId } from "../utils/formatters";

// Mock initial data generator
const generateMockHolidays = (): Holiday[] => [
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

interface UseHolidaysOptions {
  storeId: string;
}

export const useHolidays = ({ storeId }: UseHolidaysOptions) => {
  const { message, modal } = App.useApp();
  
  const [holidays, setHolidays] = useState<Holiday[]>(() =>
    generateMockHolidays()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddHoliday = useCallback(
    async (values: { date: string; name: string; type: HolidayType }) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 300));

        const newHoliday: Holiday = {
          id: generateId(),
          date: values.date,
          name: values.name,
          type: values.type,
          recurring: false,
        };

        setHolidays((prev) => [...prev, newHoliday]);
        setIsModalOpen(false);
        message.success("Feriado adicionado com sucesso!");
      } catch (error) {
        message.error("Erro ao adicionar feriado");
      }
    },
    [message]
  );

  const handleDeleteHoliday = useCallback(
    (holiday: Holiday) => {
      modal.confirm({
        title: "Excluir feriado",
        content: `Tem certeza que deseja excluir "${holiday.name}"?`,
        okText: "Excluir",
        cancelText: "Cancelar",
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setHolidays((prev) => prev.filter((h) => h.id !== holiday.id));
            message.success("Feriado excluído com sucesso!");
          } catch (error) {
            message.error("Erro ao excluir feriado");
          }
        },
      });
    },
    [modal, message]
  );

  const handleRecurringChange = useCallback(
    async (holiday: Holiday, checked: boolean) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setHolidays((prev) =>
          prev.map((h) =>
            h.id === holiday.id ? { ...h, recurring: checked } : h
          )
        );
        message.success("Recorrência atualizada!");
      } catch (error) {
        message.error("Erro ao atualizar recorrência");
      }
    },
    [message]
  );

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return {
    holidays,
    isModalOpen,
    handleAddHoliday,
    handleDeleteHoliday,
    handleRecurringChange,
    openModal,
    closeModal,
  };
};
