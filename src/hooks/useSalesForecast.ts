/**
 * useSalesForecast Hook
 * Manages sales forecast data and month navigation
 *
 * Refactored: Uses SalesForecastService and cleaner state management
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { App } from "antd";
import type { SalesForecast } from "../types/gotime.types";
import { SalesForecastService } from "../services/salesForecastService";
import { getErrorMessage } from "../lib";

interface UseSalesForecastOptions {
  storeId: string;
}

export const useSalesForecast = ({ storeId }: UseSalesForecastOptions) => {
  const { message } = App.useApp();

  // Date state
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());

  // View state
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Data state
  const [forecasts, setForecasts] = useState<SalesForecast[]>([]);
  const [loading, setLoading] = useState(true);

  // Load forecasts when month/year/store changes
  useEffect(() => {
    const loadForecasts = async () => {
      setLoading(true);
      try {
        const data = await SalesForecastService.list(storeId, currentYear, currentMonth);
        setForecasts(data);
      } catch (error) {
        message.error(`Erro ao carregar previsões: ${getErrorMessage(error)}`);
      } finally {
        setLoading(false);
      }
    };

    loadForecasts();
  }, [storeId, currentYear, currentMonth, message]);

  // Computed total
  const totalValue = useMemo(
    () => forecasts.reduce((sum, f) => sum + f.value, 0),
    [forecasts]
  );

  // Navigation handlers
  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear((prevYear) => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYear((prevYear) => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  }, []);

  // Update single forecast value
  const handleValueChange = useCallback(
    async (id: string, newValue: number | null) => {
      if (newValue === null) return;

      // Store previous state for rollback
      const previousForecasts = forecasts;

      // Optimistic update
      setForecasts((prev) =>
        prev.map((f) => (f.id === id ? { ...f, value: newValue } : f))
      );

      try {
        await SalesForecastService.update(
          storeId,
          currentYear,
          currentMonth,
          id,
          newValue
        );
        message.success("Valor atualizado com sucesso!");
      } catch (error) {
        // Rollback on error
        setForecasts(previousForecasts);
        message.error(`Erro ao atualizar valor: ${getErrorMessage(error)}`);
      }
    },
    [storeId, currentYear, currentMonth, forecasts, message]
  );

  return {
    currentMonth,
    currentYear,
    viewMode,
    forecasts,
    totalValue,
    loading,
    setViewMode,
    handlePreviousMonth,
    handleNextMonth,
    handleValueChange,
  };
};
