import { useState } from "react";
import Header from "./components/layout/Header";
import NavLinks from "../src/components/layout/NavLinks";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import GroupsPage from "./pages/GroupsPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import PersonalExpensesPage from "./pages/PersonalExpensesPage";

export default function App() {
  const [activePage, setActivePage] = useState("Home");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = (page, data = null) => {
    setActivePage(page);
    if (page === "GroupDetail" && data) setSelectedGroup(data);
  };

  const renderPage = () => {
    switch (activePage) {
      case "Home":
        return <HomePage onNavigate={navigate} />;
      case "Groups":
        return <GroupsPage onNavigate={navigate} />;
      case "GroupDetail":
        return <GroupDetailPage group={selectedGroup} onBack={() => navigate("Groups")} />;
      case "Personal":
        return <PersonalExpensesPage />;
      case "Auth":
        return <AuthPage page="login" onLogin={() => { setIsLoggedIn(true); navigate("Home"); }} />;
      case "Register":
        return <AuthPage page="register" onLogin={() => { setIsLoggedIn(true); navigate("Home"); }} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <>
      <Header
        activePage={activePage}
        onNavigate={navigate}
        isLoggedIn={isLoggedIn}
        onLogout={() => { setIsLoggedIn(false); navigate("Auth"); }}
      />
      {isLoggedIn && <NavLinks activePage={activePage} onNavigate={navigate} />}
      <main>
        {renderPage()}
      </main>
      <Footer />
    </>
  );
}
