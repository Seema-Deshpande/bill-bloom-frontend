import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import GroupsPage from "./pages/GroupsPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import PersonalExpensesPage from "./pages/PersonalExpensesPage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import GroupSettlementsPage from "./pages/GroupSettlementsPage";
import { groups } from "./data/dummyData";
import useAuth from "./context/useAuth";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Container, Row, Col } from "react-bootstrap";

function AuthLayout({ children }) {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={7} lg={5}>
          {children}
        </Col>
      </Row>
    </Container>
  );
}

function GroupDetailRoute() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const group = groups.find((item) => item._id === groupId);

  return <GroupDetailPage group={group} onBack={() => navigate("/groups")} />;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loading, error, isAuthenticated } = useAuth();

  const handleNavigate = (page, data = null) => {
    switch (page) {
      case "Home":
        navigate("/");
        break;
      case "Auth":
        navigate("/login");
        break;
      case "Register":
        navigate("/register");
        break;
      case "Groups":
        navigate("/groups");
        break;
      case "GroupDetail":
        navigate(data?._id ? `/groups/${data._id}` : "/groups");
        break;
      case "Personal":
        navigate("/expenses");
        break;
      case "Analytics":
        navigate("/analytics");
        break;
      case "Settlements":
        navigate(data?._id ? `/groups/${data._id}/settlements` : "/groups");
        break;
      default:
        navigate("/");
        break;
    }
  };

  const handleLogin = async (email, password) => {
    await login(email, password);
    navigate(location.state?.from || "/", { replace: true });
  };

  const handleRegister = async (data) => {
    await register(data);
    navigate("/login", {
      replace: true,
      state: { message: "Registration successful. Please sign in." },
    });
  };

  return (
    <>
      <Header onNavigate={handleNavigate} />
      <main className="pb-4">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <AuthLayout>
                <LoginForm
                  onLogin={handleLogin}
                  onSwitchToRegister={() => navigate("/register")}
                  authError={error}
                  loading={loading}
                  infoMessage={location.state?.message || ""}
                />
              </AuthLayout>
            )}
          />
          <Route
            path="/register"
            element={isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <AuthLayout>
                <RegisterForm
                  onRegister={handleRegister}
                  onSwitchToLogin={() => navigate("/login")}
                  authError={error}
                  loading={loading}
                />
              </AuthLayout>
            )}
          />
          <Route path="/" element={<ProtectedRoute><HomePage onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path="/groups" element={<ProtectedRoute><GroupsPage onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path="/groups/:groupId" element={<ProtectedRoute><GroupDetailRoute /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><PersonalExpensesPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/groups/:groupId/settlements" element={<ProtectedRoute><GroupSettlementsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
