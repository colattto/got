/**
 * Holidays Service
 * Manages holiday CRUD operations
 *
 * Refactored: Uses centralized API utilities and mock data store
 */

import type { Holiday, CreateHolidayDTO, UpdateHolidayDTO } from "../types/gotime.types";
import { delay, generateId, NotFoundError } from "../lib";
import { holidayStore } from "../lib/mockData";

export const HolidaysService = {
  /**
   * Fetch all holidays for a specific store
   * @param storeId - Store identifier (currently unused in mock, ready for real API)
   */
  list: async (_storeId: string): Promise<Holiday[]> => {
    await delay();
    return holidayStore.getAll();
  },

  /**
   * Get a single holiday by ID
   */
  getById: async (id: string): Promise<Holiday> => {
    await delay();
    const holiday = holidayStore.getById(id);
    if (!holiday) {
      throw new NotFoundError("Holiday", id);
    }
    return holiday;
  },

  /**
   * Create a new holiday entry
   */
  create: async (data: CreateHolidayDTO): Promise<Holiday> => {
    await delay(400);

    const newHoliday: Holiday = {
      id: generateId(),
      date: data.date,
      name: data.name,
      type: data.type,
      recurring: false,
    };

    holidayStore.add(newHoliday);
    return newHoliday;
  },

  /**
   * Update an existing holiday
   * No delay for instant UI feedback
   */
  update: async (id: string, data: UpdateHolidayDTO): Promise<Holiday> => {
    const updated = holidayStore.update(id, data);
    if (!updated) {
      throw new NotFoundError("Holiday", id);
    }
    return updated;
  },

  /**
   * Delete a holiday
   */
  delete: async (id: string): Promise<void> => {
    await delay();

    const deleted = holidayStore.delete(id);
    if (!deleted) {
      throw new NotFoundError("Holiday", id);
    }
  },
};
