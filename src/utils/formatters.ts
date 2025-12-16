/**
 * Gotime Utility Functions
 * Reusable formatters and helper functions
 */

import { WEEKDAY_NAMES } from "../constants/gotime.constants";

/**
 * Format number as Brazilian currency (R$)
 */
export const formatCurrency = (value: number): string => {
  return value
    .toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })
    .replace("R$", "R$ ");
};

/**
 * Parse Brazilian currency string to number
 */
export const parseCurrency = (value: string | undefined): number => {
  if (!value) return 0;
  return Number(value.replace(/R\$\s?|(\.)/g, "").replace(",", ".")) || 0;
};

/**
 * Format number as currency input display
 */
export const formatCurrencyInput = (value: number | undefined): string => {
  if (value === undefined) return "";
  return `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Get weekday name from date string (DD/MM/YYYY format)
 */
export const getWeekdayName = (dateString: string): string => {
  const [day, month, year] = dateString.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return WEEKDAY_NAMES[date.getDay()];
};

/**
 * Format date to DD/MM/YYYY
 */
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format time to HH:mm
 */
export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
