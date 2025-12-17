/**
 * useParameters Hook
 * Manages parameters state for store configuration
 *
 * Refactored: Uses ParametersService and useAsync pattern
 */

import { useCallback, useEffect } from "react";
import { App } from "antd";
import type { ParametersState } from "../types/gotime.types";
import { ParametersService } from "../services/parametersService";
import { useAsync, useMutation } from "./useAsync";
import { getErrorMessage } from "../lib";

interface UseParametersOptions {
  storeId: string;
}

export const useParameters = ({ storeId }: UseParametersOptions) => {
  const { message } = App.useApp();

  // Load parameters using useAsync
  const {
    data: params,
    loading,
    setData: setParams,
    execute: reload,
  } = useAsync(
    () => ParametersService.get(storeId),
    [storeId],
    {
      onError: (error) => {
        message.error(`Erro ao carregar parâmetros: ${getErrorMessage(error)}`);
      },
    }
  );

  // Save mutation
  const { mutate: saveParams, loading: isSaving } = useMutation(
    (newParams: ParametersState) => ParametersService.update(storeId, newParams),
    {
      onSuccess: () => {
        message.success("Parâmetros salvos com sucesso!");
      },
      onError: (error) => {
        message.error(`Erro ao salvar parâmetros: ${getErrorMessage(error)}`);
      },
    }
  );

  // Update a single parameter
  const updateParam = useCallback(
    <K extends keyof ParametersState>(key: K, value: ParametersState[K]) => {
      setParams((prev) => {
        if (!prev) return prev;
        return { ...prev, [key]: value };
      });
    },
    [setParams]
  );

  // Save all parameters
  const saveParameters = useCallback(async () => {
    if (!params) return;
    await saveParams(params);
  }, [params, saveParams]);

  // Reset parameters to defaults
  const resetParameters = useCallback(async () => {
    try {
      const defaultParams = await ParametersService.reset(storeId);
      setParams(defaultParams);
      message.info("Parâmetros resetados para valores padrão");
    } catch (error) {
      message.error(`Erro ao resetar parâmetros: ${getErrorMessage(error)}`);
    }
  }, [storeId, message, setParams]);

  // Placeholder for upload functionality
  const handleUpload = useCallback(() => {
    message.info("Funcionalidade de upload em desenvolvimento");
  }, [message]);

  return {
    params,
    loading,
    isSaving,
    updateParam,
    handleUpload,
    saveParameters,
    resetParameters,
    reload,
  };
};
