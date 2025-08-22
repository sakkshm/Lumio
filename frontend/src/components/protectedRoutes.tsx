import React from "react";
import { Navigate } from "react-router-dom";
import { useActiveAddress } from "@arweave-wallet-kit/react";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const address = useActiveAddress();

  if (!address) {
    return <Navigate to="/" replace />;
  }

  return children;
}
