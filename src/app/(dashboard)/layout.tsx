"use client";

import {ReactNode} from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

// definisikan tipe props
interface DashboardLayoutProps {
  children: ReactNode;
}

// layout khusus dashboard yang dibungkus dengan proteksi login
export default function DashboardLayout({children}: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}
