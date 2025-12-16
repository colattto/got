/**
 * useParameters Hook
 * Manages parameters state for store configuration
 */

import { useState, useCallback } from "react";
import { App } from "antd";
import type { ParametersState } from "../types/gotime.types";
import { INITIAL_PARAMETERS_STATE } from "../constants/gotime.constants";

interface UseParametersOptions {
  storeId: string;
}

export const useParameters = ({ storeId }: UseParametersOptions) => {
  const { message } = App.useApp();

  const [params, setParams] = useState<ParametersState>(
    INITIAL_PARAMETERS_STATE
  );
  const [isSaving, setIsSaving] = useState(false);

  const updateParam = useCallback(
    <K extends keyof ParametersState>(key: K, value: ParametersState[K]) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleUpload = useCallback(() => {
    message.info("Funcionalidade de upload em desenvolvimento");
  }, [message]);

  const saveParameters = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      message.success("Parâmetros salvos com sucesso!");
    } catch (error) {
      message.error("Erro ao salvar parâmetros");
    } finally {
      setIsSaving(false);
    }
  }, [message]);

  const resetParameters = useCallback(() => {
    setParams(INITIAL_PARAMETERS_STATE);
    message.info("Parâmetros resetados para valores padrão");
  }, [message]);

  return {
    params,
    isSaving,
    updateParam,
    handleUpload,
    saveParameters,
    resetParameters,
  };
};
