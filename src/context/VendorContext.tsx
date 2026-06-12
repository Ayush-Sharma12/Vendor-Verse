import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

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
  status: "new" | "active" | "featured";
  rating?: number;
  reviews?: number;
  profile_url?: string;
  initials?: string;
  color?: string;
  photo_url?: string;
  views?: number;
  last_viewed_timestamp?: string;
}

type NewVendor = Omit<Vendor, "id" | "submission_timestamp" | "status">;

interface VendorContextType {
  vendors: Vendor[];
  totalCount: number;
  newlyAddedId: string | null;
  addVendor: (vendor: NewVendor) => Promise<Vendor>;
  refreshVendors: () => Promise<void>;
}

const VendorContext = createContext<VendorContextType>({
  vendors: [],
  totalCount: 0,
  newlyAddedId: null,
  addVendor: async () => {
    throw new Error("VendorProvider not found");
  },
  refreshVendors: async () => {},
});

const POLLING_INTERVAL = 4000;

export function VendorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);

  const refreshVendors = useCallback(async () => {
    try {
      const response = await fetch("/api/vendors");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: Vendor[] = await response.json();
      setVendors(data);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    }
  }, []);

  const addVendor = useCallback(
    async (vendor: NewVendor): Promise<Vendor> => {
      try {
        const response = await fetch("/api/vendors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vendor),
        });

        if (!response.ok) {
          throw new Error("Failed to register vendor");
        }

        const newVendor: Vendor = await response.json();

        setVendors((prev) => {
          const exists = prev.some((v) => v.id === newVendor.id);
          return exists ? prev : [newVendor, ...prev];
        });

        setNewlyAddedId(newVendor.id);

        setTimeout(() => {
          setNewlyAddedId(null);
        }, 5000);

        return newVendor;
      } catch (error) {
        console.error("Failed to add vendor:", error);
        throw error;
      }
    },
    []
  );

  useEffect(() => {
    refreshVendors();

    const intervalId = setInterval(
      refreshVendors,
      POLLING_INTERVAL
    );

    return () => clearInterval(intervalId);
  }, [refreshVendors]);

  const value = useMemo(
    () => ({
      vendors,
      totalCount: vendors.length,
      addVendor,
      refreshVendors,
      newlyAddedId,
    }),
    [vendors, addVendor, refreshVendors, newlyAddedId]
  );

  return (
    <VendorContext.Provider value={value}>
      {children}
    </VendorContext.Provider>
  );
}

export function useVendors() {
  const context = useContext(VendorContext);

  if (!context) {
    throw new Error("useVendors must be used within VendorProvider");
  }

  return context;
}
