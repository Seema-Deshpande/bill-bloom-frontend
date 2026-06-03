import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/layout/Header";
import NavLinks from "./components/layout/NavLinks";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import GroupsPage from "./pages/GroupsPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import PersonalExpensesPage from "./pages/PersonalExpensesPage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

export default function App() {
  // Read authentication state from Redux
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;

  return (
    <>
      <Header />
      {isAuthenticated && <NavLinks />}
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<AuthPage page="login" />} />
          <Route path="/register" element={<AuthPage page="register" />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:groupId" element={<GroupDetailPage />} />
            <Route path="/expenses" element={<PersonalExpensesPage />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
