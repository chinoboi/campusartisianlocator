import { useEffect, useState } from "react";
import { mockDb } from "@/lib/mockDb";

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const u = mockDb.getCurrentUser();
      setUser(u);
      setIsAdmin(mockDb.isAdmin());
      setLoading(false);
    };

    checkAuth();

    // Listen to changes in localStorage for auth state (tab synchronization)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "mock_auth_user") {
        checkAuth();
      }
    };
    window.addEventListener("storage", handleStorage);

    // Periodically poll auth state in case local updates happen within the same window
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  return { user, isAdmin, loading };
}
