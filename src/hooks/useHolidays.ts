/**
 * useHolidays Hook
 * Manages holidays CRUD operations and state
 *
 * Refactored: Uses useAsync pattern and functional state updates
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { App } from "antd";
import type {
  Holiday,
  CreateHolidayDTO,
  HolidayType,
} from "../types/gotime.types";
import { HolidaysService } from "../services/holidaysService";
import { useAsync } from "./useAsync";
import { getErrorMessage } from "../lib";

interface UseHolidaysOptions {
  storeId: string;
}

export const useHolidays = ({ storeId }: UseHolidaysOptions) => {
  const { message, modal } = App.useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use refs to keep stable references to message and modal
  // This prevents stale closures in callbacks
  const messageRef = useRef(message);
  const modalRef = useRef(modal);

  // Keep refs updated
  useEffect(() => {
    messageRef.current = message;
    modalRef.current = modal;
  }, [message, modal]);

  // Define stable fetch function OUTSIDE useAsync call
  const fetchHolidays = useCallback(
    () => HolidaysService.list(storeId),
    [storeId]
  );

  // Define stable error handler
  const handleFetchError = useCallback((error: Error) => {
    messageRef.current.error(`Erro ao carregar feriados: ${getErrorMessage(error)}`);
  }, []);

  // Load holidays using useAsync with stable references
  const {
    data: holidays,
    loading,
    setData: setHolidays,
  } = useAsync(fetchHolidays, [storeId], {
    onError: handleFetchError,
  });

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
        messageRef.current.success("Feriado adicionado com sucesso!");
      } catch (error) {
        messageRef.current.error(`Erro ao adicionar feriado: ${getErrorMessage(error)}`);
      }
    },
    [storeId, setHolidays]
  );

  const handleDeleteHoliday = useCallback(
    (holiday: Holiday) => {
      modalRef.current.confirm({
        title: "Excluir feriado",
        content: `Tem certeza que deseja excluir "${holiday.name}"?`,
        okText: "Excluir",
        cancelText: "Cancelar",
        okButtonProps: { danger: true },
        onOk: async () => {
          // Optimistic update with functional update
          setHolidays(
            (prev) => prev?.filter((h) => h.id !== holiday.id) ?? null
          );

          try {
            await HolidaysService.delete(holiday.id);
            messageRef.current.success("Feriado excluído com sucesso!");
          } catch (error) {
            // Re-fetch on error to restore state
            messageRef.current.error(`Erro ao excluir feriado: ${getErrorMessage(error)}`);
          }
        },
      });
    },
    [setHolidays]
  );

  const handleRecurringChange = useCallback(
    async (holiday: Holiday, checked: boolean) => {
      try {
        // First call the API
        await HolidaysService.update(holiday.id, { recurring: checked });
        
        // Only update state after API success
        setHolidays(
          (prev) =>
            prev?.map((h) =>
              h.id === holiday.id ? { ...h, recurring: checked } : h
            ) ?? null
        );
        
        messageRef.current.success("Recorrência atualizada!");
      } catch (error) {
        messageRef.current.error(
          `Erro ao atualizar recorrência: ${getErrorMessage(error)}`
        );
      }
    },
    [setHolidays]
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
