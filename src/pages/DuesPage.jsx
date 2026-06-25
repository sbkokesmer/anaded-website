import { Navigate } from "react-router-dom";
import { FaCreditCard } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/ui/PageHeader";
import DuesManager from "../components/admin/DuesManager";

export default function DuesPage() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-gray-300">
        <span className="w-8 h-8 border-4 border-gray-200 border-t-navy rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAdmin) return <Navigate to="/panel" replace />;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <PageHeader
        icon={FaCreditCard}
        title="Aidat Takibi"
        subtitle="Üyelerin aylık aidat ödeme durumu"
        backTo="/panel"
        backLabel="Panele Dön"
      />
      <div className="max-w-7xl mx-auto px-5 py-10">
        <DuesManager fullPage />
      </div>
    </div>
  );
}
