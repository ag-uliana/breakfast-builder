import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type OrderState = { categoryId: string | null; addonIds: string[] };

type Ctx = {
  order: OrderState;
  setCategory: (id: string) => void;
  toggleAddon: (id: string) => void;
  clear: () => void;
};

const OrderContext = createContext<Ctx | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<OrderState>({ categoryId: null, addonIds: [] });

  const setCategory = (id: string) =>
    setOrder(() => ({ categoryId: id, addonIds: [] }));

  const toggleAddon = (id: string) =>
    setOrder(s => ({
      ...s,
      addonIds: s.addonIds.includes(id) ? s.addonIds.filter(x => x !== id) : [...s.addonIds, id],
    }));

  const clear = () => setOrder({ categoryId: null, addonIds: [] });

  return (
    <OrderContext.Provider value={{ order, setCategory, toggleAddon, clear }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
};
