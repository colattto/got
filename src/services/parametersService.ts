/**
 * Parameters Service
 * Manages store parameters configuration
 */

import type { ParametersState } from "../types/gotime.types";
import { delay } from "../lib";
import { INITIAL_PARAMETERS_STATE } from "../constants/gotime.constants";

// In-memory parameter storage by store
const parametersStore = new Map<string, ParametersState>();

export const ParametersService = {
  /**
   * Get parameters for a store
   */
  get: async (storeId: string): Promise<ParametersState> => {
    await delay();

    // Return stored parameters or default
    const stored = parametersStore.get(storeId);
    if (stored) return { ...stored };
    return { ...INITIAL_PARAMETERS_STATE };
  },

  /**
   * Update parameters for a store
   */
  update: async (
    storeId: string,
    params: ParametersState
  ): Promise<ParametersState> => {
    await delay(500);

    parametersStore.set(storeId, { ...params });
    return { ...params };
  },

  /**
   * Reset parameters to defaults
   */
  reset: async (storeId: string): Promise<ParametersState> => {
    await delay();

    parametersStore.set(storeId, { ...INITIAL_PARAMETERS_STATE });
    return { ...INITIAL_PARAMETERS_STATE };
  },
};
