import { useState } from "react";
import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import GroupsPage from "./pages/GroupsPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import PersonalExpensesPage from "./pages/PersonalExpensesPage";

export default function App() {
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setCurrentPage] = useState("home");
  // eslint-disable-next-line no-unused-vars
  const [selectedGroup, setSelectedGroup] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case "auth":
        return <AuthPage page={"login"} />;
      case "groups":
        return <GroupsPage />;
      case "group-detail":
        return selectedGroup ? <GroupDetailPage group={selectedGroup} /> : <GroupsPage />;
      case "personal":
        return <PersonalExpensesPage />;
      case "home":
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
