/**
 * Sales Forecast Service
 * Manages sales forecast data
 */

import type { SalesForecast } from "../types/gotime.types";
import { delay } from "../lib";
import { WEEKDAY_NAMES } from "../constants/gotime.constants";

// In-memory forecast storage
const forecastStore = new Map<string, SalesForecast[]>();

/**
 * Generate mock forecast data for a given month
 */
const generateMonthData = (year: number, month: number): SalesForecast[] => {
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
      id: `${year}-${month}-${day}`,
      date: formattedDate,
      dayOfWeek,
      value: baseValues[(day - 1) % baseValues.length],
    });
  }

  return data;
};

/**
 * Get cache key for store/year/month combination
 */
const getCacheKey = (storeId: string, year: number, month: number): string =>
  `${storeId}-${year}-${month}`;

export const SalesForecastService = {
  /**
   * Get forecasts for a specific month
   */
  list: async (
    storeId: string,
    year: number,
    month: number
  ): Promise<SalesForecast[]> => {
    await delay();

    const cacheKey = getCacheKey(storeId, year, month);
    let data = forecastStore.get(cacheKey);

    if (!data) {
      data = generateMonthData(year, month);
      forecastStore.set(cacheKey, data);
    }

    return [...data];
  },

  /**
   * Update a single forecast value
   */
  update: async (
    storeId: string,
    year: number,
    month: number,
    id: string,
    value: number
  ): Promise<SalesForecast> => {
    await delay();

    const cacheKey = getCacheKey(storeId, year, month);
    let data = forecastStore.get(cacheKey);

    if (!data) {
      data = generateMonthData(year, month);
      forecastStore.set(cacheKey, data);
    }

    const index = data.findIndex((f) => f.id === id);
    if (index === -1) {
      throw new Error(`Forecast with id "${id}" not found`);
    }

    data[index] = { ...data[index], value };
    return { ...data[index] };
  },
};
