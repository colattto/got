/**
 * useGotimeSettings Hook
 * Main orchestrator hook for Gotime Settings page state management
 */

import { useState, useMemo, useCallback } from "react";
import type { TabType, Store, Collaborator, Pdv } from "../types/gotime.types";
import {
  STORES_MOCK,
  COLLABORATORS_BY_STORE,
  PDVS_BY_STORE,
} from "../constants/gotime.constants";

export const useGotimeSettings = () => {
  // State
  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    STORES_MOCK[0]?.id || ""
  );
  const [activeTab, setActiveTab] = useState<TabType>("collaborators");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [storeSearchTerm, setStoreSearchTerm] = useState("");

  // Derived state
  const stores = STORES_MOCK;

  const filteredStores = useMemo(() => {
    if (!storeSearchTerm) return stores;
    return stores.filter((store) =>
      store.name.toLowerCase().includes(storeSearchTerm.toLowerCase())
    );
  }, [stores, storeSearchTerm]);

  const selectedStore = useMemo(
    () => stores.find((s) => s.id === selectedStoreId),
    [stores, selectedStoreId]
  );

  // State for data (initialized from mocks for now, but mutable)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [pdvs, setPdvs] = useState<Pdv[]>([]);

  // Effect to load data when store changes (simulating fetch)
  // In a real app, this would be a useEffect calling an API
  // Here we just reset to the mock data for that store
  useMemo(() => {
    setCollaborators(COLLABORATORS_BY_STORE[selectedStoreId] || []);
    setPdvs(PDVS_BY_STORE[selectedStoreId] || []);
  }, [selectedStoreId]);

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

  const handleUpdateCollaborator = useCallback((id: string, updates: Partial<Collaborator>) => {
    setCollaborators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const handleUpdatePdv = useCallback((id: string, updates: Partial<Pdv>) => {
    setPdvs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const handleAddPdv = useCallback((newPdv: Omit<Pdv, "id">) => {
    // Generate a temporary ID (in real app backend handles this)
    const id = Math.random().toString(36).substr(2, 9);
    setPdvs((prev) => [...prev, { ...newPdv, id }]);
  }, []);

  return {
    // State
    selectedStoreId,
    activeTab,
    sidebarCollapsed,
    searchTerm,
    storeSearchTerm,
    
    // Derived
    stores,
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
  };
};
