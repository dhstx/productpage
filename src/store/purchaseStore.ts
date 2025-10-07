import { create } from 'zustand';
import type { Purchase } from '../types';

interface PurchaseStore {
  purchases: Purchase[];
  addPurchase: (purchase: Purchase) => void;
  getPurchases: () => Purchase[];
}

export const usePurchaseStore = create<PurchaseStore>((set, get) => ({
  purchases: [],
  
  addPurchase: (purchase) => {
    set((state) => ({
      purchases: [...state.purchases, purchase],
    }));
  },
  
  getPurchases: () => get().purchases,
}));
