/**
 * Store Mock Data
 * Centralized fixture data for stores, collaborators, and PDVs
 */

import type { Store, Collaborator, Pdv } from "../../types/gotime.types";

// ============ Stores ============

export const STORES_MOCK: Store[] = [
  { id: "estrela", name: "Supermercado Estrela" },
  { id: "verdejante", name: "Supermercado Verdejante" },
  { id: "sol-nascente", name: "Hipermercado Sol Nascente" },
  { id: "povo", name: "Mercado do Povo" },
];

// ============ Collaborators ============

export const COLLABORATORS_MOCK: Record<string, Collaborator[]> = {
  estrela: [
    {
      id: "lia-andrade",
      name: "Lia Andrade",
      operatorCode: 42,
      contractCode: "04h00",
      role: "Atendente de Balcão",
      lastWeekOff: "01/11/2025",
      lastSundayOff: "01/12/2025",
      scaleActive: true,
    },
    {
      id: "rafael-costa",
      name: "Rafael Costa",
      operatorCode: 78,
      contractCode: "04h00",
      role: "Operador de Caixa Rápido",
      lastWeekOff: "15/11/2025",
      lastSundayOff: "01/12/2025",
      scaleActive: true,
    },
    {
      id: "sofia-almeida",
      name: "Sofia Almeida",
      operatorCode: 34,
      contractCode: "07h40",
      role: "Operador de Frente de Caixa",
      lastWeekOff: "20/11/2025",
      lastSundayOff: "01/12/2025",
      scaleActive: true,
    },
    {
      id: "lucas-ferreira",
      name: "Lucas Ferreira",
      operatorCode: 61,
      contractCode: "07h40",
      role: "Operador de Caixa Rápido",
      lastWeekOff: "25/11/2025",
      lastSundayOff: "01/12/2025",
      scaleActive: true,
    },
    {
      id: "ana-clara",
      name: "Ana Clara",
      operatorCode: 27,
      contractCode: "07h40",
      role: "Operador de Frente de Caixa",
      lastWeekOff: "30/11/2025",
      lastSundayOff: "01/12/2025",
      scaleActive: false,
    },
  ],
  verdejante: [
    {
      id: "joao-martins",
      name: "João Martins",
      operatorCode: 11,
      contractCode: "06h00",
      role: "Repositor de Hortifruti",
      lastWeekOff: "03/11/2025",
      lastSundayOff: "10/11/2025",
      scaleActive: true,
    },
    {
      id: "camilia-souza",
      name: "Camila Souza",
      operatorCode: 19,
      contractCode: "06h00",
      role: "Operador de Frente de Caixa",
      lastWeekOff: "08/11/2025",
      lastSundayOff: "24/11/2025",
      scaleActive: true,
    },
  ],
  "sol-nascente": [
    {
      id: "bruno-oliveira",
      name: "Bruno Oliveira",
      operatorCode: 90,
      contractCode: "08h00",
      role: "Líder de Frente de Caixa",
      lastWeekOff: "12/11/2025",
      lastSundayOff: "17/11/2025",
      scaleActive: true,
    },
  ],
  povo: [
    {
      id: "mariana-lopes",
      name: "Mariana Lopes",
      operatorCode: 55,
      contractCode: "04h00",
      role: "Atendente de Balcão",
      lastWeekOff: "05/11/2025",
      lastSundayOff: "23/11/2025",
      scaleActive: false,
    },
  ],
};

// ============ PDVs ============

export const PDVS_MOCK: Record<string, Pdv[]> = {
  estrela: [
    {
      id: "pdv-2-1743",
      position: 2,
      internalCode: 1743,
      type: "Normal",
      openOrder: "2º",
      orientation: "Direita",
      scaleActive: true,
    },
    {
      id: "pdv-3-5829",
      position: 3,
      internalCode: 5829,
      type: "Normal",
      openOrder: "3º",
      orientation: "Direita",
      scaleActive: true,
    },
    {
      id: "pdv-5-9031",
      position: 5,
      internalCode: 9031,
      type: "Rápido",
      openOrder: "5º",
      orientation: "Direita",
      scaleActive: true,
    },
    {
      id: "pdv-4-2468",
      position: 4,
      internalCode: 2468,
      type: "Rápido",
      openOrder: "4º",
      orientation: "Esquerda",
      scaleActive: true,
    },
    {
      id: "pdv-1-7310",
      position: 1,
      internalCode: 7310,
      type: "Preferencial",
      openOrder: "1º",
      orientation: "Esquerda",
      scaleActive: true,
    },
  ],
  verdejante: [
    {
      id: "pdv-v-1",
      position: 1,
      internalCode: 2101,
      type: "Normal",
      openOrder: "1º",
      orientation: "Direita",
      scaleActive: true,
    },
  ],
  "sol-nascente": [
    {
      id: "pdv-s-1",
      position: 1,
      internalCode: 3301,
      type: "Rápido",
      openOrder: "1º",
      orientation: "Direita",
      scaleActive: true,
    },
  ],
  povo: [
    {
      id: "pdv-p-1",
      position: 1,
      internalCode: 4401,
      type: "Normal",
      openOrder: "1º",
      orientation: "Esquerda",
      scaleActive: false,
    },
  ],
};

// ============ In-Memory Stores ============

/**
 * Collaborator store for session persistence
 */
class CollaboratorStore {
  private data: Map<string, Map<string, Collaborator>>;

  constructor(initialData: Record<string, Collaborator[]>) {
    this.data = new Map();
    Object.entries(initialData).forEach(([storeId, collaborators]) => {
      this.data.set(storeId, new Map(collaborators.map((c) => [c.id, { ...c }])));
    });
  }

  getByStore(storeId: string): Collaborator[] {
    const storeData = this.data.get(storeId);
    return storeData ? Array.from(storeData.values()) : [];
  }

  getById(id: string): Collaborator | undefined {
    for (const storeData of this.data.values()) {
      const collaborator = storeData.get(id);
      if (collaborator) return collaborator;
    }
    return undefined;
  }

  update(id: string, updates: Partial<Collaborator>): Collaborator | undefined {
    for (const storeData of this.data.values()) {
      const existing = storeData.get(id);
      if (existing) {
        const updated = { ...existing, ...updates };
        storeData.set(id, updated);
        return updated;
      }
    }
    return undefined;
  }
}

/**
 * PDV store for session persistence
 */
class PdvStore {
  private data: Map<string, Map<string, Pdv>>;

  constructor(initialData: Record<string, Pdv[]>) {
    this.data = new Map();
    Object.entries(initialData).forEach(([storeId, pdvs]) => {
      this.data.set(storeId, new Map(pdvs.map((p) => [p.id, { ...p }])));
    });
  }

  getByStore(storeId: string): Pdv[] {
    const storeData = this.data.get(storeId);
    return storeData ? Array.from(storeData.values()) : [];
  }

  getById(storeId: string, id: string): Pdv | undefined {
    return this.data.get(storeId)?.get(id);
  }

  add(storeId: string, pdv: Pdv): void {
    if (!this.data.has(storeId)) {
      this.data.set(storeId, new Map());
    }
    this.data.get(storeId)!.set(pdv.id, pdv);
  }

  update(storeId: string, id: string, updates: Partial<Pdv>): Pdv | undefined {
    const existing = this.data.get(storeId)?.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.data.get(storeId)!.set(id, updated);
    return updated;
  }
}

// Singleton store instances
export const storeList = [...STORES_MOCK];
export const collaboratorStore = new CollaboratorStore(COLLABORATORS_MOCK);
export const pdvStore = new PdvStore(PDVS_MOCK);
