/**
 * useGotimeSettings Hook
 * Main orchestrator hook for Gotime Settings page state management
 *
 * Refactored: Fixed stale closures with functional updates
 */

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { App } from "antd";
import type { TabType, Store, Collaborator, Pdv } from "../types/gotime.types";
import { StoreService } from "../services/storeService";
import { useAsync } from "./useAsync";
import { getErrorMessage } from "../lib";

export const useGotimeSettings = () => {
  const { message } = App.useApp();

  // Use ref to keep stable reference to message
  // This prevents stale closures in callbacks
  const messageRef = useRef(message);

  // Keep ref updated on every render
  messageRef.current = message;

  // UI State
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("collaborators");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [storeSearchTerm, setStoreSearchTerm] = useState("");

  // Data State
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [pdvs, setPdvs] = useState<Pdv[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Load stores using useAsync
  const { data: stores, loading: storesLoading } = useAsync(
    () => StoreService.getStores(),
    [],
    {
      onSuccess: () => {},
      onError: (error) => {
        messageRef.current.error(`Erro ao carregar lojas: ${getErrorMessage(error)}`);
      },
    }
  );

  // Set initial store when stores load
  useEffect(() => {
    if (stores && stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0].id);
    }
  }, [stores, selectedStoreId]);

  // Load store data when selectedStoreId changes
  useEffect(() => {
    if (!selectedStoreId) return;

    const loadStoreData = async () => {
      setDataLoading(true);
      try {
        const [collabs, pdvList] = await Promise.all([
          StoreService.getCollaborators(selectedStoreId),
          StoreService.getPdvs(selectedStoreId),
        ]);
        setCollaborators(collabs);
        setPdvs(pdvList);
      } catch (error) {
        messageRef.current.error(`Erro ao carregar dados da loja: ${getErrorMessage(error)}`);
      } finally {
        setDataLoading(false);
      }
    };

    loadStoreData();
  }, [selectedStoreId]);

  // Derived state
  const filteredStores = useMemo(() => {
    if (!stores || !storeSearchTerm) return stores ?? [];
    return stores.filter((store) =>
      store.name.toLowerCase().includes(storeSearchTerm.toLowerCase())
    );
  }, [stores, storeSearchTerm]);

  const selectedStore = useMemo(
    () => stores?.find((s) => s.id === selectedStoreId),
    [stores, selectedStoreId]
  );

  // Handlers
  const handleStoreSelect = useCallback((storeId: string) => {
    setSelectedStoreId(storeId);
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  // Fixed: Using functional update to avoid stale closure
  const handleUpdateCollaborator = useCallback(
    async (id: string, updates: Partial<Collaborator>) => {
      // Store previous state for rollback
      let previousCollaborators: Collaborator[] = [];

      // Optimistic update with functional state
      setCollaborators((prev) => {
        previousCollaborators = prev;
        return prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      });

      try {
        await StoreService.updateCollaborator(id, updates);
      } catch (error) {
        // Rollback on error
        setCollaborators(previousCollaborators);
        messageRef.current.error(`Erro ao atualizar colaborador: ${getErrorMessage(error)}`);
      }
    },
    []
  );

  // Fixed: Using functional update to avoid stale closure
  const handleUpdatePdv = useCallback(
    async (id: string, updates: Partial<Pdv>) => {
      let previousPdvs: Pdv[] = [];

      // Optimistic update with functional state
      setPdvs((prev) => {
        previousPdvs = prev;
        return prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      });

      try {
        await StoreService.updatePdv(selectedStoreId, id, updates);
      } catch (error) {
        // Rollback on error
        setPdvs(previousPdvs);
        messageRef.current.error(`Erro ao atualizar PDV: ${getErrorMessage(error)}`);
      }
    },
    [selectedStoreId]
  );

  const handleAddPdv = useCallback(
    async (newPdv: Omit<Pdv, "id">) => {
      try {
        const addedPdv = await StoreService.createPdv(selectedStoreId, newPdv);
        // Functional update
        setPdvs((prev) => [...prev, addedPdv]);
        messageRef.current.success("PDV adicionado com sucesso!");
      } catch (error) {
        messageRef.current.error(`Erro ao adicionar PDV: ${getErrorMessage(error)}`);
      }
    },
    [selectedStoreId]
  );

  // Keep selectedStoreId ref updated for stable closures
  const selectedStoreIdRef = useRef(selectedStoreId);
  useEffect(() => {
    selectedStoreIdRef.current = selectedStoreId;
  }, [selectedStoreId]);

  const handleDeletePdv = useCallback(
    async (id: string) => {
      const storeId = selectedStoreIdRef.current;

      // Optimistic update - just remove from UI
      setPdvs((prev) => prev.filter((p) => p.id !== id));

      try {
        await StoreService.deletePdv(storeId, id);
        messageRef.current?.success("PDV excluído com sucesso!");
      } catch (error) {
        // If NotFoundError, the item was already deleted, so we consider it a success
        const isNotFound = error instanceof Error && error.message.includes('not found');
        if (isNotFound) {
          messageRef.current?.success("PDV excluído com sucesso!");
        } else {
          // For other errors, we should refetch data to restore consistency
          messageRef.current?.error(`Erro ao excluir PDV: ${getErrorMessage(error)}`);
        }
      }
    },
    []
  );

  return {
    // State
    selectedStoreId,
    activeTab,
    sidebarCollapsed,
    searchTerm,
    storeSearchTerm,
    loading: storesLoading || dataLoading,

    // Derived
    stores: stores ?? [],
    filteredStores,
    selectedStore,
    collaborators,
    pdvs,

    // Setters
    setSearchTerm,
    setStoreSearchTerm,

    // Handlers
    handleStoreSelect,
    handleTabChange,
    toggleSidebar,
    setSidebarCollapsed,
    handleUpdateCollaborator,
    handleUpdatePdv,
    handleAddPdv,
    handleDeletePdv,
  };
};
