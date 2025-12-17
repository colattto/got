/**
 * Store Service
 * Manages Store, Collaborator, and PDV data
 *
 * Refactored: Uses centralized API utilities and mock data stores
 */

import type { Store, Collaborator, Pdv } from "../types/gotime.types";
import { delay, generateId, NotFoundError } from "../lib";
import { storeList, collaboratorStore, pdvStore } from "../lib/mockData";

export const StoreService = {
  /**
   * Fetch all stores
   */
  getStores: async (): Promise<Store[]> => {
    await delay();
    return [...storeList];
  },

  /**
   * Fetch collaborators by store ID
   */
  getCollaborators: async (storeId: string): Promise<Collaborator[]> => {
    await delay();
    return collaboratorStore.getByStore(storeId);
  },

  /**
   * Update a collaborator
   */
  updateCollaborator: async (
    id: string,
    updates: Partial<Collaborator>
  ): Promise<Collaborator> => {
    await delay();

    const updated = collaboratorStore.update(id, updates);
    if (!updated) {
      throw new NotFoundError("Collaborator", id);
    }
    return updated;
  },

  /**
   * Fetch PDVs by store ID
   */
  getPdvs: async (storeId: string): Promise<Pdv[]> => {
    await delay();
    return pdvStore.getByStore(storeId);
  },

  /**
   * Add a new PDV
   */
  createPdv: async (storeId: string, data: Omit<Pdv, "id">): Promise<Pdv> => {
    await delay(400);

    const newPdv: Pdv = {
      ...data,
      id: generateId(),
    };
    pdvStore.add(storeId, newPdv);
    return newPdv;
  },

  /**
   * Update a PDV
   */
  updatePdv: async (
    storeId: string,
    id: string,
    updates: Partial<Pdv>
  ): Promise<Pdv> => {
    await delay();

    const updated = pdvStore.update(storeId, id, updates);
    if (!updated) {
      throw new NotFoundError("PDV", id);
    }
    return updated;
  },
};
