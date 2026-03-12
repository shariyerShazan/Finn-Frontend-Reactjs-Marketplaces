import { Navigate, useLocation } from "react-router-dom";
import { useGetMeQuery } from "@/redux/fetures/users.api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const location = useLocation();
  const { data: userData, isLoading, isError } = useGetMeQuery();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !ready) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#0064AE]" size={40} />
      </div>
    );
  }

  const user = userData?.data;

  if (isError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
