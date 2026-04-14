import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Vendor {
  id: string;
  vendor_name: string;
  what_they_sell: string;
  location: string;
  hours: string;
  category: string;
  upi_id?: string;
  whatsapp_number?: string;
  registered_by: string;
  submission_timestamp: string;
  status: 'new' | 'active' | 'featured';
  rating?: number;
  reviews?: number;
  profile_url?: string;
  initials?: string;
  color?: string;
  photo_url?: string;
  views?: number;
  last_viewed_timestamp?: string;
}

interface VendorContextType {
  vendors: Vendor[];
  totalCount: number;
  addVendor: (v: Omit<Vendor, 'id' | 'submission_timestamp' | 'status'>) => Promise<Vendor>;
  refreshVendors: () => Promise<void>;
  newlyAddedId: string | null;
}

const VendorContext = createContext<VendorContextType>({
  vendors: [],
  totalCount: 0,
  addVendor: async () => ({} as Vendor),
  refreshVendors: async () => {},
  newlyAddedId: null,
});

export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);

  const refreshVendors = useCallback(async () => {
    try {
      const res = await fetch('/api/vendors');
      if (res.ok) {
        const data = await res.json();
        setVendors(data);
      }
    } catch (e) {
      console.error('Failed to fetch vendors', e);
    }
  }, []);

  useEffect(() => {
    refreshVendors();
    // Poll every 4 seconds for real-time updates
    const interval = setInterval(refreshVendors, 4000);
    return () => clearInterval(interval);
  }, [refreshVendors]);

  const addVendor = async (v: Omit<Vendor, 'id' | 'submission_timestamp' | 'status'>) => {
    const res = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v),
    });
    if (!res.ok) throw new Error('Failed to register vendor');
    const newVendor: Vendor = await res.json();
    setVendors(prev => [newVendor, ...prev]);
    setNewlyAddedId(newVendor.id);
    setTimeout(() => setNewlyAddedId(null), 5000);
    return newVendor;
  };

  return (
    <VendorContext.Provider value={{ vendors, totalCount: vendors.length, addVendor, refreshVendors, newlyAddedId }}>
      {children}
    </VendorContext.Provider>
  );
}

export const useVendors = () => useContext(VendorContext);
