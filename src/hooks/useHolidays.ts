/**
 * useHolidays Hook
 * Manages holidays CRUD operations and state
 *
 * Refactored: Uses useAsync pattern and functional state updates
 */

import { useState, useCallback } from "react";
import { App } from "antd";
import type { Holiday, CreateHolidayDTO, HolidayType } from "../types/gotime.types";
import { HolidaysService } from "../services/holidaysService";
import { useAsync } from "./useAsync";
import { getErrorMessage } from "../lib";

interface UseHolidaysOptions {
  storeId: string;
}

export const useHolidays = ({ storeId }: UseHolidaysOptions) => {
  const { message, modal } = App.useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load holidays using useAsync
  const {
    data: holidays,
    loading,
    setData: setHolidays,
  } = useAsync(
    () => HolidaysService.list(storeId),
    [storeId],
    {
      onError: (error) => {
        message.error(`Erro ao carregar feriados: ${getErrorMessage(error)}`);
      },
    }
  );

  const handleAddHoliday = useCallback(
    async (values: { date: string; name: string; type: HolidayType }) => {
      const dto: CreateHolidayDTO = {
        storeId,
        ...values,
      };

      try {
        const newHoliday = await HolidaysService.create(dto);
        // Functional update to avoid stale closure
        setHolidays((prev) => (prev ? [...prev, newHoliday] : [newHoliday]));
        setIsModalOpen(false);
        message.success("Feriado adicionado com sucesso!");
      } catch (error) {
        message.error(`Erro ao adicionar feriado: ${getErrorMessage(error)}`);
      }
    },
    [storeId, message, setHolidays]
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
          // Store previous state for potential rollback
          const previousHolidays = holidays;
          
          // Optimistic update with functional update
          setHolidays((prev) => prev?.filter((h) => h.id !== holiday.id) ?? null);

          try {
            await HolidaysService.delete(holiday.id);
            message.success("Feriado excluído com sucesso!");
          } catch (error) {
            // Rollback on error
            setHolidays(previousHolidays);
            message.error(`Erro ao excluir feriado: ${getErrorMessage(error)}`);
          }
        },
      });
    },
    [holidays, modal, message, setHolidays]
  );

  const handleRecurringChange = useCallback(
    async (holiday: Holiday, checked: boolean) => {
      // Store previous state for rollback
      const previousHolidays = holidays;
      
      // Optimistic update with functional update
      setHolidays((prev) =>
        prev?.map((h) =>
          h.id === holiday.id ? { ...h, recurring: checked } : h
        ) ?? null
      );

      try {
        await HolidaysService.update(holiday.id, { recurring: checked });
        message.success("Recorrência atualizada!");
      } catch (error) {
        // Rollback on error
        setHolidays(previousHolidays);
        message.error(`Erro ao atualizar recorrência: ${getErrorMessage(error)}`);
      }
    },
    [holidays, message, setHolidays]
  );

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return {
    holidays: holidays ?? [],
    loading,
    isModalOpen,
    handleAddHoliday,
    handleDeleteHoliday,
    handleRecurringChange,
    openModal,
    closeModal,
  };
};
