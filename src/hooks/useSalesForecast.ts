/**
 * useSalesForecast Hook
 * Manages sales forecast data and month navigation
 */

import { useState, useMemo, useCallback } from "react";
import { App } from "antd";
import type { SalesForecast } from "../types/gotime.types";
import { WEEKDAY_NAMES } from "../constants/gotime.constants";

// Generate mock data for a given month
const generateMockData = (year: number, month: number): SalesForecast[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const baseValues = [
    150000, 250000, 350000, 300000, 200000, 400000, 350000, 300000, 250000,
    150000, 200000, 300000, 350000, 400000, 250000, 180000, 220000, 280000,
    320000, 380000, 420000, 360000, 290000, 240000, 190000, 270000, 310000,
    370000, 410000, 330000, 260000,
  ];

  const data: SalesForecast[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = WEEKDAY_NAMES[date.getDay()];
    const formattedDate = `${String(day).padStart(2, "0")}/${String(
      month + 1
    ).padStart(2, "0")}/${year}`;

    data.push({
      id: String(day),
      date: formattedDate,
      dayOfWeek,
      value: baseValues[(day - 1) % baseValues.length],
    });
  }

  return data;
};

interface UseSalesForecastOptions {
  storeId: string;
}

export const useSalesForecast = ({ storeId }: UseSalesForecastOptions) => {
  const { message } = App.useApp();

  const [currentMonth, setCurrentMonth] = useState(11);
  const [currentYear, setCurrentYear] = useState(2025);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [forecasts, setForecasts] = useState<SalesForecast[]>(() =>
    generateMockData(2025, 11)
  );

  const totalValue = useMemo(
    () => forecasts.reduce((sum, f) => sum + f.value, 0),
    [forecasts]
  );

  const handlePreviousMonth = useCallback(() => {
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (currentMonth === 0) {
      newMonth = 11;
      newYear = currentYear - 1;
    } else {
      newMonth = currentMonth - 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setForecasts(generateMockData(newYear, newMonth));
  }, [currentMonth, currentYear]);

  const handleNextMonth = useCallback(() => {
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (currentMonth === 11) {
      newMonth = 0;
      newYear = currentYear + 1;
    } else {
      newMonth = currentMonth + 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setForecasts(generateMockData(newYear, newMonth));
  }, [currentMonth, currentYear]);

  const handleValueChange = useCallback(
    async (id: string, newValue: number | null) => {
      if (newValue === null) return;

      try {
        await new Promise((resolve) => setTimeout(resolve, 300));

        setForecasts((prev) =>
          prev.map((f) => (f.id === id ? { ...f, value: newValue } : f))
        );

        message.success("Valor atualizado com sucesso!");
      } catch (error) {
        message.error("Erro ao atualizar valor");
      }
    },
    [message]
  );

  return {
    currentMonth,
    currentYear,
    viewMode,
    forecasts,
    totalValue,
    setViewMode,
    handlePreviousMonth,
    handleNextMonth,
    handleValueChange,
  };
};
