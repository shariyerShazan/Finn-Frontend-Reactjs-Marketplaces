import { useEffect } from "react";
import { socketService } from "@/lib/socketService";

/**
 * Hook to initialize socket connection on app mount
 * Should be called from the root component (App.tsx)
 */
export const useSocketInitialize = () => {
  useEffect(() => {
    // Connect to socket when component mounts
    const socket = socketService.connect();

    return () => {
      console.log(socket)
      // Optionally disconnect on unmount
      // socketService.disconnect();
    };
  }, []);
};
